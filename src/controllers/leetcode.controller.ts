/** @format */
import fs from 'fs';
import { Request, Response } from "express";
import gql from "graphql-tag";

import { ResponseError, GRAPHQL_URL } from "../utils/constants";
import { LeetCodeGraphQLResponse, ProfileResponse, STREAKDATA } from "../leetcode/leetcodeTypes";

import { THEMES } from '../utils/themes';
import { preFlight, sleep } from "../utils/utils";
import { parseDirect } from "../leetcode/apiParser";
import {cardDirect, getGraph } from "../leetcode/leetcodeUtils";
import { leetcodeGraphQL, preProbe, preQuery } from '../leetcode/query';
import { getCacheData, setCacheData } from '../utils/cache';

let sleepMod = -2;

// Main Controller for GitHub
export const leetcodeStats = async (req: Request, res: Response): Promise<void> => {
    const subRoute = req.path.split("/")[2]!;
    const key = `leetcode:${req.params.username!}:profile`;
    // PreFlight checks for user based routes
    if (!preFlight(req, res)) {
        return;
    }

    if (subRoute === "streak") {
        leetcodeStreak(req, res, subRoute);
        return;
    }
    
    sleepMod = (sleepMod + 2) % 10
    await sleep(sleepMod);
    
    let data: LeetCodeGraphQLResponse;
    const [success, cacheData] = await getCacheData(key);
    if (!success) {
        const queryResponse = await preQuery(req, subRoute)
            .catch(err => {
                throw new ResponseError(
                    "Error building LeetCode profile GraphQL query",
                    err, 500
                );
            });
        setCacheData(key, queryResponse);
        data = queryResponse;
    } else {
        data = cacheData as LeetCodeGraphQLResponse;
    }
        
    const parse = parseDirect(subRoute);
    const parsedData = parse(data as ProfileResponse);

    const createCard = cardDirect(subRoute);
    const card = createCard(req, parsedData);

    res.status(200).send(card);
    return;
}

// User Streak specific controller
const leetcodeStreak = async (req: Request, res: Response, subRoute: string): Promise<void> => {
    const key = `leetcode:${req.params.username!}:streak`;
    
    let data: STREAKDATA;
    const [success, cacheData] = await getCacheData(key);
    if (!success) {
        const parseStreak = parseDirect(subRoute)
        const path = getGraph(subRoute);
        const preSet = await preProbe(req)
        .catch(err => {
            throw new ResponseError(
                "Error build probe query for user membership length",
                err, 502
                )
            });
            const [membershipYears, csrf_credential] = preSet;
            
            const streakData: STREAKDATA = {
                streak: [0, 0],
                totalActive: 0,
                mostActiveYear: 0,
                completion: "0.00",
                completionActuals: [0, 0],
                theme: THEMES["black-ice"]!
            }
            const graphql = gql(
                fs.readFileSync(path, 'utf8')
                );
                // Call the universal leetCode querier for each year
                for (let year of membershipYears) {
                    const data = await leetcodeGraphQL({
                        query: graphql,
                        variables: { username: req.params.username!, year: year }
                    },
                    GRAPHQL_URL,
                    csrf_credential)
                    .catch((err) => {
                        throw new ResponseError("Error building LeetCode streak GraphQL query",
                        err, 500,
                        );
                    });
                    
                    parseStreak(streakData, data, year);
                }
                setCacheData(key, streakData);
                data = streakData;
            } else {
                data = cacheData as STREAKDATA;
            }
            
            const streakCard = cardDirect(subRoute);
            const card = streakCard(req, data);

            res.status(200).send(card);
            return;
}

export const leetcodeDaily = async (req: Request, res: Response): Promise<void> => {
    const key = `leetcode:daily`;
    
    let data: LeetCodeGraphQLResponse;
    const [success, cacheData] = await getCacheData(key)
    if (!success) {
        const queryResponse = await preQuery(req, 'daily')
            .catch(err => {
                throw new ResponseError(
                    "Error building LeetCode daily question GraphQL query",
                    err, 500
                )
            });
        setCacheData(key, queryResponse);
        data = queryResponse;
    } else {
        data = cacheData as LeetCodeGraphQLResponse;
    }
        
    const parse = parseDirect('daily');
    const parsedData = parse(data);

    const createCard = cardDirect('daily');
    const card = createCard(req, parsedData);

    res.status(200).send(card);
    return;
}