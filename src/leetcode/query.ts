import fs from 'fs';
import { Request, Response } from 'express';
import { gql } from "graphql-tag";
import { ApolloClient, InMemoryCache } from "@apollo/client";

import { USER_AGENT, GraphQLQuery, GRAPHQL_URL, GraphQLError } from "../utils/constants";
import { LeetCodeGraphQLResponse, ProbeResponse } from "./leetcodeTypes";
import { getGraph } from './leetcodeUtils';
import * as leetcode from '../leetcode/query';
import { get_csrf } from '../utils/credentials';



// Universal query for GitHub
export async function leetcodeGraphQL(query: GraphQLQuery, url: string, csrf: string):
    Promise<LeetCodeGraphQLResponse | GraphQLError> {

    const client = new ApolloClient({
        uri: url,
        cache: new InMemoryCache(),
    });
    const headers = {
        'Content-Type': 'application/json',
        origin: url,
        referer: url,
        cookie: `csrftoken=${csrf}; LEETCODE_SESSION=;`,
        "x-csrftoken": `${csrf}`,
        "user-agent": USER_AGENT,
    };
    
    const result = await client.query(
        {
            ...query,
            context: {
                headers,
                method: 'POST',
            }
        }
    )
        .then(result => {
            return result.data as LeetCodeGraphQLResponse
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


// Set up for profile years probe query
export const preProbe = async (req: Request, res: Response):
Promise<[number[], string] | boolean> => {
    // Cross-site forgery credentials
    const csrf_credential: string = await get_csrf()
        .then((result) => result.toString());
    const graphql = gql(
        fs.readFileSync("src/leetcode/graphql/profile-years-probe.graphql", 'utf8')
    );
    // Username which has to be there if preflight passed
    const { username } = req.params;

    // Call the universal leetCode querier
    const data = await leetcode.leetcodeGraphQL(
        {
            query: graphql,
            variables: { username: username!, year: parseInt(new Date().toISOString().slice(0, 4)) }
        },
        GRAPHQL_URL,
        csrf_credential
    )
        .then((res) => res as unknown as ProbeResponse)
        .catch((err) => {
            return {
                message: "Internal server error",
                error: err,
                error_code: 500,
            } as GraphQLError;
        })
    // Return API errors if they have occured
    if ((data as GraphQLError).error) {
        res.status(400).send((data as unknown as GraphQLError));
        return false;
    }
    return [(data as ProbeResponse).matchedUser.userCalendar.activeYears, csrf_credential];
}


// Set up up query, credential retrieval, Server level error handling
export const preQuery = async (req: Request, res: Response, type: string):
    Promise<LeetCodeGraphQLResponse | GraphQLError> => {

    // Cross-site forgery credentials
    const csrf_credential: string = await get_csrf()
        .then((result) => result.toString());

    // Get correct query based on api called
    const path = getGraph(type);
    const graphql = gql(
        fs.readFileSync(path, 'utf8')
    );

    // Username which has to be there if preflight passed
    const { username } = req.params;

    // Call the universal leetCode querier
    const data = await leetcode.leetcodeGraphQL(
        {
            query: graphql,
            variables: { username: username! }
        },
        GRAPHQL_URL,
        csrf_credential
    )
        .then((res) => res)
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
    return data
};