import fs from 'fs';
import { Request, Response } from 'express';
import { gql } from "graphql-tag";
import { ApolloClient, InMemoryCache } from "@apollo/client";

import { USER_AGENT, GraphQLQuery, GRAPHQL_URL, ResponseError } from "../utils/constants";
import { LeetCodeGraphQLResponse, ProbeResponse } from "./leetcodeTypes";

import { get_csrf } from '../utils/credentials';
import * as leetcode from '../leetcode/query';



// Universal query for GitHub
export async function leetcodeGraphQL(query: GraphQLQuery, url: string, csrf: string):
    Promise<LeetCodeGraphQLResponse | ResponseError> {
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
                } as ResponseError
        });
    return result;
};



// Set up up query, credential retrieval, Server level error handling
export const preQuery = async (req: Request, res: Response, type: string):
Promise<LeetCodeGraphQLResponse | Boolean> => {
    type;
    // Retrieve Cross-site forgery credentials
    const csrf_credential: string = await get_csrf()
    .then((result) => result.toString());
    
    // Get correct query based on api called
    const graphql = gql(
        fs.readFileSync('src/leetcode/graphql/leetcode-all-profile.graphql', 'utf8')
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
        // Catch sever problems conducting the call
        .catch((err) => {
            return {
                message: "Internal server error",
                error: err,
                error_code: 500,
            } as ResponseError;
        })
        // Send API errors if they have occured
    if ((data as ResponseError).error !== undefined) {
            console.error(data as ResponseError)
            res.status((data as ResponseError).error_code).send(data);
            return false;
        }
        return data as LeetCodeGraphQLResponse
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
            } as ResponseError;
        })
    // Return API errors if they have occured
    if ((data as ResponseError).error !== undefined) {
        res.status(400).send((data as unknown as ResponseError));
        return false;
    }
    return [(data as ProbeResponse).matchedUser.userCalendar.activeYears, csrf_credential];
}