/** @format */

import { ThemeType } from "../utils/themes";

export interface RawSection {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  text: string;
  hours: number;
  minutes: number;
  seconds?: number;
}

export interface RawData {
  created_at: string; // '2023-03-27T05:41:28Z',
  daily_average: number; // 18882,
  daily_average_including_other_language: number; // 18891,
  days_including_holidays: number; // 11,
  days_minus_holidays: number; // 11,
  end: string; // '2023-03-27T06:59:59Z',
  holidays: number; // 0,
  human_readable_daily_average: string; // '5 hrs 14 mins',
  human_readable_daily_average_including_other_language: string; // '5 hrs 14 mins',
  human_readable_range: string; // 'since Mar 16 2023',
  human_readable_total: string; // '57 hrs 41 mins',
  human_readable_total_including_other_language: string; // '57 hrs 43 mins',
  id: string; // '5a4477ff-16c6-4df3-a33b-7c80af72c66e',
  is_already_updating: boolean; // false,
  is_coding_activity_visible: boolean; // false,
  is_including_today: boolean; // false,
  is_other_usage_visible: boolean; // false,
  is_stuck: boolean; // false,
  is_up_to_date: boolean; // true,
  is_up_to_date_pending_future: boolean; // false,
  modified_at: string; // '2023-03-27T18:34:37Z',
  percent_calculated: number; // 100,
  range: string; // 'all_time',
  start: string; // '2023-03-16T07:00:00Z',
  status: string; // 'ok',
  timeout: number; // 15,
  timezone: string; // 'America/Los_Angeles',
  total_seconds: number; // 207703.81587,
  total_seconds_including_other_language: number; // 207804.709525,
  user_id: string; // '0ef6e415-e9c2-4830-bb0f-60646647332c',
  username: string; // 'GreenJ84',
  writes_only: boolean; // false
  categories: RawSection[];
  projects: RawSection[];
  languages: RawSection[];
  editors: RawSection[];
  operating_systems: RawSection[];
  dependencies: RawSection[];
  machines: RawSection[];
  best_day: {
    created_at: string; // '2023-03-27T05:41:31Z;
    date: string; // '2023-03-19',
    id: string; // '40a810d6-9811-4f8e-9427-216c1bfa4464',
    modified_at: string; // '2023-03-27T18:34:37Z',
    text: string; // '8 hrs 9 mins',
    total_seconds: number; // 29398.761891
  };
}
export type UserData =
  | Insight
  | Lang
  | Stat

export interface UserProfile {
  insights: Insight;
  languages: Lang;
  stats: Stat;
  [key: string]: UserData;
}

export interface Topic {
  name: string;
  total_seconds: number;
  percent: number;
}


export interface Insight {
  dailyAverage: string;
  topCategory: Topic;
  topProject: Topic;
  topLanguage: Topic;
  topEditor: Topic;
  topOS: Topic;
  title?: string;
  theme?: ThemeType;
}

export interface Lang {
  languages: {
    name: string;
    total_seconds: number;
    percent: number;
    color: string;
  }[];
  title?: string;
  theme?: ThemeType;
}

export interface Stat {
  totalBest: string;
  bestDate: string;
  totalDevSec: string;
  accountStart: string;
  dailyAvg: string;
  totalDevDays: number;
  title?: string;
  theme?: ThemeType;
}
