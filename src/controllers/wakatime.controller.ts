import { Request, Response } from 'express';
import { preFlight } from '../utils/utils';
import { parseDirect } from '../wakatime/apiParse';
import { getUserStats } from '../wakatime/query';
import { wakaResponse } from '../wakatime/wakatimeTypes';
import { cardDirect } from '../wakatime/wakatimeUtils';

export const getProfileStats = async (req: Request, res: Response): Promise<void> => {
    if (!preFlight(req, res)) {
        return;
    }
    const data: wakaResponse = await getUserStats(req);

    const type = req.path.split("/")[2]!;
    const dataParse = parseDirect(type);
    const cardCreate = cardDirect(type);
    // parse needed data properly
    const parsedData = dataParse(data);

    // create card from parsed data
    const card = cardCreate(parsedData);
    res.status(200).send(card);
}