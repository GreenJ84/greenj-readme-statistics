/** @format */

import { DocumentNode } from "graphql";
import dotenv from "dotenv";

dotenv.config();

// Environment Variables
export const PRODUCTION = process.env.NODE_ENV === "production";
export const REDIS_USER = process.env.REDIS_USER;
export const REDIS_PASS = process.env.REDIS_PASS;
export const PROD_HOST = process.env.PROD_HOST;
export const PROD_PORT = process.env.PROD_PORT;

// LeetCode
export const LEET_CRED_URL = "https://leetcode.com";
export const LEET_GRAPHQL_URL = "https://leetcode.com/graphql";
export const LEET_GRAPHQL_URL_CN = "https://leetcode.cn/graphql";
export const LEET_USER_AGENT = "Mozilla/5.0 LeetCode API";

//GitHub
export const GIT_URL = "https://api.github.com/graphql";

//WakaTime
export const WAKA_TIME_URL = "https://wakatime.com/api/v1";
export const WAKA_TIME_AUTH_URL = "https://wakatime.com/oauth/token";

export const DATA_UDPDATE_INTERVAL = PRODUCTION
  ? 1000 * 60 * 60 * 8
  : 1000 * 30;

export class ResponseError extends Error {
  error: any;
  error_code: number;

  constructor(message: string, error: any, error_code: number) {
    super(message);
    this.error = error;
    this.error_code = error_code;
  }
}

export interface GraphQuery {
  variables?: { [key: string]: unknown };
  query: DocumentNode;
}
