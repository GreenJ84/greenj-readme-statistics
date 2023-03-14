/** @format */

export { };
import { Request, Response } from "express";
import { profile } from '../leetcode/profile';

export const getProfileStats = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { } = req.query;
    if (!username) {
        res.status(400).send({ message: 'No username found on API Call', error: "Missing username parameter.", error_code: 400})
    }

    profile(username!).then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send({ data: data });
        }
    })
}

