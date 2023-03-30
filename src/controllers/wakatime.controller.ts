import { Request, Response } from 'express';

import { preFlight } from '../utils/utils';
import { getCacheData, setCacheData } from '../utils/cache';
import { Error } from '../utils/constants';

import { getUserStats } from '../wakatime/query';
import { parseDirect } from '../wakatime/apiParse';
import { cardDirect } from '../wakatime/wakatimeUtils';
import { wakaResponse } from '../wakatime/wakatimeTypes';

export const getProfileStats = async (req: Request, res: Response): Promise<void> => {
    // Ensure caller is viable
    if (!preFlight(req, res)) {
        return;
    }

    // Get direct-uncached API request param if present 
    const { refresh } = req.query;

    // Get API Route subtype
    const type = req.path.split("/")[2]!;

    // Get data processing functionality for subtype
    const dataParse = parseDirect(type);
    const cardCreate = cardDirect(type);

    // Check cache if not a direct request
    if (refresh !== "true") {
        // Check cache for entry
        const cachedData = await getCacheData(req);
        // Create based of cache if present
        if (cachedData[0]) {
            // parse cached data
            const parsedData = dataParse(cachedData[1]);
            // create card from parsed data
            const card = cardCreate(parsedData);
            res.status(200).send(card);
            return;
        }
    }

    const data: wakaResponse | Error = await getUserStats(req);
    if ((data as Error).error !== undefined) {
        res.status((data as Error).error_code).send(data);
        return;
    } 
    setCacheData(req, data)
    // parse needed data properly
    const parsedData = dataParse(data);

    // create card from parsed data
    const card = cardCreate(parsedData);

    res.status(200).send(card);
}