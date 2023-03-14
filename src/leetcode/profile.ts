import fs from 'fs';
import { gql } from "graphql-tag";
import * as leetcode from '../leetcode/query';
import { GRAPHQL_URL } from '../utils/constants';
import { get_csrf } from '../utils/credentials';
import { GraphQLError, LeetCodeGraphQLResponse } from './leetcodeTypes';

export const profile = async (username: string) => {
    const graphql = gql(
        fs.readFileSync('src/leetcode/graphql/leetcode-profile.graphql', 'utf8')
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