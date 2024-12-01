import fs from "fs";
import { match } from "ts-pattern";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { developmentLogger, GraphQuery, ResponseError } from "../utils/utils";
import { RawGraphResponse, RawUserBadges, RawUserCompletion, RawUserData, RawUserStats, UserBadges, UserCompletion, UserData, UserStats } from "./types";

import { getGraphQuery } from "./utils";

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
    const path = getGraphQuery(type);
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
        throw err;
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

    let variables = { login: username };
    const queryResponse = await this.querySetup(variables, "badges")
      .then((data: RawUserData) => {
        return data as RawUserBadges;
      })
      .catch((err) => {
        this.statsQueryInProgress[username] = false;
        throw err;
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

    let variables = { login: username };
    const queryResponse = await this.querySetup(variables, "completion")
      .then((data: RawUserData) => {
        return data as RawUserCompletion;
      })
      .catch((err) => {
        this.statsQueryInProgress[username] = false;
        throw err;
      });

      this.statsQueryInProgress[username] = false;
      return completionParse(queryResponse);
  }

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
        this.getUserLangs.bind(this)
      )
      .with("streak", () =>
        this.getUserStreak.bind(this)
      )
      .run();
  }
}