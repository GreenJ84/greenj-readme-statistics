/** @format */
import fs from 'fs';
import { Request, Response } from "express";
import gql from "graphql-tag";
import { parseDirect } from "../leetcode/apiParser";
import { LeetCodeGraphQLResponse, STREAKDATA } from "../leetcode/leetcodeTypes";
import {cardDirect, getGraph } from "../leetcode/leetcodeUtils";
import { leetcodeGraphQL, preProbe, preQuery } from '../leetcode/query';
import { GraphQLError, GRAPHQL_URL } from "../utils/constants";
import { preFlight } from "../utils/utils";
import { THEMES } from '../utils/themes';

// PreHandler for routes requiring username
export const leetcodeProfile = async (req: Request, res: Response): Promise<void> => {
    if (!preFlight(req, res)) {
        res.status(400).send({
            message: "There was no username provided for a route that requires it. Provide a valid username before calling again.",
            error: { "Missing Parameter": "Username" },
            error_code: 400
        });
        return;
    }
    leetcodeStats(req, res);
    return;
};

// Main Controller for GitHub
export const leetcodeStats = async (req: Request, res: Response): Promise<void> => {
    const type = req.path.split("/")[2]!;
    if (type == "streak") {
        leetcodeStreak(req, res);
        return
    }
    const data: LeetCodeGraphQLResponse = await preQuery(req, res, type)
        .then((data: LeetCodeGraphQLResponse | GraphQLError) => {
            return data as LeetCodeGraphQLResponse;
        });
    
    const parse = parseDirect(type);
    const parsedData = parse(data);

    const createCard = cardDirect(type);
    const card = createCard(req, parsedData);

    res.status(200).send(card);
    return;
}

// User Streak specific controller
export const leetcodeStreak = async (req: Request, res: Response): Promise<void> => {
    const parseStreak = parseDirect("streak");
    const streakCard = cardDirect("streak")
    
    const response = await preProbe(req, res);
    if (response == false) {
        return;
    }
    console.log("Streak open----")
    const [membershipYears, csrf_credential] = response as [number[], string];
    const { username } = req.params;
    const streakData: STREAKDATA = {
        streak: [0, 0],
        totalActive: 0,
        mostActiveYear: 0,
        completion: "0.00",
        completionActuals: [0,0],
        theme: THEMES["black-ice"]!
    }
    const path = getGraph("streak");
    const graphql = gql(
        fs.readFileSync(path, 'utf8')
    );
    for (let year of membershipYears) {
        console.log("Streak call----")
        // Call the universal leetCode querier
        const data = await leetcodeGraphQL({
                query: graphql,
                variables: { username: username!, year: year }
            },
            GRAPHQL_URL,
            csrf_credential)
            .then((res) => res)
            .catch((err) => {
                return {
                    message: "Internal server error",
                    error: err,
                    error_code: 500,
                } as GraphQLError;
            })
        
        parseStreak(streakData, data, year);
    }

    const card = streakCard(req, streakData)
    res.status(200).send(card)
}