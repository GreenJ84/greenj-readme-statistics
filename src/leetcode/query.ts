import fs from 'fs';
import { Request } from 'express';
import { gql } from "graphql-tag";
import { ApolloClient, InMemoryCache } from "@apollo/client";

import { USER_AGENT, GraphQLQuery, GRAPHQL_URL, ResponseError } from "../utils/constants";
import { LeetCodeGraphQLResponse, ProbeResponse, ProfileResponse, STREAKDATA, StreakResponse } from "./leetcodeTypes";

import { get_csrf } from '../utils/credentials';
import * as leetcode from '../leetcode/query';
import { getCacheKey, setCacheData } from '../utils/cache';
import { parseDirect } from './apiParser';
import { THEMES } from '../utils/themes';



// Universal query for GitHub
export async function leetcodeGraphQL(query: GraphQLQuery, url: string, csrf: string):
    Promise<LeetCodeGraphQLResponse> {
    const fetch = require('fetch');
    fetch;
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
            throw new ResponseError(
                "An error occurred while retrieving data from the external LeetCode API",
                err, 502
            );
        });
    return result;
};



// Set up up query, credential retrieval, Server level error handling
export const preQuery = async (username: string):
Promise<ProfileResponse> => {
    // Retrieve Cross-site forgery credentials
    const csrf_credential = await get_csrf()
        .then((result) => result.toString())
        .catch((err) => {
            throw err
        });
    
    // Get correct query based on api called
    const graphql = gql(
        fs.readFileSync('src/leetcode/graphql/leetcode-all-profile.graphql', 'utf8')
    );
    
    // Call the universal leetCode querier
    const data = await leetcode.leetcodeGraphQL(
        {
            query: graphql,
            variables: { username: username }
        },
        GRAPHQL_URL,
        csrf_credential as string
        )
        .then((res) => res as ProfileResponse)
        // Catch sever problems conducting the call
        .catch((err) => {
            throw err
        })
    return data;
};

export const updateUser = async (key: string, intervalId: NodeJS.Timer, username: string) => {
    try {
        const queryResponse = await preQuery(username)
        .catch(err => {
            throw err
        });

        await setCacheData(key, {
            interval: intervalId,
            data: queryResponse
        });
    } catch (err) {
        if (err instanceof ResponseError) {
            console.error(`Error (${err.error}) updating user data for ${username}: ${err.message}`);
        } else {
            console.error(`Error updating user data for ${username}: ${err}`);
        }
    }
}


// Set up for profile years probe query
export const preProbe = async (req: Request):
Promise<[number[], string]> => {
    // Cross-site forgery credentials
    const csrf_credential: string = await get_csrf()
        .then((result) => result.toString())
        .catch((err) => {
            throw err;
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
            throw err;
        })

    return [data.matchedUser.userCalendar.activeYears, csrf_credential];
}

export const streakQuery = async (req: Request): Promise<STREAKDATA> => {
    const parseStreak = parseDirect(req);

    const preSet = await preProbe(req)
        .catch(err => {
            throw new ResponseError(
                "Error build probe query for user membership length",
                err, 502
            )
        });
    const [membershipYears, csrf_credential] = preSet;
    const graphql = gql(
        fs.readFileSync("src/leetcode/graphql/leetcode-streak.graphql", 'utf8')
    );
        
    const streakData: STREAKDATA = {
        streak: [0, 0],
        totalActive: 0,
        mostActiveYear: 0,
        completion: "0.00",
        completionActuals: [0, 0],
        theme: THEMES["black-ice"]!
    }
    // Call the universal leetCode querier for each year
    for (let year of membershipYears) {
        const data = await leetcodeGraphQL({
            query: graphql,
            variables: { username: req.params.username!, year: year }
        },
        GRAPHQL_URL,
        csrf_credential)
        .then(res => {return res as StreakResponse})
        .catch((err) => {
            throw new ResponseError("Error building LeetCode streak GraphQL query",
            err, 500,
            );
        });
        
        parseStreak(streakData, data, year);
    }
    return streakData;
}