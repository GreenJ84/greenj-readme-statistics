import { Request } from "express";
import { match } from "ts-pattern";

import { LeetRawProfileData, LeetUserBadges, LeetUserStats, LeetUserCompletion, LeetUserStreak, LeetRawStreakData, LeetUserSubmissions } from "./leetcodeTypes"
import { calculateRank } from "./leetcodeUtils";

// Returns the parse creation function depending on path
export const leetParseDirect = (req: Request): Function => {
    const parseFunc = match(req.path.split('/')[2]!)
        .with("stats", () => {return leetUserStatsParse})
        .with("badges", () => {return leetUserBadgesParse})
        .with("completion", () => {return leetCompletionParse})
        .with("submission", () => {return leetSubmissionParse})
        // .with("daily", () => {return })
        .with("streak", () => {return streakParse})
        .run()
    return parseFunc
}

const leetUserStatsParse = (data: LeetRawProfileData): LeetUserStats => {
    const stats = {
        completion: (data.matchedUser.submitStats.acSubmissionNum[0]!.count / data.allQuestionsCount[0]!.count * 100).toFixed(2),
        reputation: data.matchedUser.profile.reputation,
        stars: data.matchedUser.profile.starRating,
        badges: data.matchedUser.badges.length,
        contributions: data.matchedUser.contributions.points
    } as LeetUserStats;
    const grade = calculateRank(stats);

    return {
        ...stats,
        grade: grade,
    };
}

const leetUserBadgesParse = (data: LeetRawProfileData): LeetUserBadges => {
    let badges: Object[] = [];
    for (let badge of data.matchedUser.badges) {
        let { id, ...badgeData } = badge;
        badges.push(badgeData);
    }

    return {
        badges: badges,
    } as LeetUserBadges;
}

const leetCompletionParse = (data: LeetRawProfileData): LeetUserCompletion => {
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


const leetSubmissionParse = (data: LeetRawProfileData): LeetUserSubmissions => {
    const recentSubmissions: LeetUserSubmissions = { recentSubmissionList: [] }
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

const streakParse = (streak: LeetUserStreak, data: LeetRawStreakData, year: number): void => {
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

