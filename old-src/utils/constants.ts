/** @format */
import dotenv from "dotenv";

dotenv.config();

// Environment Variables
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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