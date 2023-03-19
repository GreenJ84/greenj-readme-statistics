import { Request } from 'express';
import { match } from 'ts-pattern';
import {  StreakResponse, STREAKTYPE } from './githubTypes';


export const getResponseParse = (req: Request): Function => {
    const type = req.path.split("/")[2]!;
    const parseFunc = match(type)
        // .with("stats", () => {return statsParse})
        // .with("trophies", () => {return statsParse})
        // .with("languages", () => {return langsParse})
        .with("streak", () => {return streakParse})
        .run()
    
    return parseFunc
}

const streakParse = (streak: STREAKTYPE, data: StreakResponse) => {
    const created = streak.totalRange[0];

    let total = streak.total;
    let curr = streak.curr;
    let [cS, cE] = streak.currDate;
    let longest = streak.longest;
    let [lS, lE] = streak.longestDate;
    let past = true;

    for (let week of data.user.contributionsCollection.contributionCalendar.weeks) {
        if (!past) { break }
        for (let day of week.contributionDays) {
            // Days before created account get skipped
            if (new Date(day.date).getTime() < new Date(created!).getTime()) {
                continue
            }
            // Days with contributions get added
            if (day.contributionCount > 0) {
                // If no curr streak, start the curr range
                if (curr == 0) {
                    cS = new Date(day.date).toISOString().slice(0, 10);
                }
                total += day.contributionCount;
                curr += 1;
                cE = new Date(day.date).toISOString().slice(0, 10);
            }
            // No contributions?
            else {
                // Check to see if current streak is longest
                longest = Math.max(curr, longest) 
                // If curr is longest, set the longest end as one before
                if (longest == curr) {
                    lS = cS
                    lE = cE
                }
                // If its in the future, break and end search
                if (new Date(day.date).getTime() >= new Date().getTime()) {
                    past = false;
                    break;
                }
                // Reset current counter and dates if valid missed day
                curr = 0;
                cS = new Date(day.date).toISOString().slice(0, 10);
                cE = new Date(day.date).toISOString().slice(0, 10);
            }
        }
    }
    streak.total = total;
    streak.curr = curr;
    streak.currDate = [cS!, cE!];
    streak.longest = longest;
    streak.longestDate = [lS!, lE!];
}

// export const statsParse = () => {
    
// }

// export const langsParse = () => {
    
// }
