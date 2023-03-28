import { Request } from "express";
import { THEMETYPE } from "../../utils/themes";
import { baseCardThemeParse } from "../../utils/utils";
import { LANGTYPE } from "../wakatimeTypes";

export const langsCardSetup = (req: Request, data: LANGTYPE): string => {
    const theme: THEMETYPE = data.theme;

    baseCardThemeParse(req, theme);
    const {
        stats,
        textMain,
        textSub,
        
        title
    } = req.query;

    if (stats !== undefined) {
        theme.statsMain = ("#" + stats) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSub !== undefined) {
        theme.textSub = ("#" + textSub) as string;
    }

    if (title !== undefined) {
        data.title = title as string
    } else {
        data.title = `${req.params.username!}'s Language Stats`
    }

    return ``
}