import { Request, Response } from 'express';

export const getProfileStats = async (req: Request, res: Response) => {
    const type = req.path.split('/')[2]!;

    // query user data or access chache

    // parse needed data properly

    // create card from parsed data
    // return card
}