import { Request, Response } from 'express';

import { preFlight, sleep } from '../utils/utils';
import { ResponseError } from '../utils/constants';

import { getUserStats } from '../wakatime/query';
import { parseDirect } from '../wakatime/apiParse';
import { cardDirect } from '../wakatime/wakatimeUtils';
import { wakaResponse } from '../wakatime/wakatimeTypes';
import { getCacheData, setCacheData } from '../utils/cache';

let sleepMod = -2;

export const getProfileStats = async (req: Request, res: Response): Promise<void> => {
    // Ensure caller is viable
    if (!preFlight(req, res)) {
        return;
    }

    const subRoute = req.path.split("/")[2]!;
    const cacheKey = `wakatime:${req.params.username!}`

    // Get data processing functionality for subRoute
    const dataParse = parseDirect(subRoute);
    const cardCreate = cardDirect(subRoute);

    sleepMod = (sleepMod + 2) % 10
    await sleep(sleepMod);

    // Try for cached data, Query API if not present
    let data: wakaResponse;
    const [success, cacheData] = await getCacheData(cacheKey);
    if (!success) {
        // Query WakaTime api
        const queryRepsonse: wakaResponse | ResponseError = await getUserStats(req);
        if ((queryRepsonse as ResponseError).error !== undefined) {
            res.status((queryRepsonse as ResponseError).error_code).send(queryRepsonse);
            return;
        } 
        // Add new query data to cache
        setCacheData(cacheKey, queryRepsonse as wakaResponse)

        data = queryRepsonse as wakaResponse;
    }
    else {
        data = cacheData as wakaResponse;
    }

    // Parse Data, Build Card, and Send
    const parsedData = dataParse(data);
    const card: string = cardCreate(req, parsedData);
    res.status(200).send(card);
    return;
}