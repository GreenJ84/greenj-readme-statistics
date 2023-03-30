import { match } from "ts-pattern";
import { THEMES } from "../utils/themes";
import { INSIGHTTYPE, LANGTYPE, STATTYPE, wakaResponse } from "./wakatimeTypes";
import { langColor } from "./wakatimeUtils";

export const parseDirect = (type: string): Function => {
    const parseFunc: Function = match(type)
        .with ("insights", () => {
            return insightParse
        })
        .with("languages", () => {
            return languagesParse
        })
        .with("stats", () => {
            return statParse
        })
        .run()

    return parseFunc;
}

const theme = THEMES["black-ice"]!

const insightParse = (data: wakaResponse): INSIGHTTYPE => {
    const topLanguage = data.languages[0];
    const topProject = data.projects[0];
    const topCategory = data.categories[0];
    const topEditor = data.editors[0];
    const topOS = data.operating_systems[0];
    const dailyAverage = data.daily_average_including_other_language;

    return {
        topLanguage: topLanguage,
        topProject: topProject,
        topCategory: topCategory,
        topEditor: topEditor,
        topOS: topOS,
        dailyAverage: dailyAverage,
        theme: theme
    } as INSIGHTTYPE;
}

const languagesParse = (data: wakaResponse): LANGTYPE => {
    let topTotal = 0;
    data.languages.slice(0,6).map(lang => {
        topTotal += lang.total_seconds
    });
    console.log(topTotal)
    const languages = data.languages.slice(0,6).map(lang => {
        return {
            name: lang.name,
            total_seconds: lang.total_seconds,
            percent: parseFloat((lang.total_seconds / topTotal * 100).toFixed(2)),
            color: langColor(lang.name)
        }
    });

    return {
        languages: languages,
        theme: theme
    } as LANGTYPE
}

const statParse = (data: wakaResponse): STATTYPE => {
    const totalBest = (data.best_day.total_seconds / 60 / 60).toFixed(1);
    const bestDate = data.best_day.date;
    const totalDevSec = (data.total_seconds_including_other_language / 60 / 60).toFixed(1);
    const accountStart = data.created_at.slice(0,10);
    const dailyAvg = (data.daily_average_including_other_language / 60 / 60).toFixed(1);
    const totalDevDays = data.days_minus_holidays;

    return {
        totalBest: totalBest,
        bestDate: bestDate,
        totalDevSec: totalDevSec,
        accountStart: accountStart,
        dailyAvg: dailyAvg,
        totalDevDays: totalDevDays,
        theme: theme
    } as STATTYPE
}