import fs from 'fs';
import { Request, Response } from 'express';
import { gql } from "graphql-tag";
import { match } from 'ts-pattern';
import * as github from './query';
import { GraphQLError } from '../utils/constants';
import { GraphQLResponse } from './githubTypes';
import { streakParse } from './apiParser';

const getGraph = (type: string): string => {
    const graph = match(type)
        .with("stats", () => {return "src/github/graphql/guthub-stats.graphql"})
        .with("trophies", () => {return "src/github/graphql/guthub-stats.graphql"})
        .with("languages", () => {return "src/github/graphql/github-langs.graphql"})
        .with("streak", () => { return "src/github/graphql/github-streak.graphql" })
        .run()
    return graph
}

const getResponseParse = (type: string): Function => {
    const parseFunc = match(type)
        // .with("stats", () => {return statsParse})
        // .with("trophies", () => {return statsParse})
        // .with("languages", () => {return langsParse})
        .with("streak", () => {return streakParse})
        .run()
    return parseFunc
}


export const setQuery = async (username: string, type: string): Promise<GraphQLError| GraphQLResponse> => {
    const path = getGraph(type);
    const graphql = gql(
        fs.readFileSync(path, 'utf8')
    );
    const data = await github.githubGraphQL(
        {
            query: graphql,
            variables: { login: username }
        })
        .then((res) => res as GraphQLResponse)
        .catch((err) => {
            return {
                message: "Internal server error",
                error: err,
                error_code: 500,
            } as GraphQLError;
        })
    const parse = getResponseParse(type);
    parse(data);
    return data;
}

export const preQery = async (req: Request, res: Response): Promise<GraphQLError | GraphQLResponse> => {
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
    const data = setQuery(username!, type)
        .then((data) => {
            return data as GraphQLResponse;
        })
        .catch((err) => {
            return {
                message: "",
                error: err,
                error_code: 400,
            } as GraphQLError;
        })
    return data;
}