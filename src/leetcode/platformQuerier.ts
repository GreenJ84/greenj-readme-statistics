import fs from "fs";
import { match } from "ts-pattern";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { developmentLogger, GraphQuery, ResponseError } from "../utils/utils";
import { RawGraphResponse, RawUserData, UserData } from "./types";

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
        this.getUserLangs.bind(this)
      )
      .with("completion", () =>
        this.getUserLangs.bind(this)
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