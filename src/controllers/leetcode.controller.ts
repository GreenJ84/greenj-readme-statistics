/** @format */

import { Request, Response } from "express";
import { LeetCodeGraphQLResponse } from "../leetcode/leetcodeTypes";
import {cardDirect, parseDirect } from "../leetcode/leetcodeUtils";
import { preQuery } from '../leetcode/query';
import { GraphQLError } from "../utils/constants";
import { preFlight } from "../utils/utils";

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

export const leetcodeStats = async (req: Request, res: Response): Promise<void> => {
    const type = req.path.split("/")[2]!;
    const data: LeetCodeGraphQLResponse = await preQuery(req, res, type)
        .then((data: LeetCodeGraphQLResponse | GraphQLError) => {
            return data as LeetCodeGraphQLResponse;
        });
    
    const parse = parseDirect(type);
    const parsedData = parse(data);

    const createCard = cardDirect(type);
    const card = createCard(req, parsedData);
    console.log(parsedData)

    res.status(200).send(card);
    return;
}

