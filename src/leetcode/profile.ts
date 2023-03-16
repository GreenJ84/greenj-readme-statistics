import fs from 'fs';
import { Request, Response } from 'express';
import { gql } from "graphql-tag";
import { match } from 'ts-pattern';

import { LeetCodeGraphQLResponse } from './leetcodeTypes';
import * as leetcode from '../leetcode/query';
import { GRAPHQL_URL, GraphQLError } from '../utils/constants';
import { get_csrf } from '../utils/credentials';

const getGraph = (type: string): string => {
    const graph = match(type)
        .with("stats", () => {return "src/leetcode/graphql/leetcode-profile.graphql"})
        .with("badges", () => {return "src/leetcode/graphql/leetcode-badges.graphql"})
        .with("questions_solved", () => {return "src/leetcode/graphql/leetcode-questions-answered.graphql"})
        .with("recent-questions", () => { return "src/leetcode/graphql/leetcode-recent-submissions.graphql" })
        .run()
    return graph
}

export const preQuery = async (req: Request, res: Response) => {
    const { username } = req.params;
    const type = req.path.split("/")[2]!;
    if (!username) {
        res.status(400).send(
            {
                message: 'No username found on API Call',
                error: "Missing username parameter.",
                error_code: 400
            })
    }

    setQuery(username!, type).then((data) => {
        if ("error" in data && "error_code" in data) {
            res.status(400).send(data);
        } else {
            res.status(200).send(data);
        }
    })
};

export const setQuery = async (username: string, type: string) => {
    const path = getGraph(type);
    const graphql = gql(
        fs.readFileSync(path, 'utf8')
    );
    const csrf_credential: string = await get_csrf()
        .then((result) => result.toString());

    const data = await leetcode.leetcodeGraphQL(
        {
            query: graphql,
            variables: { username: username }
        },
        GRAPHQL_URL,
        csrf_credential
    )
        .then((res) => res as LeetCodeGraphQLResponse)
        .catch((err) => {
            return {
                message: "",
                error: err,
                error_code: 400, 
            } as GraphQLError
        })
    return data
}