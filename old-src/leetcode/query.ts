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
  LEET_CRED_URL,
} from "../utils/constants";
import { getCacheKey, setCacheData } from "../utils/cache";

import {
  LeetRawDaily,
  LeetRawGraphResponse,
  LeetRawUserProbe,
  LeetRawProfileData,
  LeetUserStreak,
  LeetRawStreakData,
} from "./leetcodeTypes";
import { leetParseDirect, leetRawProfileParse } from "./apiParser";


// Universal query for LeetCode, throws ResponseError
export async function leetPlatformQuerier(
  query: GraphQuery,
  uri: string,
  username: string
): Promise<LeetRawGraphResponse> {
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
  const headers = {
    "Content-Type": "application/json",
    origin: uri,
    referer: LEET_CRED_URL+`/${username}/`,
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

// Set up profile query, throws ResponseError
export const leetProfileQuery = async (username: string): Promise<LeetRawProfileData> => {
  // Get correct query based on api called
  const graphql = gql(
    fs.readFileSync('src/leetcode/graphql/leetcode-all-profile.graphql', "utf8")
  );
  const data = await leetPlatformQuerier(
      {
        query: graphql,
        variables: { username: username },
      },
      LEET_GRAPHQL_URL,
      username
    )
    .then((res) => res)
  return data as LeetRawProfileData;
};

let profileQueryInProcess: Record<string, boolean> = {};
export const setLeetUserProfile = async (username: string): Promise<void> => {
  if (profileQueryInProcess[username]) {
    throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
  }
  profileQueryInProcess[username] = true;
  const queryResponse = await leetProfileQuery(username)
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
  profileQueryInProcess[username] = false;
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
export const leetStreakPreProbe = async (req: Request): Promise<number[]> => {
  const graphql = gql(
    fs.readFileSync("src/leetcode/graphql/profile-years-probe.graphql", "utf8")
  );
  // Username has to be there if preflight passed
  const username = req.params.username!;
  const data = await leetPlatformQuerier(
      {
        query: graphql,
        variables: {
          username: username!,
          year: parseInt(new Date().toISOString().slice(0, 4)),
        },
      },
      LEET_GRAPHQL_URL,
      username
    )
    .then((res) => res as LeetRawUserProbe)
  return data.matchedUser.userCalendar.activeYears;
};

let streakQueryInProgress: Record<string, boolean> = {};
export const setLeetUserStreak = async (req: Request): Promise<void> => {
  const username = req.params.username!;
  if (streakQueryInProgress[username]) {
    throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
  }

  streakQueryInProgress[username] = true;
  const preSet = await leetStreakPreProbe(req)
    .catch((err) => {
      streakQueryInProgress[username] = false;
      throw new ResponseError(
        "Error querying probe for user membership length",
        err,
        502
      );
    });
  const membershipYears = preSet;
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
  for (let year of membershipYears) {
    const data = await leetPlatformQuerier(
      {
        query: graphql,
        variables: { username: username, year: year },
      },
      LEET_GRAPHQL_URL,
      username
    )
      .then((res) => {
        return res as LeetRawStreakData;
      })
      .catch((err) => {
        streakQueryInProgress[username] = false;
        throw new ResponseError(
          "Error querying LeetCode streak data",
          err,
          500
        );
      });
    parseStreak(streakData, data, year);
  }
  setCacheData(
    getCacheKey(req.path, username),
    streakData
  );
  streakQueryInProgress[username] = false;
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
};

export const leetDailyQuestionQuery = async () => {
  const cacheKey = `leetcode:daily`;
  const graphql = gql(
    fs.readFileSync(
      "src/leetcode/graphql/leetcode-daily-question.graphql",
      "utf8"
    )
  );

  // Call the universal leetCode querier
  const data = await leetPlatformQuerier(
    {
      query: graphql,
    },
    LEET_GRAPHQL_URL,
    "GreenJ84"
  )
    .then((res) => res as LeetRawDaily)
    .catch((err) => {
      throw new ResponseError(
        "Error building LeetCode daily question GraphQL query",
        err,
        500
      );
    });
  setCacheData(cacheKey, data);
}

export const leetDailyQuestionInterval = async () => {
  leetDailyQuestionQuery();
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
  const cacheKey = `leetcode:daily`;
  const graphql = gql(
    fs.readFileSync(
      "src/leetcode/graphql/leetcode-daily-question.graphql",
      "utf8"
    )
  );
  // Wait until 10 min after UTC Midnight for new question
  setTimeout(() => {
    // Set interval to retrieve every 24 hrs
    setInterval(async () => {
      // Call the universal leetCode querier
      const data = await leetPlatformQuerier(
        {
          query: graphql,
        },
        LEET_GRAPHQL_URL,
        "GreenJ84"
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
