import { Request } from 'express';
import { match } from 'ts-pattern';

import {  LangsResponse, LANGTYPE, Language, StatsResponse, STATTYPE, StreakResponse, STREAKTYPE } from './githubTypes';
import { calculateRank } from './githubUtils';



export const getResponseParse = (req: Request): Function => {
    const type = req.path.split("/")[2]!;
    const parseFunc = match(type)
        .with("stats", () => {return statsParse})
        .with("trophies", () => {return statsParse})
        .with("languages", () => {return langsParse})
        .with("streak", () => {return streakParse})
        .run()
    return parseFunc
}

const streakParse = (streak: STREAKTYPE, data: StreakResponse) => {
    const created = streak.totalRange[0];

    const today = new Date();
    const midnightToday = new Date(today.toISOString().substr(0, 10) + 'T00:00:00.000Z');

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
                if (new Date(day.date).getTime() >= midnightToday.getTime()) {
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
    streak.longest = Math.max(longest, curr);
    streak.longestDate = longest > curr ?[lS!, lE!] : streak.currDate;
}


const statsParse = (data: StatsResponse): STATTYPE => {
    const stars = data.user.repositories.nodes
        .reduce((prev, curr) => {
            return prev + curr.stargazers.totalCount;
        }, 0);

    const stats = {
        stars: stars,
        followers: data.user.followers.totalCount,
        commits: data.user.contributionsCollection.totalCommitContributions+data.user.contributionsCollection.restrictedContributionsCount,
        PR: data.user.pullRequests.totalCount,
        issues: data.user.issues.totalCount,
        contributedTo: data.user.repositoriesContributedTo.totalCount,
        repos: data.user.repositories.totalCount,
    }
    return {...stats, grade: calculateRank(stats)}
}


const langsParse = (data: LangsResponse): LANGTYPE => {
    let langs = {} as {[key:string]: Language}
    let repoNodes = data.user.repositories.nodes;
    let hiddenLangs = ["C++","Cython","PowerShell"]
    // Filter non-language repos
    repoNodes
        .filter((node) => node.languages.edges.length > 0)
        // .filter((node) => !hiddenRepos.includes(node.name))
    // Map them to an onject holding languages data
    .map((node) => {
        for (let lang of node.languages.edges) {
            if (!hiddenLangs.includes(lang.node.name)) {
                if (langs[lang.node.name] !== undefined) {
                    langs[lang.node.name] = {
                        ...langs[lang.node.name]!,
                        usage: lang.size+(langs[lang.node.name]!.usage as number),
                    }
                } else {
                    langs[lang.node.name] = {
                        name: lang.node.name,
                        usage: lang.size,
                        width: 0,
                        position: 0,
                        color: lang.node.color,
                    }
                }
            }
        }
    });
    // total size of all langauges
    let totalSize = 0;

    // Sort languages based on size
    let sortedLangs = Object.keys(langs)
        .sort((a, b) => (langs[b]!.usage as number) - (langs[a]!.usage as number))
    sortedLangs
        .map(key => {

            totalSize += langs[key]!.usage as number
        })
    
    let topLangs: Language[] = []
    let position = 0;
    sortedLangs.slice(0,8)
        .map(key => {
            topLangs.push({
                ...langs[key]!,
                position: position,
                width: (langs[key]!.usage as number) / totalSize * 500,
                usage: ((langs[key]!.usage as number) / totalSize * 100).toFixed(2)
            })
            position += (langs[key]!.usage as number) / totalSize * 500
        })

    let stats = {
        totalSize: totalSize,
        languages: topLangs,
    }

    return stats;
}
