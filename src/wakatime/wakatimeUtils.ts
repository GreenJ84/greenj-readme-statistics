import { match } from "ts-pattern"
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