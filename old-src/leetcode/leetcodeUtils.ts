import { Request } from "express";
import { match } from "ts-pattern";

import { LeetUserStats } from "./leetcodeTypes";

import { leetCompletionCard } from "./cards/questions-card";
import { leetSubmissionsCard } from "./cards/recent-card";
import { leetStatsCard } from "./cards/stats-card";
import { leetStreakCard } from "./cards/streak-card";


// Returns the parse graph query file depending on path
export const getLeetGraph = (type: string): string => {
    const graph = match(type)
        //! Individual route calling not yet enable
        // .with("stats", () => {return "src/leetcode/graphql/leetcode-profile.graphql"})
        // .with("badges", () => {return "src/leetcode/graphql/leetcode-badges.graphql"})
        // .with("completion", () => {return "src/leetcode/graphql/leetcode-questions-answered.graphql"})
        // .with("submission", () => { return "src/leetcode/graphql/leetcode-recent-submissions.graphql" })
        .with("all", () => { return "src/leetcode/graphql/leetcode-all-profile.graphql" })

        .run()
    return graph
}

// Returns the card creation function depending on path
export const leetCardDirect = (req: Request): Function => {
    const parseFunc = match(req.path.split('/')[2]!)
        .with("stats", () => {return leetStatsCard})
        // .with("badges", () => {return })
        .with("completion", () => {return leetCompletionCard})
        .with("submission", () => {return leetSubmissionsCard})
        .with("streak", () => {return leetStreakCard})
        // .with("daily", () => {return })
        .run()
    return parseFunc
}

// Maths...... <Will cite creator's reference as I did not build this stat generating function myself>
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

// also Maths.... but that leads to words <Will cite creator's reference as I did not build this stat generating function myself>
export const calculateRank = (stats: LeetUserStats): [string, number] => {
    const COMPLETION_OFFSET = 1.85;
    const REP_OFFSET = 1;
    const STARS_OFFSET = 1.25;
    const BADGE_OFFSET = 1.5;
    const CONTRIBS_OFFSET = 1.65;

    const ALL_OFFSETS =
        COMPLETION_OFFSET +
        REP_OFFSET +
        STARS_OFFSET + 
        BADGE_OFFSET +
        CONTRIBS_OFFSET;

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

    const score = (
        parseFloat(stats.completion) * COMPLETION_OFFSET +
        stats.reputation * REP_OFFSET +
        stats.stars * STARS_OFFSET +
        stats.badges * BADGE_OFFSET +
        stats.contributions * CONTRIBS_OFFSET
        ) / 100;

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
