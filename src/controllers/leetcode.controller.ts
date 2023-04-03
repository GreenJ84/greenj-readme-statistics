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
        return
    }

    const parse = parseDirect(subRoute);
    const createCard = cardDirect(subRoute);

    sleepMod = (sleepMod + 2) % 10
    await sleep(sleepMod);

    let data: LeetCodeGraphQLResponse;
    const [success, cacheData] = await getCacheData(key);
    if (!success) {
        const queryResponse = await preQuery(req, res, subRoute)
        if (queryResponse == false) {
            return;
        }
        setCacheData(key, queryResponse);
        data = queryResponse as LeetCodeGraphQLResponse;
    } else {
        data = cacheData as LeetCodeGraphQLResponse;
    }
    
    const parsedData = parse(data as ProfileResponse);
    const card = createCard(req, parsedData);
    res.status(200).send(card);
    return;
}

// User Streak specific controller
const leetcodeStreak = async (req: Request, res: Response, subRoute: string): Promise<void> => {
    const key = `leetcode:${req.params.username!}:streak`;
    const streakCard = cardDirect(subRoute);

    let data: STREAKDATA;
    const [success, cacheData] = await getCacheData(key);
    if (!success) {
        const parseStreak = parseDirect(subRoute);
        const path = getGraph(subRoute);
        const preSet = await preProbe(req, res);
        if (preSet == false) {
            return;
        }
        const [membershipYears, csrf_credential] = preSet as [number[], string];

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
                .then((res) => res)
                .catch((err) => {
                    return {
                        message: "Internal server error",
                        error: err,
                        error_code: 500,
                    } as ResponseError;
                });
            // Send API errors if they have occured
            if ((data as ResponseError).error !== undefined) {
                console.error(data as ResponseError)
                res.status((data as ResponseError).error_code).send(data);
                return;
            }

            parseStreak(streakData, data, year);
        }
        setCacheData(key, streakData);
        data = streakData as STREAKDATA
    } else {
        data = cacheData as STREAKDATA;
    }

    const card = streakCard(req, data);
    res.status(200).send(card);
    return;
}

export const leetcodeDaily = async (req: Request, res: Response): Promise<void> => {
    const key = `leetcode:daily`;
    const parse = parseDirect('daily');
    const createCard = cardDirect('daily');

    let data: LeetCodeGraphQLResponse;
    const [success, cacheData] = await getCacheData(key)
    if (!success) {
        const queryResponse = await preQuery(req, res, 'daily')
        if (queryResponse == false) {
            return;
        }
        setCacheData(key, queryResponse);
        data = queryResponse as LeetCodeGraphQLResponse;
    } else {
        data = cacheData as LeetCodeGraphQLResponse;
    }
    
    const parsedData = parse(data);
    const card = createCard(req, parsedData);
    res.status(200).send(card);
    return;
}