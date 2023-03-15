import fs from 'fs';
import { gql } from "graphql-tag";
import { match } from 'ts-pattern';
import * as leetcode from '../leetcode/query';
import { GRAPHQL_URL, GraphQLError } from '../utils/constants';
import { get_csrf } from '../utils/credentials';
import { LeetCodeGraphQLResponse } from './leetcodeTypes';

const getGraph = (type: string): string => {
    const graph = match(type)
        .with("stats", () => {return "src/leetcode/graphql/leetcode-profile.graphql"})
        .with("badges", () => {return "src/leetcode/graphql/leetcode-badges.graphql"})
        .with("questions_solved", () => {return "src/leetcode/graphql/leetcode-questions-answered.graphql"})
        .with("recent-questions", () => { return "src/leetcode/graphql/leetcode-recent-submissions.graphql" })
        .run()
    return graph
}

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