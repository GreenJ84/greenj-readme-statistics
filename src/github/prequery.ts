import fs from 'fs';
import { Request, Response } from 'express';
import { gql } from "graphql-tag";
import { match } from 'ts-pattern';
import * as github from './query';
import { GraphQLError } from '../utils/constants';

const getGraph = (type: string): string => {
    const graph = match(type)
        .with("stats", () => {return "src/github/graphql/guthub-stats.graphql"})
        .with("trophies", () => {return "src/github/graphql/guthub-stats.graphql"})
        .with("languages", () => {return "src/github/graphql/github-langs.graphql"})
        .with("streak", () => { return "src/github/graphql/github-streak.graphql" })
        .run()
    return graph
}

export const preQery = async (req: Request, res: Response) => {
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

    const data = await github.githubGraphQL(
        {
            query: graphql,
            variables: { username: username }
        },
    )
        .then((res) => res as any)
        .catch((err) => {
            return {
                message: "",
                error: err,
                error_code: 400, 
            } as GraphQLError
        })
    return data
}