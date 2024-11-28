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
    if (this.profileQueryInProgress[username] || this.statsQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.statsQueryInProgress[username] = true;

    let variables = { login: username };
    const queryResponse = await this.querySetup(variables, "stats")
      .then((data: RawUserData) => {
        return data as RawUserStats;
      })
      .catch((err) => {
        this.statsQueryInProgress[username] = false;
        throw err;
      });

    return statsParse(queryResponse);
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
        this.statsQueryInProgress[username] = false;
        throw err;
      });

    return langsParse(queryResponse);
  }

  async streakProbe(
    username: string
  ): Promise<[string, number[]]> {
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
    const data = await this.basePlatformQuery({
      query: graphql,
      variables: variables,
    })
      .then((res) => res as RawUserProbe)
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

  private streakQueryInProgress: Record<string, Boolean> = {};
  private async getUserStreak(username: string): Promise<UserStreak> {
    if (this.profileQueryInProgress[username] || this.streakQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    this.streakQueryInProgress[username] = true;

    const [created, years] = await this.streakProbe(username).catch(
      (err) => {
        this.streakQueryInProgress[username] = false;
        throw err;
      }
    );

    let streak: UserStreak = {
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

    let variables = { login: username, start: "", end: "" };
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
      const queryResponse = await this.querySetup(variables, "langs")
      .then((data: RawUserData) => {
        return data as RawStreakData;
      })
      .catch((err) => {
        this.streakQueryInProgress[username] = false;
        throw err;
      });

      // Parse that data with our current stats to update
      streak = streakParse(queryResponse, streak);
    }

    return streak;
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