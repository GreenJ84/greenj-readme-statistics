/** @format */

import { Request } from "express";
import { match } from "ts-pattern";

import { UserStats } from "./types";
import { langsCardSetup } from "./modals/langs-card";
import { statsCardSetup } from "./modals/stats-card";
import { streakCardSetup } from "./modals/streak-card";

export const getGraphQuery = (type: string): string => {
  const graph = match(type)
    .with("stats", () => {
      return "src/github/graphql/github-stats.graphql";
    })
    .with("languages", () => {
      return "src/github/graphql/github-langs.graphql";
    })
    .with("streak", () => {
      return "src/github/graphql/github-streak.graphql";
    })
    .with("all", () => {
      return "src/github/graphql/github-all-profile.graphql";
    })
    .run();
  return graph;
};

export const getGithubParserFunction = (type: string): Function => {
  return match(type)
    .with("stats", () => {
      return statsCardSetup;
    })
    .with("languages", () => {
      return langsCardSetup;
    })
    .with("streak", () => {
      return streakCardSetup;
    })
    // .with("trophies", () => {
    //     return trophyCardSetup;
    // })
    .run();
};

// Maths......
const normalcdf = (mean: number, sigma: number, to: number): number => {
  var z = (to - mean) / Math.sqrt(2 * sigma * sigma);
  var t = 1 / (1 + 0.3275911 * Math.abs(z));
  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  var sign = 1;
  if (z < 0) {
    sign = -1;
  }
  return (1 / 2) * (1 + sign * erf);
};

// also Maths.... but that leads to words
export const calculateGithubRank = (stats: UserStats): [string, number] => {
  const COMMITS_OFFSET = 1.65;
  const CONTRIBS_OFFSET = 1.65;
  const ISSUES_OFFSET = 1;
  const STARS_OFFSET = 0.75;
  const PRS_OFFSET = 0.5;
  const FOLLOWERS_OFFSET = 0.45;
  const REPO_OFFSET = 1;

  const ALL_OFFSETS =
    CONTRIBS_OFFSET +
    ISSUES_OFFSET +
    STARS_OFFSET +
    PRS_OFFSET +
    FOLLOWERS_OFFSET +
    REPO_OFFSET;

  const RANK_S_PLUS_VALUE = 1;
  const RANK_S_VALUE = 25;
  const RANK_A_VALUE = 45;
  const RANK_A2_VALUE = 60;
  const RANK_B_VALUE = 100;

  const TOTAL_VALUES =
    RANK_S_PLUS_VALUE +
    RANK_S_VALUE +
    RANK_A_VALUE +
    RANK_A2_VALUE +
    RANK_B_VALUE;

  const score =
    (stats.commits * COMMITS_OFFSET +
      stats.contributedTo * CONTRIBS_OFFSET +
      stats.issues * ISSUES_OFFSET +
      stats.stars * STARS_OFFSET +
      stats.PR * PRS_OFFSET +
      stats.followers * FOLLOWERS_OFFSET +
      stats.repos * REPO_OFFSET) /
    100;

  const normalizedScore = normalcdf(score, TOTAL_VALUES, ALL_OFFSETS) * 100;

  const level = (() => {
    if (normalizedScore < RANK_S_PLUS_VALUE) return "S+";
    if (normalizedScore < RANK_S_VALUE) return "S";
    if (normalizedScore < RANK_A_VALUE) return "A++";
    if (normalizedScore < RANK_A2_VALUE) return "A+";
    return "B+";
  })();

  return [level, normalizedScore];
};
