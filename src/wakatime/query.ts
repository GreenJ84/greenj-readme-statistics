import { Request } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import { wakaResponse } from './wakatimeTypes';
import { ResponseError, WAKA_TIME_URL } from '../utils/constants';

dotenv.config()

export const getUserStats = async (req: Request): Promise<wakaResponse > => {
    const { username } = req.params;
    if (process.env.WAKATIME_TOKEN === undefined) {
        throw new ResponseError(
            "Error accessing WakaTime API Token",
            "WakaTime Token ENV variable missing",
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
                "Error accessing WakaTime API",
                err, 502
            );
        });

    return data;
}