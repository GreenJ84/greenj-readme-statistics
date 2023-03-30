import { match } from "ts-pattern"
import { COLORS, githubColorMapping } from "../utils/colors"
import { insightsCardSetup } from "./cards/insights-card"
import { langsCardSetup } from "./cards/langs-card"
import { statsCardSetup } from "./cards/stats-card"

export const cardDirect = (type: string): Function => {
    const cardFunc: Function = match(type)
        .with ("insights", () => {
            return () => insightsCardSetup
        })
        .with("languages", () => {
            return () => langsCardSetup
        })
        .with("stats", () => {
            return () => statsCardSetup
        })
        .run()
    return cardFunc;
}

export const langColor = (lang: string): string => {
    let colorCode = "";
    if (lang in Object.keys(githubColorMapping)) {
        colorCode = githubColorMapping[lang]!;
    } else {
        const random = Math.floor(Math.random()*COLORS.length-1);
        colorCode = COLORS[random]!
    }
    return colorCode;
}