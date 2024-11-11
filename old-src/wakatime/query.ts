/** @format */

import axios from "axios";
import dotenv from "dotenv";

import { WakaRawData } from "./wakatimeTypes";
import { ResponseError, WAKA_TIME_URL } from "../utils/constants";
import { wakaRawParse } from "./apiParse";
import { getCacheKey, setCacheData } from "../utils/cache";

dotenv.config();

export const queryWakatime = async (
  username: string
): Promise<WakaRawData> => {
  if (process.env.WAKATIME_TOKEN === undefined) {
    throw new ResponseError(
      "Error accessing WakaTime API Token",
      "WakaTime Token environmental variable is missing",
      500
    );
  }

  const config = axios.create({
    baseURL: WAKA_TIME_URL,
    headers: {
      Authorization: `Basic ${Buffer.from(process.env.WAKATIME_TOKEN!).toString(
        "base64"
      )}`,
    },
  });
  const response = await config
    .get(`users/${username}/stats/all_time`, {
      params: {},
    })
    .then((res) => {
      return res.data.data as WakaRawData;
    })
    .catch((err) => {
      throw new ResponseError(
        `Error accessing WakaTime API: ${err.response.statusText}`,
        err,
        err.response.status
      );
    });
  return response;
};

let queryInProcess: Record<string, boolean> = {};
export const setWakaProfile = async (username: string): Promise<void> => {
  if (queryInProcess[username]) { 
    // Wait for initial query to have chached data
    throw new ResponseError("This call occured while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
  }
  // Query WakaTime api
  else {
    queryInProcess[username] = true;
    const queryRepsonse = await queryWakatime(username)
      .catch(err => {
        queryInProcess[username] = false;
        throw err;
      });
    
    const [insights, languages, stats] = wakaRawParse(queryRepsonse);
    await setCacheData(
      getCacheKey('url/wakatime/insights', username),
      insights
    );
      
    await setCacheData(
      getCacheKey('url/wakatime/languages', username),
      languages
    );
      
    await setCacheData(
      getCacheKey('url/wakatime/stats', username),
      stats
    );
    queryInProcess[username] = false;
  }
  return;
}

export const updateWakaProfile = async (
  username: string
): Promise<void> => {
  try {
    await setWakaProfile(username);
  }
  catch (err) {
    if (err instanceof ResponseError) {
      console.error(
        `Error (${err.error}) updating user data for ${username}: ${err.message}`
      );
    } else {
      console.error(`Error updating user data for ${username}: ${err}`);
    }
  }
  return;
};
