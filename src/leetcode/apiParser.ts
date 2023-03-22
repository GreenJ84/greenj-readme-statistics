import { THEMES } from "../utils/themes";
import { BADGEDATA, BadgeReponse, PROFILEDATA, ProfileResponse, QuesionsAnsweredResponse, QUESTIONDATA, RecentSubmissionResponse } from "./leetcodeTypes"

export const statsParse = (data: ProfileResponse): PROFILEDATA => {
    const completion = (data.matchedUser.submitStats.acSubmissionNum[0]!.count / data.allQuestionsCount[0]!.count * 100).toFixed(2);
    const reputation = data.matchedUser.profile.reputation;
    const stars = data.matchedUser.profile.starRating;
    const badges = data.matchedUser.badges.length;
    const contributions = data.matchedUser.contributions.points;
    const grade = "";
    const theme = THEMES["black-ice"]!

    return {
        completion: completion,
        reputation: reputation,
        stars: stars,
        badges: badges,
        contributions: contributions,
        grade: grade,
        theme: theme
    };
}

export const badgesParse = (data: BadgeReponse): BADGEDATA => {
    let badges = [];
    for (let badge of data.matchedUser.badges) {
        let { id, ...badgeData } = badge;
        badges.push(badgeData);
    }
    return {
        badges: badges
    };
}

export const questionsSolvedParse = (data: QuesionsAnsweredResponse): QUESTIONDATA => {
    const ranking = data.matchedUser.profile.ranking;
    const all = data.matchedUser.submitStats.acSubmissionNum[0]!.count;
    const totalAll = data.allQuestionsCount[0]!.count;
    const hard = data.matchedUser.submitStats.acSubmissionNum[1]!.count;
    const totalHard = data.allQuestionsCount[1]!.count;
    const medium = data.matchedUser.submitStats.acSubmissionNum[2]!.count;
    const totalMedium = data.allQuestionsCount[2]!.count;
    const easy = data.matchedUser.submitStats.acSubmissionNum[3]!.count;
    const totalEasy = data.allQuestionsCount[3]!.count;
    const acceptance = (all / data.matchedUser.submitStats.acSubmissionNum[0]!.submissions).toFixed(2);

    return {
        ranking: ranking,
        all: [all, totalAll],
        hard: [hard, totalHard],
        medium: [medium, totalMedium],
        easy: [easy, totalEasy],
        acceptance: acceptance
    };
}

export const recentQuestionsParse = (data: RecentSubmissionResponse): RecentSubmissionResponse => {
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
    return recentSubmissions;
}