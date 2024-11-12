import dotenv from "dotenv";

dotenv.config();

// Environment Variables
export const PRODUCTION = process.env.NODE_ENV === "production";
export const REDIS_USER = process.env.REDIS_USER;
export const REDIS_PASS = process.env.REDIS_PASS;
export const PROD_HOST = process.env.PROD_HOST;
export const PROD_PORT = process.env.PROD_PORT;
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
