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


export class ResponseError extends Error {
    error: any;
    error_code: number;

    constructor(message: string, error: any, error_code: number) {
        super(message);
        this.error = error;
        this.error_code = error_code;
    }
}

// export interface ResponseError {
//     message: string,
//     error: any,
//     error_code: number
// }

export interface GraphQLQuery {
    variables?: { [key: string]: unknown };
    query: DocumentNode;
}