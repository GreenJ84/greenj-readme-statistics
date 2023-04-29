/** @format */

import fs from "fs";
import { Request } from "express";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "graphql-tag";
import { match } from "ts-pattern";

import {
  GraphQuery,
  ResponseError,
  GIT_URL,
  GITHUB_TOKEN,
} from "../utils/constants";
import { getCacheKey, setCacheData } from "../utils/cache";

import {
  GithRawGraphResponse,
  GithRawProfileData,
  GithRawStreakData,
  GithRawUserData,
  GithRawUserProbe,
  GithUserStreak,
} from "./githubTypes";
import { githRawParse, streakParse } from "./apiParser";

// Get the GraphQL file location based on type
const getGraph = (type: string): string => {
  const graph = match(type)
    //! Direct routes not yet in service
    // .with("stats", () => {
    //   return "src/github/graphql/github-stats.graphql";
    // })
    // .with("trophies", () => {
    //   return "src/github/graphql/github-stats.graphql";
    // })
    // .with("languages", () => {
    //   return "src/github/graphql/github-langs.graphql";
    // })

    .with("streak", () => {
      return "src/github/graphql/github-streak.graphql";
    })
    .with("all", () => {
      return "src/github/graphql/github-all-profile.graphql";
    })
    .run();
  return graph;
};

// Provides all basic GitHub details for GraphQL query
export async function githubGraphQL(
  query: GraphQuery
): Promise<ResponseError | GithRawGraphResponse> {
  const client = new ApolloClient({
    uri: GIT_URL,
    cache: new InMemoryCache(),
  });
  const headers = {
    Authorization: `bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  };

  const result = await client
    .query({
      ...query,
      context: {
        headers,
        method: "GET",
      },
    })
    .then((result) => {
      return result.data as GithRawGraphResponse;
    })
    .catch((err) => {
      throw new ResponseError(
        "Error retrieving data from the external GitHub API",
        err,
        502
      );
    });
  return result;
}

// Decide GraphQL query before execution
export const preQery = async (
  variables: {},
  type: string = "all"
): Promise<GithRawUserData> => {
  const path = getGraph(type);
  const graphql = gql(fs.readFileSync(path, "utf8"));
  const data = await githubGraphQL({
    query: graphql,
    variables: variables,
  })
    .then((res) => res as GithRawUserData)
    .catch((err) => {
      throw new ResponseError(
        "Error building GraphQL query for the GitHub API",
        err,
        500
      );
    });

  // Data to be returned will be of a valid response type
  return data;
};

let profileQueryInProgress: Record<string, Boolean> = {};
export const setGithUserProfile = async (username: string): Promise<void> => {
  if (profileQueryInProgress[username]) {
    throw new ResponseError("This call occured while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
  } else {
    profileQueryInProgress[username] = true;

    let variables = { login: username };
    const queryResponse = await preQery(variables)
      .then((data) => {
        return data as GithRawProfileData;
      })
      .catch((err) => {
        profileQueryInProgress[username] = false;
        throw err;
      });
    
    const [stats, languages] = githRawParse(queryResponse);
    await setCacheData(
      getCacheKey('url/github/stats', username),
      stats
    );

    await setCacheData(
      getCacheKey('url/github/languages', username),
      languages
    );

    await setCacheData(
      getCacheKey('url/github/trophies', username),
      stats
    );
  }

  profileQueryInProgress[username] = false;
  return;
}

export const updateGithUserProfile = async (
  username: string
) => {
  try {
    await setGithUserProfile(username)

  } catch (err) {
    if (err instanceof ResponseError) {
      console.error(
        `Error (${err.error}) updating Github profile data for ${username}: ${err.message}`
      );
    } else {
      console.error(`Error updating Github profile data for ${username}: ${err}`);
    }
  }
  return;
};

// Probes user creation date and years a member for streak query
const streakProbe = async (
  username: string
): Promise<[string, number[]]> => {
  const now = new Date().toISOString();
  const today = now.slice(0, 19);
  const year = now.slice(0, 4);
  const graphql = gql(
    fs.readFileSync("src/github/graphql/streak-probe.graphql", "utf8")
  );
  const variables = {
    login: username,
    start: `${year}-01-01T00:00:00Z`,
    end: today,
  };
  const data = await githubGraphQL({
    query: graphql,
    variables: variables,
  })
    .then((res) => res as GithRawUserProbe)
    .catch((err) => {
      throw new ResponseError(
        "Error building GraphQL query for the GitHub API",
        err,
        500
      );
    });

  return [
    data.user.createdAt,
    [...data.user.contributionsCollection.contributionYears].sort(),
  ];
};

let streakQueryInProgress: Record<string, Boolean> = {};
export const setGithUserStreak = async (req: Request): Promise<void> => {
  const username: string = req.params.username!;

  if (streakQueryInProgress[username]) {
    throw new ResponseError("This call occured while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
  } else {
    streakQueryInProgress[username] = true;
    // Query user data for Creation Date and Years of membership
    const [created, years] = await streakProbe(username).catch(
      (err) => {
        streakQueryInProgress[username] = false;
        throw err;
      }
    );
    // Start data with defaults sets
    let streak: GithUserStreak = {
      total: 0,
      totalText: "Total Contributions",
      totalRange: [
        `${new Date(created as string).toISOString().slice(0, 10)}`,
        `${new Date().toISOString().slice(0, 10)}`,
      ],
      curr: 0,
      currText: "Current Streak",
      currDate: ["", ""],
      longest: 0,
      longestText: "Longest Streak",
      longestDate: ["", ""]
    };
    // starting template variables for query
    let variables = { login: username, start: "", end: "" };

    // Call data for each year
    for (let year of years) {
      // If before year is created year, set start to create data else year start
      if (year == new Date(created as string).getFullYear()) {
        variables.start =
          new Date(created as string).toISOString().slice(0, 19) + "Z";
      } else {
        variables.start = `${year}-01-01T00:00:00Z`;
      }
      // If year is this year, set end to current date else end of year
      if (year == new Date().getFullYear()) {
        variables.end = new Date().toISOString().slice(0, 19) + "Z";
      } else {
        variables.end = `${year}-12-31T00:00:00Z`;
      }
      // Query data for the specific yar
      const data = await preQery(variables, "streak")
        .then((data) => {
          return data as GithRawStreakData;
        })
        .catch((err) => {
          streakQueryInProgress[username] = false;
          throw err;
        });

      // Parse that data with our current stats to update
      streakParse(streak, data);
    }

    await setCacheData(
      getCacheKey(req.path, username),
      streak
    )
  }
  streakQueryInProgress[username] = false;
  return;
};

export const updateGithUserStreak = async (
  req: Request
) => {
  try {
    await setGithUserStreak(req);

  } catch (err) {
    if (err instanceof ResponseError) {
      console.error(
        `Error (${err.error}) updating Github streak data for ${req.params.username}: ${err.message}`
      );
    } else {
      console.error(
        `Error updating Github streak data for ${req.params.username}: ${err}`
      );
    }
  }
  return;
};
