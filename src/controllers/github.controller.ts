import { Request, Response } from "express";

// API Global imports
import { preFlight } from "../utils/utils";
import { THEMES, THEMETYPE } from "../utils/themes";

// GitHub specific imports
import { GraphQLResponse, ReadMeData, STREAKTYPE } from "../github/githubTypes";
import { preQery, streakProbe } from "../github/query";
import { getResponseParse } from "../github/apiParser";
import { cardDirect } from "../github/githubUtils";
import { streakCardSetup } from "../github/cards/streak-card";
import { getCacheData, setCacheData } from "../utils/cache";


// GitHub controller for all GitHub routes except - Commit Streak Data
export const getProfileStats = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }
    const type = req.path.split("/")[2]!;
    const key = `github:${req.params.username!}:profile`;

    let data: GraphQLResponse;
    const [success, cacheData] = await getCacheData(key);
    if (!success) {
        let variables = { login: req.params.username! }
        const queryResponse = await preQery(res, variables, type)
            .then((data) => { return data });
        if (queryResponse == false) {
            return;
        }
        data = queryResponse as GraphQLResponse;
        setCacheData(key, queryResponse)
    } else {
        data = cacheData as GraphQLResponse;
    }


    // Get Function to parse data type
    const parse = getResponseParse(req);
    const parsedData: ReadMeData = parse(data)

    // Get Function to create svg card for data type
    const createCard: Function = cardDirect(req);
    const card: string = createCard(req, parsedData);

    // Send created card as svg string
    res.status(200).send(card);
};



// GitHub Streak Controller
export const getCommitStreak = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) { // Username requirement, Blacklist checking
        return;
    }
    const key = `github:${req.params.username!}:streak`;

    let data: STREAKTYPE;
    const [success, cacheData] = await getCacheData(key);
    if (!success) {
        // Query user data for Creation Date and Years of membership
        const [created, years] = await streakProbe(req, res);
        if (created == false) {
            return;
        }

        // Start data with defaults sets
        let streak: STREAKTYPE = {
            total: 0,
            totalText: "Total Contributions",
            totalRange: [`${new Date(created as string).toISOString().slice(0, 10)}`, `${new Date().toISOString().slice(0, 10)}`],
            curr: 0,
            currText: "Current Streak",
            currDate: ["", ""],
            longest: 0,
            longestText: "Longest Streak",
            longestDate: ["", ""],
            theme: req.query.theme !== undefined ?
                THEMES[req.query.theme! as string] as THEMETYPE :
                {
                    ...THEMES["black-ice"]!,
                    hideBorder: false,
                    borderRadius: 10,
                    locale: 'en'
                } as THEMETYPE,
        }
        // starting template variables for query
        const { username } = req.params;
        let variables = { login: username, start: "", end: "" };

        // Call data for each year
        for (let year of years) {
            // If before year is created year, set start to create data else year start
            if (year == new Date(created as string).getFullYear()) {
                variables.start = new Date(created as string).toISOString().slice(0, 19) + 'Z';
            } else {
                variables.start = `${year}-01-01T00:00:00Z`;
            }
            // If year is this year, set end to current date else end of year
            if (year == new Date().getFullYear()) {
                variables.end = new Date().toISOString().slice(0, 19) + 'Z'
            } else {
                variables.end = `${year}-12-31T00:00:00Z`;
            }
            // Query data for the specific yar
            const data = await preQery(res, variables, "streak")
                .then((data) => { return data });
            if (data == false) {
                return;
            }
            
            // Get Function to parse data
            const parse = getResponseParse(req);
            // Parse that data with our current stats to update
            parse(streak, data)
        }
        data = streak;
        setCacheData(key, streak);
    } else {
        data = cacheData as STREAKTYPE;
    }
    
    const card: string = streakCardSetup(req, data);
    res.status(200).send(card);
    return;
};
