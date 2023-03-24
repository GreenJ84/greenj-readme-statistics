import { Request, Response } from "express";

// API Global imports
import { GraphQLError } from "../utils/constants";
import { preFlight } from "../utils/utils";
import { THEMES, THEMETYPE } from "../utils/themes";

// GitHub specific imports
import {  GraphQLResponse, ReadMeData, StreakResponse, STREAKTYPE } from "../github/githubTypes";
import { preQery, streakProbe } from "../github/query";
import { getResponseParse } from "../github/apiParser";
import { cardDirect } from "../github/githubUtils";
import { streakCardSetup } from "../github/cards/streak-card";


// GitHub controller for all GitHub routes except - Commit Streak Data
export const getProfileStats = async (req: Request, res: Response) => {
    if (!preFlight(req, res)) {
        return;
    }

    // Initialize data query
    let variables = { login: req.params.username! }
    const data = await preQery(req, res, variables)
        .then((data: GraphQLResponse | GraphQLError) => {
            if ((data as GraphQLError).error !== undefined) {
                res.status(400).send(data);
            }
            return data as GraphQLResponse;
        })

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

    // Query user data for Creation Date and Years of membership
    const [created, years] = await streakProbe(req, res);
    /* 
        - If the probe returns false, something disrupted the API call
        - The probe itself sends out error data as a response
    */
    if (typeof (created) == "boolean") {
        return;
    }
    // Start data with defaults sets
    let streak: STREAKTYPE = {
        title: req.query.title !== undefined ?
            req.query.title as string : "GreenJ84's Streak",
        total: 0,
        totalText: "Total Contributions",
        totalRange: [`${new Date(created).toISOString().slice(0,10)}`, `${new Date().toISOString().slice(0,10)}`],
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
    let variables = {login: username, start: "", end: ""};

    // Call data for each year
    for (let year of years) {
        // If before year is created year, set start to create data else year start
        if (year == new Date(created).getFullYear()) {
            variables.start = new Date(created).toISOString().slice(0, 19) + 'Z';
        } else {
            variables.start = `${year}-01-01T00:00:00Z`;
        }
        // If year is this year, set end to current date else end of year
        if (year == new Date().getFullYear()) {
            variables.end = new Date().toISOString().slice(0,19)+'Z'
        } else {
            variables.end = `${year}-12-31T00:00:00Z`;
        }
        // Query data for the specific yar
        const data: StreakResponse = await preQery(req, res, variables)
            .then((data: GraphQLResponse | GraphQLError) => {
                if ((data as GraphQLError).error !== undefined) {
                    res.status(400).send(data);
                }
                return data as unknown as StreakResponse;
            })
        
        // Get Function to parse data
        const parse = getResponseParse(req);
        // Parse that data with our current stats to update
        parse(streak, data)
    }
    
    const card: string = streakCardSetup(req, streak);
    res.status(200).send(card);
};
