import express, { Request, Response } from "express";
import { renderModalDisplay, serverHealthSuccess, themeRetrieval } from '../controllers/utility.controller';

export const serverUtilities = (app: express.Application) => {
    app.get('/', (req: Request, res: Response) => {
        renderModalDisplay(req, res);
    });

    app.get('/themes', (req: Request, res: Response) => {
        themeRetrieval(req, res);
    });

    app.get('/health', (req: Request, res: Response) => {
        serverHealthSuccess(req, res);
    });
}