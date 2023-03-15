import fs from 'fs';
import gql from "graphql-tag";
import { GRAPHQL_URL, GraphQLError } from '../utils/constants';
import { get_csrf } from '../utils/credentials';
import { LeetCodeGraphQLResponse } from './leetcodeTypes';
import * as leetcode from './query';

export const getDaily = async () => {
    const graphql = gql(
        fs.readFileSync("src/leetcode/graphql/leetcode-daily-question.graphql", 'utf8')
    );
    const csrf_credential: string = await get_csrf()
        .then((result) => result.toString());

    const data = await leetcode.leetcodeGraphQL(
        {
            query: graphql,
            variables: {}
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