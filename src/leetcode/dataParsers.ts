import { RawStreakData, RawUserBadges, RawUserCompletion, RawUserStats, RawUserSubmissions, UserBadges, UserCompletion, UserStats, UserStreak, UserSubmissions } from "./types";



export const statsParse = (data: RawUserStats): UserStats => {
  const stats = {
    completion: (data.matchedUser.submitStats.acSubmissionNum[0]!.count / data.allQuestionsCount[0]!.count * 100).toFixed(2),

    reputation: data.matchedUser.profile.reputation,

    stars: data.matchedUser.profile.starRating,

    badges: data.matchedUser.badges.length,

    contributions: data.matchedUser.contributions.points
  } as UserStats;
  const grade = calculateRank(stats);

  return {
      ...stats,
      grade: grade,
  };
};


export const badgesParse = (data: RawUserBadges): UserBadges => {
  let badges: Object[] = [];
  for (let badge of data.matchedUser.badges) {
      let { id, ...badgeData } = badge;
      badges.push(badgeData);
  }

  return {
      badges: badges,
  } as UserBadges;
};

export const completionParse = (data: RawUserCompletion): UserCompletion => {
  return {
      ranking: data.matchedUser.profile.ranking,
      all: [
        data.matchedUser.submitStats.acSubmissionNum[0]!.count,
        data.allQuestionsCount[0]!.count
      ],
      hard: [
        data.matchedUser.submitStats.acSubmissionNum[3]!.count,
        data.allQuestionsCount[3]!.count
      ],
      medium: [
        data.matchedUser.submitStats.acSubmissionNum[2]!.count,
        data.allQuestionsCount[2]!.count
      ],
      easy: [
        data.matchedUser.submitStats.acSubmissionNum[1]!.count,
        data.allQuestionsCount[1]!.count
      ],
      acceptance:  (data.matchedUser.submitStats.acSubmissionNum[0]!.submissions / data.matchedUser.submitStats.totalSubmissionNum[0]!.submissions * 100).toFixed(2),
  };
};

export const submissionsParse = (data: RawUserSubmissions): UserSubmissions => {
  const seen: { [key: string]: number } = {}

  const recentSubmissionList = data.recentSubmissionList
      .filter((submission) => {
          if (submission.statusDisplay == "Accepted") {
              if (!(submission.title in seen)) {
                  seen[submission.title] = 1;
                  return true;
              }
          }
          return false;
      })
  return {
      recentSubmissionList: recentSubmissionList.slice(0,6),
  };
};

export const streakParse = (streak: UserStreak, data: RawStreakData, year: number): void => {
  const completion = (data.matchedUser.submitStats.acSubmissionNum[0]!.count / data.allQuestionsCount[0]!.count * 100).toFixed(2);
  streak.completion = (Math.max(parseFloat(streak.completion), parseFloat(completion))).toString();

  const completeQs = data.matchedUser.submitStats.acSubmissionNum[0]!.count;
  const totalQs = data.allQuestionsCount[0]!.count;
  streak.completionActuals = [completeQs, totalQs];

  const yearStreak = data.matchedUser.userCalendar.streak;
  if (streak.streak[0] < yearStreak) {
      streak.streak[0] = yearStreak;
      streak.streak[1] = year;
  }

  const yearsActiveDays = data.matchedUser.userCalendar.totalActiveDays;

  streak.totalActive += yearsActiveDays
  if (yearsActiveDays > streak.mostActiveYear) {
      streak.mostActiveYear = yearsActiveDays;
  }
};


const calculateRank = (stats: UserStats): [string, number] => {
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