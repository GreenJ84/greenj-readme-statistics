
import axios from "axios";

import { ResponseError } from "../utils/utils";
import { RawData, UserProfile } from "./types";
import { WAKATIME_TOKEN } from "./environment";
import { rawProfileParse } from "./dataParsers";

export class WakaTimeQuerier {
  private WAKA_TIME_URL = "https://wakatime.com/api/v1";

  private async basePlatformQuery(
    username: string
  ): Promise<RawData> {
    const config = axios.create({
      baseURL: this.WAKA_TIME_URL,
      headers: {
        Authorization: `Basic ${Buffer.from(WAKATIME_TOKEN!).toString(
          "base64"
        )}`,
      },
    });
    const response = await config
      .get(`users/${username}/stats/all_time`, {
        params: {},
      })
      .then((res) => {
        return res.data.data as RawData;
      })
      .catch((err) => {
        throw new ResponseError(
          `Error accessing WakaTime API: ${err.response.statusText}`,
          err,
          err.response.status
        );
      });
    return response;
  }

  private profileQueryInProgress: Record<string, Boolean> = {};
  async getUserProfile(username: string): Promise<UserProfile>{
    if (this.profileQueryInProgress[username]) {
      throw new ResponseError("This call occurred while query resources were already being used. Try again after a moment.", "Resource Conflicts", 409);
    }
    const queryRepsonse = await this.basePlatformQuery(username)
      .catch((err) => {
        this.profileQueryInProgress[username] = false;
        throw err instanceof ResponseError ? err : new ResponseError(
          "Error building Profile query for the WakaTime API",
          err,
          500
        );
      });
  
    const [insights, languages, stats] = rawProfileParse(queryRepsonse);
    this.profileQueryInProgress[username] = false;
    return {
      insights,
      languages,
      stats,
    };
  }
}