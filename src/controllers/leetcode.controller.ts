/** @format */
import fs from 'fs';
import { Request, Response } from "express";
import gql from "graphql-tag";

import { ResponseError, GRAPHQL_URL } from "../utils/constants";
import { STREAKDATA } from "../leetcode/leetcodeTypes";

import { THEMES } from '../utils/themes';
import { preFlight } from "../utils/utils";
import { parseDirect } from "../leetcode/apiParser";
import {cardDirect, getGraph } from "../leetcode/leetcodeUtils";
import { leetcodeGraphQL, preProbe, preQuery } from '../leetcode/query';

// Main Controller for GitHub
export const leetcodeStats = async (req: Request, res: Response): Promise<void> => {
    // Get route used
    const type = req.path.split("/")[2]!;
    // PreFlight checks for user based routes
    if (type !== "daily-question" && !preFlight(req, res)) {
        return;
    }
    // Silo of streak to its own controller
    if (type == "streak") {
        leetcodeStreak(req, res);
        return
    }
    const parse = parseDirect(type);
    const createCard = cardDirect(type);


    const data = await preQuery(req, res, type)
    if ((data as ResponseError).error !== undefined) {
        console.error((data as ResponseError).message)
        console.error((data as ResponseError).error)
        res.status((data as ResponseError).error_code).send(data);
        return;
    } 
    
    const parsedData = parse(data);

    const card = createCard(req, parsedData);

    res.status(200).send(card);
    return;
}

// User Streak specific controller
const leetcodeStreak = async (req: Request, res: Response): Promise<void> => {
    const parseStreak = parseDirect("streak");
    const streakCard = cardDirect("streak")
    const path = getGraph("streak");
    
    const preSet = await preProbe(req, res);
    if (preSet == false) {
        return;
    }

    const [membershipYears, csrf_credential] = preSet as [number[], string];
    const { username } = req.params;
    const streakData: STREAKDATA = {
        streak: [0, 0],
        totalActive: 0,
        mostActiveYear: 0,
        completion: "0.00",
        completionActuals: [0,0],
        theme: THEMES["black-ice"]!
    }

    const graphql = gql(
        fs.readFileSync(path, 'utf8')
    );

    // Call the universal leetCode querier for each year
    for (let year of membershipYears) {

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
                } as ResponseError;
            });

        parseStreak(streakData, data, year);
    }

    const card = streakCard(req, streakData);

    res.status(200).send(card);
}