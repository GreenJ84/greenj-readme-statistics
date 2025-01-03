import fs from "fs";
import { match } from "ts-pattern";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { developmentLogger, GraphQuery, ResponseError } from "../utils/utils";
import { RawGraphResponse, RawProfileData, RawStreakData, RawUserBadges, RawUserCompletion, RawUserData, RawUserProbe, RawUserStats, RawUserSubmissions, UserBadges, UserCompletion, UserData, UserProfile, UserStats, UserStreak, UserSubmissions } from "./types";
import { badgesParse, completionParse, statsParse, streakParse, submissionsParse } from "./dataParsers";

export class LeetCodeQuerier {
  private LEET_BASE = "https://leetcode.com";
  private LEET_GRAPHQL_URL = "https://leetcode.com/graphql";
  // private LEET_GRAPHQL_URL_CN = "https://leetcode.cn/graphql";
  private USER_AGENT = "Mozilla/5.0 LeetCode API";
  private client = new ApolloClient({
    uri: this.LEET_GRAPHQL_URL,
    cache: new InMemoryCache(),
  });

  private async basePlatformQuery(
    query: GraphQuery
  ): Promise<RawGraphResponse> {
    const headers = {
      "Content-Type": "application/json",
      origin: this.LEET_GRAPHQL_URL,
      referer: this.LEET_BASE+`/${query.variables!.login}/`,
      "user-agent": this.USER_AGENT,
    };
    const result = await this.client.query({
      ...query,
      context: {
        headers,
        method: "POST",
      },
    })
    .then((result) => {
      return result.data as RawGraphResponse;
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

  private async querySetup(
    variables: {},
    type: string
  ): Promise<RawUserData> {
    const path = match(type)
      .with("stats", () => {return "src/leetcode/graphql/leetcode-stats.graphql"})
      .with("badges", () => {return "src/leetcode/graphql/leetcode-badges.graphql"})
      .with("completion", () => {return "src/leetcode/graphql/leetcode-completion.graphql"})
      .with("submissions", () => { return "src/leetcode/graphql/leetcode-submissions.graphql" })
      .with("profile", () => { return "src/leetcode/graphql/leetcode-all-profile.graphql" })
      .with ("probe", () => { return "src/leetcode/graphql/profile-years-probe.graphql" })
      .with("streak", () => { return "src/leetcode/graphql/leetcode-streak.graphql" })
      .with("daily", () => { return "src/leetcode/graphql/leetcode-daily-question.graphql" })
      .run();
    const graphql = gql(fs.readFileSync(path, "utf8"));

    return await this.basePlatformQuery({
      query: graphql,
      variables: variables,
    })
    .then(res => res as RawUserData)
    .catch(err => {
      developmentLogger(console.error, err);
      throw err;
    });
  }

  private profileQueryInProgress: Record<string, Boolean> = {};
  private async getUserProfile(username: string): Promise<UserProfile>{
    if (this.profileQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.profileQueryInProgress[username] = true;
    const variables = {
      username: username!,
      year: parseInt(new Date().toISOString().slice(0, 4)),
    };
    const response = await this.querySetup(variables, "profile")
      .then((data: RawUserData) => {
        return data as RawProfileData;
      })
      .catch((err) => {
        this.statsQueryInProgress[username] = false;
        throw err instanceof ResponseError ? err : new ResponseError(
          "Error building Profile query for the LeetCode API",
          err,
          500
        );
      });

    this.profileQueryInProgress[username] = false;
    return {
      stats: statsParse(response as RawUserStats),
      badges: badgesParse(response as RawUserBadges),
      completion: completionParse(response as RawUserCompletion),
      submissions: submissionsParse(response as RawUserSubmissions),
      streak: await this.captureStreakFromProbeData(response as RawUserProbe, username),
    };
  }

  private statsQueryInProgress: Record<string, Boolean> = {};
  private async getUserStats(username: string): Promise<UserStats>{
    if (this.profileQueryInProgress[username] || this.statsQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.statsQueryInProgress[username] = true;

    let variables = { username: username! };
    const queryResponse = await this.querySetup(variables, "stats")
      .then((data: RawUserData) => {
        return data as RawUserStats;
      })
      .catch((err) => {
        this.statsQueryInProgress[username] = false;
        throw err instanceof ResponseError ? err : new ResponseError(
          "Error building Stats query for the LeetCode API",
          err,
          500
        );
      });

      this.statsQueryInProgress[username] = false;
      return statsParse(queryResponse);
  }

  private badgesQueryInProgress: Record<string, Boolean> = {};
  private async getUserBadges(username: string): Promise<UserBadges>{
    if (this.profileQueryInProgress[username] || this.badgesQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.badgesQueryInProgress[username] = true;

    let variables = { username: username! };
    const queryResponse = await this.querySetup(variables, "badges")
      .then((data: RawUserData) => {
        return data as RawUserBadges;
      })
      .catch((err) => {
        this.statsQueryInProgress[username] = false;
        throw err instanceof ResponseError ? err : new ResponseError(
          "Error building Badges query for the LeetCode API",
          err,
          500
        );
      });

      this.statsQueryInProgress[username] = false;
      return badgesParse(queryResponse);
  }

  private completionQueryInProgress: Record<string, Boolean> = {};
  private async getUserCompletion(username: string): Promise<UserCompletion>{
    if (this.profileQueryInProgress[username] || this.completionQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.completionQueryInProgress[username] = true;

    let variables = { username: username! };
    const queryResponse = await this.querySetup(variables, "completion")
      .then((data: RawUserData) => {
        return data as RawUserCompletion;
      })
      .catch((err) => {
        this.completionQueryInProgress[username] = false;
        throw err instanceof ResponseError ? err : new ResponseError(
          "Error building Completion query for the LeetCode API",
          err,
          500
        );
      });

      this.completionQueryInProgress[username] = false;
      return completionParse(queryResponse);
  }

  private submissionsQueryInProgress: Record<string, Boolean> = {};
  private async getUserSubmissions(username: string): Promise<UserSubmissions>{
    if (this.profileQueryInProgress[username] || this.submissionsQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.submissionsQueryInProgress[username] = true;

    let variables = { username: username! };
    const queryResponse = await this.querySetup(variables, "submissions")
      .then((data: RawUserData) => {
        return data as RawUserSubmissions;
      })
      .catch((err) => {
        this.submissionsQueryInProgress[username] = false;
        throw err instanceof ResponseError ? err : new ResponseError(
          "Error building Submissions query for the LeetCode API",
          err,
          500
        );
      });

      this.submissionsQueryInProgress[username] = false;
      return submissionsParse(queryResponse);
  }

  private async streakProbe(
    username: string
  ): Promise<RawUserProbe> {
    const variables = {
      username: username!,
      year: parseInt(new Date().toISOString().slice(0, 4)),
    };
    const data = await this.querySetup(variables, "probe")
    .then((data: RawUserData) => {
      return data as RawUserProbe;
    })
    .catch((err) => {
      throw err instanceof ResponseError ? err : new ResponseError(
        "Error building Streak active years query for the LeetCode API",
        err,
        500
      );
    });

    return data;
  };

  private streakQueryInProgress: Record<string, Boolean> = {};
  private async getUserStreak(username: string): Promise<UserStreak> {
    if (this.profileQueryInProgress[username] || this.streakQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.streakQueryInProgress[username] = true;

    const probeData = await this.streakProbe(username).catch(
      (err) => {
        this.streakQueryInProgress[username] = false;
        throw err;
      }
    );
    try {
      const streakPromise = this.captureStreakFromProbeData(probeData, username);
      this.streakQueryInProgress[username] = false;
      return streakPromise;
    } catch (err) {
      console.error(`Error capturing streak for ${username}:`, err);
      this.streakQueryInProgress[username] = false;
      throw err;
    }
  }

  private async captureStreakFromProbeData(
    response: RawUserProbe,
    username: string
  ): Promise<UserStreak> {

    const streakData: UserStreak = {
      streak: [0, 0],
      totalActive: 0,
      mostActiveYear: 0,
      completion: "0.00",
      completionActuals: [0, 0],
    };
    for (let year of response.matchedUser.userCalendar.activeYears) {
      const data = await this.querySetup(
        { username: username, year: year },
        "streak"
      )
      .then((res) => {
        return res as RawStreakData;
      })
      .catch((err) => {
        this.streakQueryInProgress[username] = false;
        throw new ResponseError(
          "Error querying LeetCode streak data",
          err,
          500
        );
      });
      streakParse(streakData, data, year);
    }

    this.streakQueryInProgress[username] = false;
    return streakData;
  };

  getUserData(route: string): (username: string)  => Promise<UserData>
  {
    return match(route)
      .with("profile", () =>
        this.getUserProfile.bind(this)
      )
      .with("stats", () =>
        this.getUserStats.bind(this)
      )
      .with("badges", () =>
        this.getUserBadges.bind(this)
      )
      .with("completion", () =>
        this.getUserCompletion.bind(this)
      )
      .with("submissions", () =>
        this.getUserSubmissions.bind(this)
      )
      .with("streak", () =>
        this.getUserStreak.bind(this)
      )
      .run();
  }
}