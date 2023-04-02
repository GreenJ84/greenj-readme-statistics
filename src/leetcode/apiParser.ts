import { match } from "ts-pattern";

import { BADGEDATA, BadgeReponse, PROFILEDATA, ProfileResponse, QuesionsAnsweredResponse, QUESTIONDATA, RecentSubmissionResponse, STREAKDATA, StreakResponse, SUBMISSIONDATA } from "./leetcodeTypes"
import { calculateRank } from "./leetcodeUtils";

// Returns the parse creation function depending on path
export const parseDirect = (type: string): Function => {
    const parseFunc = match(type)
        .with("stats", () => {return statsParse})
        .with("badges", () => {return badgesParse})
        .with("questions_solved", () => {return questionsSolvedParse})
        .with("recent-questions", () => {return recentQuestionsParse})
        // .with("daily-question", () => {return })
        .with("streak", () => {return streakParse})
        .run()
    return parseFunc
}

const statsParse = (data: ProfileResponse): PROFILEDATA => {
    const stats = {
        completion: (data.matchedUser.submitStats.acSubmissionNum[0]!.count / data.allQuestionsCount[0]!.count * 100).toFixed(2),
        reputation: data.matchedUser.profile.reputation,
        stars: data.matchedUser.profile.starRating,
        badges: data.matchedUser.badges.length,
        contributions: data.matchedUser.contributions.points
    } as PROFILEDATA;
    const grade = calculateRank(stats);

    return {
        ...stats,
        grade: grade,
    };
}

const badgesParse = (data: BadgeReponse): BADGEDATA => {
    let badges = [];
    for (let badge of data.matchedUser.badges) {
        let { id, ...badgeData } = badge;
        badges.push(badgeData);
    }

    return {
        badges: badges,
    };
}

const questionsSolvedParse = (data: QuesionsAnsweredResponse): QUESTIONDATA => {
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


const recentQuestionsParse = (data: RecentSubmissionResponse): SUBMISSIONDATA => {
    const recentSubmissions: RecentSubmissionResponse = { recentSubmissionList: [] }
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

const streakParse = (streak: STREAKDATA, data: StreakResponse, year: number): void => {
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

