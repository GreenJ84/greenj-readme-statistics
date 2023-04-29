/** @format */

import fs from "fs";
import { Request } from "express";
import { gql } from "graphql-tag";
import { ApolloClient, InMemoryCache } from "@apollo/client";

import {
  LEET_USER_AGENT,
  GraphQuery,
  LEET_GRAPHQL_URL,
  ResponseError,
} from "../utils/constants";
import { get_csrf } from "../utils/credentials";
import { getCacheKey, setCacheData } from "../utils/cache";

import {
  LeetRawDaily,
  LeetRawGraphResponse,
  LeetRawUserProbe,
  LeetRawProfileData,
  LeetUserStreak,
  LeetRawStreakData,
} from "./leetcodeTypes";
import * as leetcode from "../leetcode/query";
import { leetParseDirect, leetRawProfileParse } from "./apiParser";


// Universal query for GitHub
export async function leetcodeQuery(
  query: GraphQuery,
  url: string,
  csrf: string
): Promise<LeetRawGraphResponse> {
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  });
  const headers = {
    "Content-Type": "application/json",
    origin: url,
    referer: url,
    cookie: `csrftoken=${csrf}; LEETCODE_SESSION=;`,
    "x-csrftoken": `${csrf}`,
    "user-agent": LEET_USER_AGENT,
  };

  const result = await client
    .query({
      ...query,
      context: {
        headers,
        method: "POST",
      },
    })
    .then((result) => {
      return result.data as LeetRawGraphResponse;
    })
    .catch((err) => {
      throw new ResponseError(
        "An error occurred while retrieving data from the external LeetCode API",
        err,
        502
      );
    });
  return result;
}

// Set up up query, credential retrieval, Server level error handling
export const leetProfilePreQuery = async (username: string): Promise<LeetRawProfileData> => {
  // Retrieve Cross-site forgery credentials
  const csrf_credential = await get_csrf()
    .then((result) => result.toString())
    .catch((err) => {
      throw err;
    });

  // Get correct query based on api called
  const graphql = gql(
    fs.readFileSync('src/leetcode/graphql/leetcode-all-profile.graphql', "utf8")
  );

  // Call the universal leeetCode querier
  const data = await leetcode
    .leetcodeQuery(
      {
        query: graphql,
        variables: { username: username },
      },
      LEET_GRAPHQL_URL,
      csrf_credential as string
    )
    .then((res) => res as LeetRawProfileData)
    // Catch sever problems conducting the call
    .catch((err) => {
      throw err;
    });
  return data;
};

