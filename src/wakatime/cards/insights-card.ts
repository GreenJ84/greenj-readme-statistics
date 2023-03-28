import { Request } from "express";
import { THEMETYPE } from "../../utils/themes";
import { baseCardThemeParse } from "../../utils/utils";
import { STATTYPE } from "../wakatimeTypes";


export const insightsCardSetup = (req: Request, data: STATTYPE): string => {
    const theme: THEMETYPE = data.theme;

    baseCardThemeParse(req, theme);
    const {
        scoreRing,
        icons,
        score,
        stats,
        textMain,
        textSub,

        title
    } = req.query;

    if (scoreRing !== undefined) {
        theme.detailMain = ("#" + scoreRing) as string;
    }
    if (icons !== undefined) {
        theme.detailSub = ("#" + icons) as string;
    }
    if (score !== undefined) {
        theme.statsMain = ("#" + score) as string;
    }
    if (stats !== undefined) {
        theme.statsSub = ("#" + stats) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSub !== undefined) {
        theme.textSub = ("#" + textSub) as string;
    }
    if (title != undefined) {
        data.title = title as string;
    } else { data.title = `${req.params.username!}'s WakaTime Insights` }

    return ``
}