import { match } from "ts-pattern";
import { INSIGHTTYPE, LANGTYPE, STATTYPE, wakaResponse } from "./wakatimeTypes";

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

const insightParse = (data: wakaResponse): INSIGHTTYPE => {
    const topLanguage = data.languages[0];
    const topProject = data.projects[0];
    const topCategory = data.categories[0];
    const topEditor = data.editors[0];
    const topOS = data.operating_systems[0];
    const topMachine = data.machines[0];

    return {
        topLanguage: topLanguage,
        topProject: topProject,
        topCategory: topCategory,
        topEditor: topEditor,
        topOS: topOS,
        topMachine: topMachine
    } as INSIGHTTYPE;
}

const languagesParse = (data: wakaResponse): LANGTYPE => {
    const languages = data.languages;
    return {languages: languages} as LANGTYPE
}

const statParse = (data: wakaResponse): STATTYPE => {
    const totalBest = data.best_day.total_seconds;
    const bestDate = data.best_day.date;
    const totalDevSec = data.total_seconds_including_other_language;
    const accountStart = data.created_at;
    const dailyAvg = data.daily_average_including_other_language;
    const totalDevDays = data.days_minus_holidays;

    return {
        totalBest: totalBest,
        bestDate: bestDate,
        totalDevSec: totalDevSec,
        accountStart: accountStart,
        dailyAvg: dailyAvg,
        totalDevDays: totalDevDays,
    } as STATTYPE
}