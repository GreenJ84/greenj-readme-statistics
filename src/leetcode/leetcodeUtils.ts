import { match } from "ts-pattern";
import { Request } from "express";
import { badgesParse, questionsSolvedParse, recentQuestionsParse, statsParse } from "./apiParser";

// Returns the parse graph query file depending on path
export const getGraph = (type: string): string => {
    const graph = match(type)
        .with("stats", () => {return "src/leetcode/graphql/leetcode-profile.graphql"})
        .with("badges", () => {return "src/leetcode/graphql/leetcode-badges.graphql"})
        .with("questions_solved", () => {return "src/leetcode/graphql/leetcode-questions-answered.graphql"})
        .with("recent-questions", () => { return "src/leetcode/graphql/leetcode-recent-submissions.graphql" })
        .with("daily-question", () => { return "src/leetcode/graphql/leetcode-daily-question.graphql" })
        .run()
    return graph
}

// Returns the parse creation function depending on path
export const parseDirect = (req: Request): Function => {
    const type = req.path.split("/")[2]!;
    const parseFunc = match(type)
        .with("stats", () => {return statsParse})
        .with("badges", () => {return badgesParse})
        .with("questions_solved", () => {return questionsSolvedParse})
        .with("recent-questions", () => {return recentQuestionsParse})
        // .with("daily-question", () => {return langsCardSetup})
        .run()
    return parseFunc
}

// Returns the card creation function depending on path
export const cardDirect = (req: Request): Function => {
    const type = req.path.split("/")[2]!;
    const parseFunc = match(type)
        // .with("stats", () => {return statsCardSetup})
        // .with("badges", () => {return trophCardSetup})
        // .with("questions_solved", () => {return langsCardSetup})
        // .with("recent-questions", () => {return langsCardSetup})
        // .with("daily-question", () => {return langsCardSetup})
        .run()
    return parseFunc
}