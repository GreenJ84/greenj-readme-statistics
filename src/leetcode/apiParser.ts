import { Request } from "express";
import { match } from "ts-pattern";

import { LeetProfileData, LeetBadges, LeetStats, LeetCompletion, LeetStreak, LeetStreakData, LeetSubmissions } from "./leetcodeTypes"
import { calculateRank } from "./leetcodeUtils";

// Returns the parse creation function depending on path
export const leetParseDirect = (req: Request): Function => {
    const parseFunc = match(req.path.split('/')[2]!)
        .with("stats", () => {return leetStatsParse})
        .with("badges", () => {return leetBadgesParse})
        .with("questions_solved", () => {return leetCompletionParse})
        .with("recent-questions", () => {return leetSubmissionParse})
        // .with("daily-question", () => {return })
        .with("streak", () => {return streakParse})
        .run()
    return parseFunc
}

const leetStatsParse = (data: LeetProfileData): LeetStats => {
    const stats = {
        completion: (data.matchedUser.submitStats.acSubmissionNum[0]!.count / data.allQuestionsCount[0]!.count * 100).toFixed(2),
        reputation: data.matchedUser.profile.reputation,
        stars: data.matchedUser.profile.starRating,
        badges: data.matchedUser.badges.length,
        contributions: data.matchedUser.contributions.points
    } as LeetStats;
    const grade = calculateRank(stats);

    return {
        ...stats,
        grade: grade,
    };
}

const leetBadgesParse = (data: LeetProfileData): LeetBadges => {
    let badges: Object[] = [];
    for (let badge of data.matchedUser.badges) {
        let { id, ...LeetBadges } = badge;
        badges.push(LeetBadges);
    }

    return {
        badges: badges,
    } as LeetBadges;
}

const leetCompletionParse = (data: LeetProfileData): LeetCompletion => {
    const ranking = data.matchedUser.profile.ranking;
    const all = data.matchedUser.submitStats.acSubmissionNum[0]!.count;
    const totalAll = data.allQuestionsCount[0]!.count;
    const hard = data.matchedUser.submitStats.acSubmissionNum[3]!.count;
    const totalHard = data.allQuestionsCount[3]!.count;
    const medium = data.matchedUser.submitStats.acSubmissionNum[2]!.count;
    const totalMedium = data.allQuestionsCount[2]!.count;
    const easy = data.matchedUser.submitStats.acSubmissionNum[1]!.count;
    const totalEasy = data.allQuestionsCount[1]!.count;
    const acceptance = (all / data.matchedUser.submitStats.acSubmissionNum[0]!.submissions * 100).toFixed(2);



    return {
        ranking: ranking,
        all: [all, totalAll],
        hard: [hard, totalHard],
        medium: [medium, totalMedium],
        easy: [easy, totalEasy],
        acceptance: acceptance,
    };
}


const leetSubmissionParse = (data: LeetProfileData): LeetSubmissions => {
    const recentSubmissions: LeetSubmissions = { recentSubmissionList: [] }
    const seen: { [key: string]: number } = {}
    
    // Throttle repeated questions from appearing excessively
    data.recentSubmissionList
        .map((submission) => {
            if (submission.statusDisplay == "Accepted") {
                if (!(submission.title in seen)) {
                    seen[submission.title] = 1;
                    recentSubmissions.recentSubmissionList.push(submission);
                }
            }
        })
    return {
        recentSubmissionList: recentSubmissions.recentSubmissionList.slice(0,6),
    };
}

const streakParse = (streak: LeetStreak, data: LeetStreakData, year: number): void => {
    const completion = (data.matchedUser.submitStats.acSubmissionNum[0]!.count / data.allQuestionsCount[0]!.count * 100).toFixed(2);
    const completeQs = data.matchedUser.submitStats.acSubmissionNum[0]!.count;
    const totalQs = data.allQuestionsCount[0]!.count;
    const yearStreak = data.matchedUser.userCalendar.streak;
    const yearsActiveDays = data.matchedUser.userCalendar.totalActiveDays;
    
    if (streak.streak[0] < yearStreak) {
        streak.streak[0] = yearStreak;
        streak.streak[1] = year;
    }
    streak.totalActive += yearsActiveDays
    if (year == new Date().getFullYear()) {
        streak.mostActiveYear = yearsActiveDays;
    }
    streak.completion = (Math.max(parseFloat(streak.completion), parseFloat(completion))).toString();
    streak.completionActuals = [completeQs, totalQs];
    return;
}

