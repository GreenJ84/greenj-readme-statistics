/** @format */

import { match } from "ts-pattern";

import { wakaInsightCard } from "./cards/insights-card";
import { wakaLanguagesCard } from "./cards/langs-card";
import { wakaStatsCard } from "./cards/stats-card";

export const wakaCardDirect = (type: string): Function => {
  const cardFunc: Function = match(type)
    .with("insights", () => {
      return wakaInsightCard;
    })
    .with("languages", () => {
      return wakaLanguagesCard;
    })
    .with("stats", () => {
      return wakaStatsCard;
    })
    .run();
  return cardFunc;
};
