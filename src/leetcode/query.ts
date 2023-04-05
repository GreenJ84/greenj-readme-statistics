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
    Promise<LeetCodeGraphQLResponse> {
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
            throw new ResponseError("An error occurred while retrieving data from the external LeetCode API",
                err, 502,
            );
        });
    return result;
};



// Set up up query, credential retrieval, Server level error handling
export const preQuery = async (req: Request, type: string):
Promise<LeetCodeGraphQLResponse> => {
    type;
    // Retrieve Cross-site forgery credentials
    const csrf_credential = await get_csrf()
        .then((result) => result.toString())
        .catch((err) => {
            throw new ResponseError("Internal server error retrieving LeetCode credentials",
                err, 500,
            );
        });
    
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
        csrf_credential as string
        )
        .then((res) => res)
        // Catch sever problems conducting the call
        .catch((err) => {
            throw new ResponseError("Internal server error building LeetCode Graph call",
                err, 500,
            );
        })

    return data
};


// Set up for profile years probe query
export const preProbe = async (req: Request):
Promise<[number[], string]> => {
    // Cross-site forgery credentials
    const csrf_credential: string = await get_csrf()
        .then((result) => result.toString())
        .catch((err) => {
            throw new ResponseError("Internal server error retrieving LeetCode credentials",
                err, 500,
            );
        });
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
        .then((res) => res as ProbeResponse)
        .catch((err) => {
            throw new ResponseError("Internal server error building LeetCode Graph call",
                err, 500,
            );
        })

    return [data.matchedUser.userCalendar.activeYears, csrf_credential];
}