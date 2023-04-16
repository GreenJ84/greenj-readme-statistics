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
import { setCacheData } from "../utils/cache";
import { Themes, ThemeType } from "../utils/themes";

import {
  GithRawGraphResponse,
  GithRawProfileData,
  GithRawStreakData,
  GithRawUserData,
  GithRawUserProbe,
  GithUserStreak,
} from "./githubTypes";
import { getGithResponseParse } from "./apiParser";

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

export const updateUser = async (
  key: string,
  intervalId: NodeJS.Timer,
  username: string
) => {
  try {
    const queryRepsonse = await preQery({ login: username })
      .then((data) => {
        return data as GithRawProfileData;
      })
      .catch((err) => {
        throw err;
      });

    await setCacheData(key, {
      interval: intervalId,
      data: queryRepsonse,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      console.error(
        `Error (${err.error}) updating user data for ${username}: ${err.message}`
      );
    } else {
      console.error(`Error updating user data for ${username}: ${err}`);
    }
  }
};

// Probes user creation date and years a member for streak query
export const streakProbe = async (
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

export const streakQuery = async (req: Request): Promise<GithUserStreak> => {
  // Query user data for Creation Date and Years of membership
  const [created, years] = await streakProbe(req.params.username!).catch(
    (err) => {
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
    longestDate: ["", ""],
    theme:
      req.query.theme !== undefined
        ? (Themes[req.query.theme! as string] as ThemeType)
        : ({
            ...Themes["black-ice"]!,
            hideBorder: false,
            borderRadius: 10,
            locale: "en",
          } as ThemeType),
  };
  // starting template variables for query
  const { username } = req.params;
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
        throw err;
      });

    // Get Function to parse data
    const parse = getGithResponseParse(req);
    // Parse that data with our current stats to update
    parse(streak, data);
  }
  return streak;
};

export const updateStreak = async (
  key: string,
  intervalId: NodeJS.Timer,
  req: Request
) => {
  try {
    const queryResponse = await streakQuery(req).catch((err) => {
      throw err;
    });

    await setCacheData(key, {
      interval: intervalId,
      data: queryResponse,
    });
  } catch (err) {
    if (err instanceof ResponseError) {
      console.error(
        `Error (${err.error}) updating user data for ${req.params.username}: ${err.message}`
      );
    } else {
      console.error(
        `Error updating user data for ${req.params.username}: ${err}`
      );
    }
  }
};
