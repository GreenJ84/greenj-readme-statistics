/** @format */

export { };
import { Request, Response } from "express";
import { getDaily } from "../leetcode/daily";
import { setQuery } from '../leetcode/profile';

export const getProfileStats = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { } = req.query;
    const type = req.path.split("/")[2]!;
    console.log(type);
    if (!username) {
        res.status(400).send({ message: 'No username found on API Call', error: "Missing username parameter.", error_code: 400 })
    }

    setQuery(username!, type).then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

export const getQuestionsAnswered = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { } = req.query;
    const type = req.path.split("/")[2]!;
    console.log(type);
    if (!username) {
        res.status(400).send({ message: 'No username found on API Call', error: "Missing username parameter.", error_code: 400 })
    }

    setQuery(username!, type).then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

export const getBadges = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { } = req.query;
    const type = req.path.split("/")[2]!;
    console.log(type);
    if (!username) {
        res.status(400).send({ message: 'No username found on API Call', error: "Missing username parameter.", error_code: 400 })
    }

    setQuery(username!, type).then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

export const getRecentSubmitions = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { } = req.query;
    const type = req.path.split("/")[2]!;
    console.log(type);
    if (!username) {
        res.status(400).send({ message: 'No username found on API Call', error: "Missing username parameter.", error_code: 400 })
    }

    setQuery(username!, type).then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

export const getDailyQuestion = async (req: Request, res: Response) => {
    const { } = req.query;
    getDaily().then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

