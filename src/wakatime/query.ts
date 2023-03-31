import { Request } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import { wakaResponse } from './wakatimeTypes';
import { Error, WAKA_TIME_URL } from '../utils/constants';

dotenv.config()

export const getUserStats = async (req: Request): Promise<wakaResponse | Error> => {
    const { username } = req.params;
    if (process.env.WAKATIME_TOKEN == undefined) {
        return {
            message: "Error accessing WakaTime API Token",
            error: "WakaTime Token ENV variable missing",
            error_code: 500
        } as Error
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
        .catch(err => { return {
            message: "Error accessing WakaTime API",
            error: err,
            error_code: 500
        } as Error })
    return data;
}