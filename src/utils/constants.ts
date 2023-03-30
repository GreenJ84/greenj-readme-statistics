import { DocumentNode } from "graphql";

// LeetCode
export const CRED_URL = "https://leetcode.com";
export const GRAPHQL_URL = "https://leetcode.com/graphql";
export const GRAPHQL_URL_CN = "https://leetcode.cn/graphql";
export const USER_AGENT = "Mozilla/5.0 LeetCode API";

//GitHub
export const GIT_URL = "https://api.github.com/graphql";

//WakaTime
export const WAKA_TIME_URL = "https://wakatime.com/api/v1";
export const WAKA_TIME_AUTH_URL = "https://wakatime.com/oauth/token";



// Extras
export interface GraphQLError {
    message: string,
    error: any,
    error_code: number
}

export interface Error {
    message: string,
    error: any,
    error_code: number
}

export interface GraphQLQuery {
    variables?: { [key: string]: unknown };
    query: DocumentNode;
}