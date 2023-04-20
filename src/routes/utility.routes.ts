import express, { Request, Response } from "express";
import { renderModalDisplay, serverHealthSuccess } from '../controllers/utility.controller';

export const displayModals = (app: express.Application) => {
    app.get('/', (req: Request, res: Response) => {
        renderModalDisplay(req, res);
    });

    app.get('/health', (req: Request, res: Response) => {
        serverHealthSuccess(req, res);
    });
}