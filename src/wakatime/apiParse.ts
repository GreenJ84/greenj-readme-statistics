import { match } from "ts-pattern";

import { langColor } from "./wakatimeUtils";
import { INSIGHTTYPE, LANGTYPE, STATTYPE, sectionObject, wakaRaw, wakaResponse, wakaSection } from "./wakatimeTypes";

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

const secParse = (section: sectionObject[]): wakaSection[] => {
    let shavedSection: wakaSection[] = [];
    for (let top of section) {
        const { name, percent, total_seconds } = top;
        shavedSection.push({ name, percent, total_seconds})
    }
    return shavedSection;
}

export const shaveData = (data: wakaRaw): wakaResponse => {

    let shavedData = {
        start: data.start,
        daily_average: data.daily_average,
        daily_average_including_other_language: data.daily_average_including_other_language,
        days_minus_holidays: data.days_minus_holidays,
        total_seconds: data.total_seconds, 
        total_seconds_including_other_language: data.total_seconds_including_other_language,
        categories: secParse(data.categories.slice(0, 3)),
        projects: secParse(data.projects.slice(0, 3)),
        languages: secParse(data.languages.slice(0, 3)),
        editors: secParse(data.editors.slice(0, 3)),
        operating_systems: secParse(data.operating_systems.slice(0, 3)),
        dependencies: secParse(data.dependencies.slice(0, 3)),
        machines: secParse(data.machines.slice(0, 3)),
        best_day: {
            date: data.best_day.date,
            total_seconds: data.best_day.total_seconds
        }
    }

    return shavedData;
}


const insightParse = (data: wakaResponse): INSIGHTTYPE => {
    const topLanguage = data.languages[0];
    const topProject = data.projects[0];
    const topCategory = data.categories[0];
    const topEditor = data.editors[0];
    const topOS = data.operating_systems[0];
    const dailyAverage = (data.daily_average_including_other_language / 60 / 60).toFixed(2);

    return {
        topLanguage: topLanguage,
        topProject: topProject,
        topCategory: topCategory,
        topEditor: topEditor,
        topOS: topOS,
        dailyAverage: dailyAverage,
    } as INSIGHTTYPE;
}

const languagesParse = (data: wakaResponse): LANGTYPE => {
    let topTotal = 0;
    data.languages.slice(0,6).map(lang => {
        topTotal += lang.total_seconds
    });
    
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
    } as LANGTYPE
}

const statParse = (data: wakaResponse): STATTYPE => {
    const totalBest = (data.best_day.total_seconds / 60 / 60).toFixed(1);
    const bestDate = data.best_day.date;
    const totalDevSec = (data.total_seconds_including_other_language / 60 / 60).toFixed(1);
    const accountStart = data.start.slice(0,10);
    const dailyAvg = (data.daily_average_including_other_language / 60 / 60).toFixed(1);
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