let profileQueryInProcess = false;
export const setLeetUserProfile = async (username: string): Promise<void> => {
  if (profileQueryInProcess[username]) { 
    // Wait for initial query to have chached data
    throw new ResponseError("This call occured while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
  }
  else{
    profileQueryInProcess[username] = true;
    const queryResponse = await leetProfilePreQuery(username)
      .catch((err) => {
        profileQueryInProcess[username] = false;
        throw err;
      });
    
    const [stats, badges, completion, submission] = leetRawProfileParse(queryResponse);

    await setCacheData(
      getCacheKey("url/leetcode/stats", username),
      stats!
    )

    await setCacheData(
      getCacheKey("url/leetcode/badges", username),
      badges!
    )

    await setCacheData(
      getCacheKey("url/leetcode/completion", username),
      completion!
    )

    await setCacheData(
      getCacheKey("url/leetcode/submission", username),
      submission!
    )
  }
  profileQueryInProcess[username] = false;
  return;
}

export const updateLeetUserProfile = async (
  username: string
): Promise<void> => {
  try {
    await setLeetUserProfile(username);

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

// Set up for profile years probe query
export const leetPreProbe = async (req: Request): Promise<[number[], string]> => {
  // Cross-site forgery credentials
  const csrf_credential: string = await get_csrf()
    .then((result) => result.toString())
    .catch((err) => {
      throw err;
    });
  const graphql = gql(
    fs.readFileSync("src/leetcode/graphql/profile-years-probe.graphql", "utf8")
  );
  // Username which has to be there if preflight passed
  const { username } = req.params;

  // Call the universal leetCode querier
  const data = await leetcode
    .leetcodeQuery(
      {
        query: graphql,
        variables: {
          username: username!,
          year: parseInt(new Date().toISOString().slice(0, 4)),
        },
      },
      LEET_GRAPHQL_URL,
      csrf_credential
    )
    .then((res) => res as LeetRawUserProbe)
    .catch((err) => {
      throw err;
    });

  return [data.matchedUser.userCalendar.activeYears, csrf_credential];
};

let streakQueryInProgress = {};
export const setLeetUserStreak = async (req: Request): Promise<void> => {
  const username = req.params.username!;
  if (streakQueryInProgress[username]) {
    // Wait for initial query to have chached data
    throw new ResponseError("This call occured while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
  }
  else {
    streakQueryInProgress[username] = true;
    const preSet = await leetPreProbe(req)
      .catch((err) => {
        streakQueryInProgress[username] = false;
        throw new ResponseError(
          "Error build probe query for user membership length",
          err,
          502
        );
      });
    const [membershipYears, csrf_credential] = preSet;
    const graphql = gql(
      fs.readFileSync("src/leetcode/graphql/leetcode-streak.graphql", "utf8")
    );

    const streakData: LeetUserStreak = {
      streak: [0, 0],
      totalActive: 0,
      mostActiveYear: 0,
      completion: "0.00",
      completionActuals: [0, 0],
    };
    const parseStreak = leetParseDirect(req);
    // Call the universal leetCode querier for each year
    for (let year of membershipYears) {
      const data = await leetcodeQuery(
        {
          query: graphql,
          variables: { username: req.params.username!, year: year },
        },
        LEET_GRAPHQL_URL,
        csrf_credential
      )
        .then((res) => {
          return res as LeetRawStreakData;
        })
        .catch((err) => {
          streakQueryInProgress[username] = false;
          throw new ResponseError(
            "Error building LeetCode streak GraphQL query",
            err,
            500
          );
        });

      parseStreak(streakData, data, year);
    }
    setCacheData(
      getCacheKey(req.path, req.params.username!),
      streakData
    );
  }
  streakQueryInProgress[username] = false;
  return;
};

export const updateLeetUserStreak = async (
  req: Request
): Promise<void> => {
  try {
    await setLeetUserStreak(req);

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
  return;
};

export const startLeetcodeDaily = async () => {
  const cacheKey = `leetcode:daily`;
  // Retrieve Cross-site forgery credentials
  const csrf_credential = await get_csrf()
    .then((result) => result.toString())
    .catch((err) => {
      throw err;
    });

  // Get correct query based on api called
  const graphql = gql(
    fs.readFileSync(
      "src/leetcode/graphql/leetcode-daily-question.graphql",
      "utf8"
    )
  );

  // Call the universal leetCode querier
  const data = await leetcodeQuery(
    {
      query: graphql,
    },
    LEET_GRAPHQL_URL,
    csrf_credential as string
  )
    .then((res) => res as LeetRawDaily)
    // Catch sever problems conducting the call
    .catch((err) => {
      throw new ResponseError(
        "Error building LeetCode daily question GraphQL query",
        err,
        500
      );
    });

  setCacheData(cacheKey, data);

  const localNow = new Date(new Date().toLocaleString());
  const utcMidnight = new Date(
    Date.UTC(
      localNow.getUTCFullYear(),
      localNow.getUTCMonth(),
      localNow.getUTCDate() + 1,
      0,
      0,
      0,
      0
    )
  );
  const millisecUntilMidnightUTC = utcMidnight.getTime() - localNow.getTime();

  // Wait until 10 min after UTC Midnight for new question
  setTimeout(() => {
    // Set interval to retrieve every 24 hrs
    setInterval(async () => {
      const csrf_credential = await get_csrf()
        .then((result) => result.toString())
        .catch((err) => {
          console.error(err);
        });

      // Call the universal leetCode querier
      const data = await leetcodeQuery(
        {
          query: graphql,
        },
        LEET_GRAPHQL_URL,
        csrf_credential as string
      )
        .then((res) => res as LeetRawDaily)
        // Catch sever problems conducting the call
        .catch((err) => {
          throw new ResponseError(
            "Error building LeetCode daily question GraphQL query",
            err,
            500
          );
        });

      setCacheData(cacheKey, data);
    }, 24 * 60 * 60 * 1000);
  }, 1000 * 60 * 10 + millisecUntilMidnightUTC);
};
