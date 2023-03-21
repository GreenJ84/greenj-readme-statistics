/** @format */

import { Request, Response } from "express";
import { LeetCodeGraphQLResponse } from "../leetcode/leetcodeTypes";
import { preQuery } from '../leetcode/profile';
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
    const data: LeetCodeGraphQLResponse = await preQuery(req, res)
        .then((data: LeetCodeGraphQLResponse | GraphQLError) => {
            return data as LeetCodeGraphQLResponse;
        });
    res.status(200).send(data);
    return;
}

