/** @format */

import { Request, Response } from "express";

import { cache } from "../server";
import { UserData } from "./types";
import { getRouteSVGModal } from "./utils";
import { GithubQuerier } from "./platformQuerier";

const PLATFORM = "github";
const querier = new GithubQuerier();

export const getProfileData = async (
  req: Request,
  res: Response,
  subRoute: string
) => {
  const username = req.params.username!;
  const cacheKey = `${PLATFORM}:${username}:${subRoute}`;

  let cacheData = await cache.getItem(cacheKey);
  if (cacheData === null) {
    cacheData = await querier.getUserData(subRoute)(username);
    (async () => {
      await cache.setItem(cacheKey, cacheData)
        .catch((err) => {
          console.error("Error setting cache:", err);
        });
    })();
  }

  const data = cacheData as UserData;
  const card: string = getRouteSVGModal(subRoute)(req, data);
  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(card);
};

export const register = async (req: Request, res: Response) => {

};


export const unregister = async (req: Request, res: Response) => {

};
