import fs from 'fs';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "graphql-tag";
import { match } from 'ts-pattern';

import { GraphQLQuery, GraphQLError, GIT_URL } from '../utils/constants';
import { GraphQLResponse, StreakProbe } from './githubTypes';

dotenv.config()

const token = process.env.GITHUB_TOKEN;

// Get the GraphQL file location based on type
const getGraph = (type: string): string => {
    const graph = match(type)
        .with("stats", () => {return "src/github/graphql/github-stats.graphql"})
        .with("trophies", () => {return "src/github/graphql/github-stats.graphql"})
        .with("languages", () => {return "src/github/graphql/github-langs.graphql"})
        .with("streak", () => { return "src/github/graphql/github-streak.graphql" })
        .with("all", () => { return "src/github/graphql/github-all-profile.graphql" })
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
export const preQery = async (res: Response, variables: {}, type: string): Promise<GraphQLResponse | Boolean> => {
    const path = getGraph(type === "streak" ? type : "all");
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
        console.error((data as GraphQLError));
        res.status((data as GraphQLError).error_code).send(data);
        return false;
    }
    // Data to be returned will be of a valid response type
    return data as GraphQLResponse;
}

// Probes user creation date and years a member for streak query
export const streakProbe = async (req: Request, res: Response): Promise<[string | boolean, number[]]> => {
    const now = new Date().toISOString()
    const today = now.slice(0, 19);
    const year = now.slice(0,4)
    const graphql = gql(
        fs.readFileSync("src/github/graphql/streak-probe.graphql", 'utf8')
    );
    const variables = {
        login: req.params.username!,
        start: `${year}-01-01T00:00:00Z`,
        end: today
    }
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

    // Return API errors if they have occured and flag call termination
    if ((data as GraphQLError).error !== undefined) {
        res.status((data as GraphQLError).error_code).send(data);
        return [false, [0]];
    } else {
        return [
            (data as GraphQLResponse as StreakProbe).user.createdAt,
            [...(data as GraphQLResponse as StreakProbe).user.contributionsCollection.contributionYears].sort()];
    }
    
}