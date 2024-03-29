import { Request, Response } from "express"

import { Themes } from "../utils/themes";

export const serverHealthSuccess = (_: Request, res: Response) => {
    res.set("Content-Type", "application/json");
    res.status(200).send({ message: 'Server is up and running' });
}

export const themeRetrieval = (_: Request, res: Response) => {
    res.set("Content-Type", "application/json");
    res.status(200).send({ themes: Object.keys(Themes) });
}

export const renderModalDisplay = (_: Request, res: Response) => {
    res.set('Content-Type', 'text/html');
    res.sendFile('/index.html');
}
