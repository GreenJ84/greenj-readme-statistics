import fs from 'fs';
import { Request, Response } from "express";
import gql from "graphql-tag";

import { GraphQLResponse, StreakProbe, StreakResponse } from "./githubTypes";
import { githubGraphQL } from "./query";
import { GraphQLError } from '../utils/constants';

export const handleProbe = (req: Request, res: Response): [string, number[]] => {
    const now = new Date().toISOString()
    const today = now.slice(0, 19);
    const year = now.slice(0,4)
    const graphql = gql(
        fs.readFileSync("src/github/graphql/streak-probe.graphql", 'utf8')
    );
    const variables = {
        login: req.params.username!,
        start: today,
        end: `${year}-01-01T00:00:00Z`
    }
    const data = await githubGraphQL(
        {
            query: graphql,
            variables: variables
        })
        .then((res) => res as GraphQLResponse)
        .catch((err) => {
            return {
                message: "Internal server error",
                error: err,
                error_code: 500,
            } as GraphQLError;
        })
    // Return API errors if they have occured
    if ((data as GraphQLError).error !== undefined) {
        res.status(400).send(data);
    }

    return [
        (data as unknown as StreakProbe).user.createdAt,
        (data as unknown as StreakProbe).user.contributionsCollection.contributionYears];
}

export const handleStreakMulti = (data: StreakResponse): => {

}