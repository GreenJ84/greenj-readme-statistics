import { match } from "ts-pattern";

import { WakaInsight, WakaLang, WakaStat, WakaRawSection, WakaRawData, WakaProfileData, WakaTopic } from "./wakatimeTypes";
import { getLangColor } from "../utils/colors";

export const wakaParseDirect = (type: string): Function => {
    const parseFunc: Function = match(type)
        .with ("insights", () => {
            return wakaInsightParse
        })
        .with("languages", () => {
            return wakaLanguagesParse
        })
        .with("stats", () => {
            return wakaStatParse
        })
        .run()

    return parseFunc;
}

const wakaTopicShave = (section: WakaRawSection[]): WakaTopic[] => {
    let shavedSection: WakaTopic[] = [];
    for (let top of section) {
        const { name, percent, total_seconds } = top;
        shavedSection.push({ name, percent, total_seconds})
    }
    return shavedSection;
}

export const wakaRawShave = (data: WakaRawData): WakaProfileData => {

    let shavedData = {
        start: data.start,
        daily_average: data.daily_average,
        daily_average_including_other_language: data.daily_average_including_other_language,
        days_minus_holidays: data.days_minus_holidays,
        total_seconds: data.total_seconds, 
        total_seconds_including_other_language: data.total_seconds_including_other_language,
        categories: wakaTopicShave(data.categories.slice(0, 3)),
        projects: wakaTopicShave(data.projects.slice(0, 3)),
        languages: wakaTopicShave(data.languages.slice(0, 3)),
        editors: wakaTopicShave(data.editors.slice(0, 3)),
        operating_systems: wakaTopicShave(data.operating_systems.slice(0, 3)),
        dependencies: wakaTopicShave(data.dependencies.slice(0, 3)),
        machines: wakaTopicShave(data.machines.slice(0, 3)),
        best_day: {
            date: data.best_day.date,
            total_seconds: data.best_day.total_seconds
        }
    }

    return shavedData;
}


const wakaInsightParse = (data: WakaProfileData): WakaInsight => {
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
    } as WakaInsight;
}

const wakaLanguagesParse = (data: WakaProfileData): WakaLang => {
    let topTotal = 0;
    data.languages.slice(0,6).map(lang => {
        topTotal += lang.total_seconds
    });
    
    const languages = data.languages.slice(0,6).map(lang => {
        return {
            name: lang.name,
            total_seconds: lang.total_seconds,
            percent: parseFloat((lang.total_seconds / topTotal * 100).toFixed(2)),
            color: getLangColor(lang.name)
        }
    });

    return {
        languages: languages,
    } as WakaLang
}

const wakaStatParse = (data: WakaProfileData): WakaStat => {
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
    } as WakaStat
}