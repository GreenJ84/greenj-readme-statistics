import { Request, Response } from 'express';

import { preFlight, sleep } from '../utils/utils';
// import { ResponseError } from '../utils/constants';

import { getUserStats, updateUser } from '../wakatime/query';
import { parseDirect } from '../wakatime/apiParse';
import { cardDirect } from '../wakatime/wakatimeUtils';
import { wakaResponse } from '../wakatime/wakatimeTypes';
import { getCacheData, getCacheKey, setCacheData } from '../utils/cache';
import { PRODUCTION } from '../utils/constants';

let sleepMod = -2;

// 30 sec interval for development
// 8hr interval for production
const DATA_UDPDATE_INTERVAL = PRODUCTION ? 1000 * 60 * 60 * 8 : 1000 * 30;

export const wakaStatsRegister = async (req: Request, res: Response): Promise<void> => {
    // Ensure caller is viable
    if (!preFlight(req, res)) {
        return;
    }
    const cacheKey = getCacheKey(req);
    res.set('Content-Type', 'application/json');
    
    // Try for cached data, Query API if not present
    const [success, _] = await getCacheData(cacheKey);
    if (success) { 
        res.status(208).json({
            message: "User already registered",
            code: "208"
        })
    }
    // Query WakaTime api
    const queryRepsonse: wakaResponse = await getUserStats(req.params.username!)
        .catch(err => {
            throw err;
        });
    // Add new query data to cache
    await setCacheData(cacheKey, queryRepsonse);

    setInterval(() => {
        // console.log("Updating");
        updateUser(cacheKey, req.params.username!);
    }, DATA_UDPDATE_INTERVAL);
    
    res.status(201).json({
        message: "User Registered",
        code: "201"
    });
}


export const getProfileStats = async (req: Request, res: Response): Promise<void> => {
    // Ensure caller is viable
    if (!preFlight(req, res)) {
        return;
    }

    const subRoute = req.path.split("/")[2]!;
    const cacheKey = getCacheKey(req);
    
    sleepMod = (sleepMod + 2) % 10
    await sleep(sleepMod);
    
    // Try for cached data, Query API if not present
    let data: wakaResponse;
    const [success, cacheData] = await getCacheData(cacheKey);
    if (!success) {
        res.set('Content-Type', 'application/json');
        res.status(401).json({
            message: "User unauthorized. Registration required for API data.",
            code: "401"
        });
        return;
    }
    else {
        data = cacheData as wakaResponse;
    }
    
    // Parse Data, Build Card, and Send
    const dataParse = parseDirect(subRoute);
    const parsedData = dataParse(data);
    
    const cardCreate = cardDirect(subRoute);
    const card: string = cardCreate(req, parsedData);
    
    res.status(200).send(card);
    return;
}