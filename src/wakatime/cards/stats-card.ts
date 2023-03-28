import { Request } from "express";
import { THEMETYPE } from "../../utils/themes";
import { baseCardThemeParse } from "../../utils/utils";
import { STATTYPE } from "../wakatimeTypes";

export const statsCardSetup = (req: Request, data: STATTYPE): string => {
    const theme: THEMETYPE = data.theme;

    baseCardThemeParse(req, theme);
    const {
        ringColor,
        fireColor,
        dayAvg,
        sideStats,
        textMain,
        textSide,
        dates,

        title
    } = req.query;
    if (ringColor !== undefined) {
        theme.detailMain = ("#" + ringColor) as string;
    }
    if (fireColor !== undefined) {
        theme.detailSub = ("#" + fireColor) as string;
    }
    if (dayAvg !== undefined) {
        theme.statsMain = ("#" + dayAvg) as string;
    }
    if (sideStats !== undefined) {
        theme.statsSub = ("#" + sideStats) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSide !== undefined) {
        theme.textSub = ("#" + textSide) as string;
    }
    if (dates !== undefined) {
        theme.dates = ("#" + dates) as string;
    }

    if (title !== undefined) {
        data.title = title as string
    } else {
        data.title = `${req.params.username!}'s WakaTime Stats`
    }

    return ``
}