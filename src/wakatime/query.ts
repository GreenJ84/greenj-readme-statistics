import axios from 'axios';
import dotenv from 'dotenv';

import { wakaResponse } from './wakatimeTypes';
import { ResponseError, WAKA_TIME_URL } from '../utils/constants';
import { setCacheData } from '../utils/cache';

dotenv.config()

export const getUserStats = async (username: string): Promise<wakaResponse > => {
    if (process.env.WAKATIME_TOKEN === undefined) {
        throw new ResponseError(
            "Error accessing WakaTime API Token",
            "WakaTime Token environmental variable is missing",
            500
        );
    }

    const config = axios.create({
        baseURL: WAKA_TIME_URL,
        headers: {
            Authorization: `Basic ${Buffer.from(process.env.WAKATIME_TOKEN!).toString('base64')}`
        }
    });
    const data = await config.get(`users/${username}/stats/all_time`, {
        params: {}
    })
        .then(res => {
            return res.data.data as wakaResponse
        })
        .catch(err => {
            throw new ResponseError(
                `Error accessing WakaTime API: ${err.response.statusText}`,
                err, err.response.status
            );
        });
    return data;
}

export const updateUser = async (cacheKey: string, username: string) => {
    try {
        // Query WakaTime api
        const queryRepsonse: wakaResponse = await getUserStats(username)
            .catch(err => {
                throw err;
            });
        
        await setCacheData(cacheKey, queryRepsonse);
        
    } catch (err) {
        if (err instanceof ResponseError) {
            console.error(`Error (${err.error}) updating user data for ${username}: ${err.message}`);
        } else {
            console.error(`Error updating user data for ${username}: ${err}`);
        }
    }
}