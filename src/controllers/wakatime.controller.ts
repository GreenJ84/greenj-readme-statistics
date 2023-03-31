import { Request, Response } from 'express';

import { preFlight } from '../utils/utils';
import { ResponseError } from '../utils/constants';

import { getUserStats } from '../wakatime/query';
import { parseDirect } from '../wakatime/apiParse';
import { cardDirect } from '../wakatime/wakatimeUtils';
import { wakaResponse } from '../wakatime/wakatimeTypes';

export const getProfileStats = async (req: Request, res: Response): Promise<void> => {
    // Ensure caller is viable
    if (!preFlight(req, res)) {
        return;
    }

    // Get API Route subtype
    const type = req.path.split("/")[2]!;

    // Get data processing functionality for subtype
    const dataParse = parseDirect(type);
    const cardCreate = cardDirect(type);

    const data: wakaResponse | ResponseError = await getUserStats(req);
    if ((data as ResponseError).error !== undefined) {
        console.error((data as ResponseError).message)
        console.error((data as ResponseError).error)
        res.status((data as ResponseError).error_code).send(data);
        return;
    } 

    // parse needed data properly
    const parsedData = dataParse(data);

    // create card from parsed data
    const card: string = cardCreate(req, parsedData);

    res.status(200).send(card);
}