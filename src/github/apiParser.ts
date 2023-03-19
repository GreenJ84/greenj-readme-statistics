import { Request } from 'express';
import { match } from 'ts-pattern';
import { THEMES, THEMETYPE } from '../utils/themes';
import { GraphQLResponse, ReadMeData, StreakResponse, STREAKTYPE } from './githubTypes';


const getResponseParse = (type: string): Function => {
    const parseFunc = match(type)
        // .with("stats", () => {return statsParse})
        // .with("trophies", () => {return statsParse})
        // .with("languages", () => {return langsParse})
        .with("streak", () => {return streakParse})
        .run()
    
    return parseFunc
}

const streakParse = (req: Request, data: StreakResponse): STREAKTYPE => {
    let total = 0;
    let recent = 0;
    let longest = 0;
    let past = true;
    console.log(data);
    for (let week of data.user.contributionsCollection.contributionCalendar.weeks) {
        if (!past) { break }
        for (let day of week.contributionDays) {
            if (day.contributionCount > 0 && (new Date(day.date).getTime() < new Date().getTime()) ) {
                total += day.contributionCount;
                recent += 1;
            }
            else if (day.contributionCount == 0) {
                longest = Math.max(recent, longest) 
                recent = 0;
            }
        }
    }

    const parsedData: STREAKTYPE = {
        title: req.query.title ?
            req.query.title as string : "GreenJ84's Streak",
        total: total,
        totalText: "Total Contributions",
        totalRange: "10-12-2022-3-18-2023",
        curr: recent,
        currText: "Current Streak",
        currDate: "10-12-2022-3-18-2023",
        longest: longest,
        longestText: "Longest Streak",
        longestDate: "10-12-2022-3-18-2023",
        theme: req.query.theme !== undefined ? 
            THEMES[req.query.theme! as string] as THEMETYPE : THEMES["black-ice"]! as THEMETYPE,
    }

    return parsedData;
}

// export const statsParse = () => {
    
// }

// export const langsParse = () => {
    
// }

export const parseGraphData = (req: Request, data: GraphQLResponse): ReadMeData => {
    const type = req.path.split("/")[2]!;
    const parse = getResponseParse(type);
    console.log(data);
    const parsedData: ReadMeData = parse(req, data);
    return parsedData;
}