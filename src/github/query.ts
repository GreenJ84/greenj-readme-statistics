import fs from 'fs';
import { Request, Response } from 'express';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "graphql-tag";
import { match } from 'ts-pattern';

import { GraphQLQuery, GraphQLError, GIT_URL } from '../utils/constants';
import { GraphQLResponse } from './githubTypes';

const token = "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";

// Get the GraphQL file location based on type
const getGraph = (type: string): string => {
    const graph = match(type)
        .with("stats", () => {return "src/github/graphql/guthub-stats.graphql"})
        .with("trophies", () => {return "src/github/graphql/guthub-stats.graphql"})
        .with("languages", () => {return "src/github/graphql/github-langs.graphql"})
        .with("streak", () => { return "src/github/graphql/github-streak.graphql" })
        .run()
    return graph
}

// Provides all basic GitHub details for GraphQL query
export async function githubGraphQL(query: GraphQLQuery): Promise<GraphQLError | GraphQLResponse> {
    const client = new ApolloClient({
        uri: GIT_URL,
        cache: new InMemoryCache(),
    });
    const headers = {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
    };
    
    const result = await client.query(
        {
            ...query,
            context: {
                headers,
                method: 'GET',
            }
        }
    )
        .then(result => {
            return result.data as GraphQLResponse
        })
        .catch(err => {
            return {
                    message: "An error occurred while retrieving data from the external API",
                    error_code: 500,
                    error: err
                } as GraphQLError
        });
    return result;
};

// Decide GraphQL query before execution
export const preQery = async (req: Request, res: Response, variables: {}): Promise<GraphQLError | GraphQLResponse> => {
    const type = req.path.split("/")[2]!;
    const path = getGraph(type);
    const graphql = gql(
        fs.readFileSync(path, 'utf8')
    );
    const data = await githubGraphQL(
        {
            query: graphql,
            variables: variables
        })
        .then((res) => res as GraphQLResponse)
        .catch((err) => {
            return {
                message: "Internal server error",
                error: err,
                error_code: 500,
            } as GraphQLError;
        })
    // Return API errors if they have occured
    if ((data as GraphQLError).error !== undefined) {
        res.status(400).send(data);
    }
    // Data to be returned will be of a valid response type
    return data as GraphQLResponse;
}