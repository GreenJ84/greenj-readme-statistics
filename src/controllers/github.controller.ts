import { Request, Response } from "express";

// API Global imports
import { preFlight, sleep } from "../utils/utils";
import { THEMES, THEMETYPE } from "../utils/themes";

// GitHub specific imports
import { GraphQLResponse, ReadMeData, STREAKTYPE } from "../github/githubTypes";
import { preQery, streakProbe, streakQuery, updateUser } from "../github/query";
import { getResponseParse } from "../github/apiParser";
import { cardDirect } from "../github/githubUtils";
import { streakCardSetup } from "../github/cards/streak-card";
import { getCacheData, getCacheKey, setCacheData } from "../utils/cache";
import { DATA_UDPDATE_INTERVAL } from "../utils/constants";

let sleepMod = -2;

export const githubRegister = async (req: Request, res: Response) => {
    // Ensure Caller is viable
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
        });
        return;
    }

    let variables = { login: req.params.username! }
    const queryResponse = await preQery(variables)
        .then((data) => { return data })
        .catch (err => {
            throw err;
        });
    
    const intervalId = setInterval(() => {
        // console.log(intervalId);
        updateUser(cacheKey, intervalId, req.params.username!);
    }, DATA_UDPDATE_INTERVAL)

    await setCacheData(cacheKey, {
        interval: intervalId,
        data: queryResponse
    })

    res.status(201).json({
        message: "User Registered",
        code: "201"
    });
    return;
}

export const githubUnregister = async (req: Request, res: Response) => {

}

// GitHub controller for all GitHub routes except - Commit Streak Data
export const getProfileStats = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }

    const cacheKey = getCacheKey(req);

    sleepMod = (sleepMod + 2) % 10
    await sleep(sleepMod);

    const [success, cacheData] = await getCacheData(cacheKey);
    if (!success) {
        res.set('Content-Type', 'application/json');
        res.status(400).json({
            message: "User not found.",
            code: "404"
        });
        return;
    }
        
    const data = cacheData?.data as GraphQLResponse;

    // Get Function to parse data type
    const parse = getResponseParse(req);
    const parsedData: ReadMeData = parse(data)

    // Get Function to create svg card for data type
    const createCard: Function = cardDirect(req);
    const card: string = createCard(req, parsedData);

    // Send created card as svg string
    res.status(200).send(card);
    return;
};



// GitHub Streak Controller
export const getCommitStreak = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    const cacheKey = getCacheKey(req);

    let data: STREAKTYPE;
    const [success, cacheData] = await getCacheData(cacheKey);
    if (!success) {
        // Query user data for Creation Date and Years of membership
        const [created, years] = await streakProbe(req)
            .catch(err => {
                throw err;
            });
        
        const queryRespnose = await streakQuery(req, created, years);
        data = queryRespnose;
        setCacheData(cacheKey, queryRespnose);
    } else {
        data = cacheData as STREAKTYPE;
    }
    
    const card: string = streakCardSetup(req, data);
    res.status(200).send(card);
    return;
};
