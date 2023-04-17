/** @format */

import {
  WakaInsight,
  WakaLang,
  WakaStat,
  WakaRawData,
} from "./wakatimeTypes";
import { getLangColor } from "../utils/colors";

export const wakaRawParse = (data: WakaRawData): [WakaInsight, WakaLang, WakaStat] => {
  let insights = wakaInsightParse(data);
  let languages = wakaLanguagesParse(data);
  let stats = wakaStatParse(data);

  return [insights, languages, stats];
};

const wakaInsightParse = (data: WakaRawData): WakaInsight => {
  const topLanguage = data.languages[0];
  const topProject = data.projects[0];
  const topCategory = data.categories[0];
  const topEditor = data.editors[0];
  const topOS = data.operating_systems[0];
  const dailyAverage = (
    data.daily_average_including_other_language /
    60 /
    60
  ).toFixed(2);

  return {
    topLanguage: topLanguage,
    topProject: topProject,
    topCategory: topCategory,
    topEditor: topEditor,
    topOS: topOS,
    dailyAverage: dailyAverage,
  } as WakaInsight;
};

const wakaLanguagesParse = (data: WakaRawData): WakaLang => {
  let topTotal = 0;
  data.languages.slice(0, 6).map((lang) => {
    topTotal += lang.total_seconds;
  });

  const languages = data.languages.slice(0, 6).map((lang) => {
    return {
      name: lang.name,
      total_seconds: lang.total_seconds,
      percent: parseFloat(((lang.total_seconds / topTotal) * 100).toFixed(2)),
      color: getLangColor(lang.name),
    };
  });

  return {
    languages: languages,
  } as WakaLang;
};

const wakaStatParse = (data: WakaRawData): WakaStat => {
  const totalBest = (data.best_day.total_seconds / 60 / 60).toFixed(1);
  const bestDate = data.best_day.date;
  const totalDevSec = (
    data.total_seconds_including_other_language /
    60 /
    60
  ).toFixed(1);
  const accountStart = data.start.slice(0, 10);
  const dailyAvg = (
    data.daily_average_including_other_language /
    60 /
    60
  ).toFixed(1);
  const totalDevDays = data.days_minus_holidays;

  return {
    totalBest: totalBest,
    bestDate: bestDate,
    totalDevSec: totalDevSec,
    accountStart: accountStart,
    dailyAvg: dailyAvg,
    totalDevDays: totalDevDays,
  } as WakaStat;
};
