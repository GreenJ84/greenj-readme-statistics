import fs from "fs";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { GraphQuery, ResponseError } from "../utils/utils";
import { RawGraphResponse, RawProfileData, RawStreakData, RawUserData, RawUserLanguages, RawUserProbe, RawUserStats, UserData, UserLanguages, UserProfile, UserStats, UserStreak } from "./types";
import { GITHUB_TOKEN } from "./github_environment";
import { getGraphQuery } from "./utils";
import { match } from "ts-pattern";
import { langsParse, statsParse, streakParse } from "./dataParsers";

export class GithubQuerier {
  GIT_URL = "https://api.github.com/graphql"

  private client = new ApolloClient({
    uri: this.GIT_URL,
    cache: new InMemoryCache(),
  });

  private async basePlatformQuery(
    query: GraphQuery
  ): Promise<RawGraphResponse> {
    const headers = {
      Authorization: `bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    };

    const result = await this.client.query({
      ...query,
      context: {
        headers,
        method: "POST",
      },
    })
    .then(result => result.data as RawGraphResponse)
    .catch(err => {
      throw new ResponseError(
        "Error retrieving data from the external GitHub API",
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
      throw new ResponseError(
        "Error building GraphQL query for the GitHub API",
        err,
        500
      );
    });
  }

  private profileQueryInProgress: Record<string, Boolean> = {};
  private async getUserProfile(username: string): Promise<UserProfile>{

  }

  private statsQueryInProgress: Record<string, Boolean> = {};
  private async getUserStats(username: string): Promise<UserStats>{

  }

  private langsQueryInProgress: Record<string, Boolean> = {};
  private async getUserLangs(username: string): Promise<UserLanguages>{
    if (this.profileQueryInProgress[username] || this.langsQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.langsQueryInProgress[username] = true;

    let variables = { login: username };
    const queryResponse = await this.querySetup(variables, "langs")
      .then((data: RawUserData) => {
        return data as RawUserLanguages;
      })
      .catch((err) => {
        this.langsQueryInProgress[username] = false;
        throw err;
      });

    return langsParse(queryResponse);
  }

  private streakQueryInProgress: Record<string, Boolean> = {};
  private async getUserStreak(username: string): Promise<UserStreak> {

  }

  getUserData(route: string): (username: string)  => Promise<UserData>
  {
    return match(route)
      .with("all", () =>
        this.getUserProfile
      )
      .with("stats", () =>
        this.getUserStats
      )
      .with("langs", () =>
        this.getUserLangs
      )
      .with("streak", () =>
        this.getUserStreak
      )
      .run();
  }
}