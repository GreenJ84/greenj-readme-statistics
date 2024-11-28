import fs from "fs";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

import { GraphQuery, ResponseError } from "../utils/utils";
import { RawGraphResponse, RawUserData, UserData } from "./types";
import { GITHUB_TOKEN } from "./github_environment";
import { getGraphQuery } from "./utils";

export class GithubQuerier {
  GIT_URL = "https://api.github.com/graphql"

  private client = new ApolloClient({
    uri: this.GIT_URL,
    cache: new InMemoryCache(),
  });

  private async basePlatformQuery(
    query: GraphQuery
  ): Promise<ResponseError | RawGraphResponse> {
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
}