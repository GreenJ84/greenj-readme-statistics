import fs from 'fs';
import { Request, Response } from "express";
import gql from "graphql-tag";

import { GraphQLResponse, StreakProbe } from "./githubTypes";
import { githubGraphQL } from "./query";
import { GraphQLError } from '../utils/constants';

export const handleProbe = async (req: Request, res: Response): Promise<[string, number[]] | boolean> => {
    const now = new Date().toISOString()
    const today = now.slice(0, 19);
    const year = now.slice(0,4)
    const graphql = gql(
        fs.readFileSync("src/github/graphql/streak-probe.graphql", 'utf8')
    );
    const variables = {
        login: req.params.username!,
        start: `${year}-01-01T00:00:00Z`,
        end: today
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
    // Return API errors if they have occured and flag call termination
    if ((data as GraphQLError).error !== undefined) {
        res.status(400).send(data);
        return false;
    } else {
        return [
            (data as unknown as StreakProbe).user.createdAt,
            [...(data as unknown as StreakProbe).user.contributionsCollection.contributionYears].sort()];
    }
    
}