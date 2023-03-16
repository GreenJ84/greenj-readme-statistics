import { Request, Response } from "express";
import { preQery } from "../github/prequery";

export const getProfileStats = async (req: Request, res: Response) => {
    preQery(req, res);
};

export const getProfileTrophies = async (req: Request, res: Response) => {
    preQery(req, res);
};

export const getCommitStreak = async (req: Request, res: Response) => {
    preQery(req, res);
};

export const getTopLangs = async (req: Request, res: Response) => {
    preQery(req, res);
};