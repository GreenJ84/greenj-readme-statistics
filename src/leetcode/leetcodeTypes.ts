/** @format */

import { ThemeType } from "../utils/themes";

export type LeetRawGraphResponse =
  | LeetRawUserProbe
  | LeetRawUserData
  | LeetRawDaily;

export interface LeetRawUserProbe {
  matchedUser: {
    userCalendar: {
      activeYears: number[];
    };
  };
}

export type LeetRawUserData = LeetRawStreakData | LeetRawProfileData;

export interface LeetRawStreakData {
  allQuestionsCount: {
    difficulty: string;
    count: number;
  }[];
  matchedUser: {
    userCalendar: {
      streak: number;
      totalActiveDays: number;
    };
    submitStats: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
    };
  };
}

export interface LeetRawProfileData {
  allQuestionsCount: {
    difficulty: string;
    count: number;
  }[];
  matchedUser: {
    contributions: {
      points: number;
    };
    profile: {
      starRating: number;
      reputation: number;
      ranking: number;
    };
    submitStats: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
    };
    badges: {
      id: string;
      displayName: string;
      icon: string;
      creationDate: string;
    }[];
  };
  recentSubmissionList: {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }[];
}

export type LeetUserData = LeetUserStreak | LeetUserProfile;

export interface LeetUserStreak {
  title?: string;
  streak: [number, number];
  totalActive: number;
  mostActiveYear: number;
  completion: string;
  completionActuals: [number, number];
  theme?: ThemeType;
}

export type LeetUserProfile =
  | LeetUserStats
  | LeetUserBadges
  | LeetUserCompletion
  | LeetUserSubmissions;

export interface LeetUserStats {
  title?: string;
  completion: string;
  reputation: number;
  stars: number;
  badges: number;
  contributions: number;
  grade: [string, number];
  theme?: ThemeType;
}
export interface LeetUserBadges {
  badges: {
    displayName: string;
    icon: string;
    creationDate: string;
  }[];
  theme?: ThemeType;
}

export interface LeetUserCompletion {
  title?: string;
  ranking: number;
  all: [number, number];
  hard: [number, number];
  medium: [number, number];
  easy: [number, number];
  acceptance: string;
  theme?: ThemeType;
}

export interface LeetUserSubmissions {
  title?: string;
  recentSubmissionList: {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }[];
  theme?: ThemeType;
}

export interface LeetRawDaily {
  activeDailyCodingChallengeQuestion: {
    date: string;
    link: string;
    question: {
      questionId: number;
      boundTopicId: string;
      title: string;
      titleSlug: string;
      content: string;
      isPaidOnly: boolean;
      difficulty: "Easy" | "Medium" | "Hard";
      likes: number;
      dislikes: number;
      topicTags: {
        name: string;
        slug: string;
      };
      codeSnippets: {
        lang: string;
        langSlug: string;
        code: string;
      }[];
      stats: any;
      hints: any;
      status: "Accept" | "Not Accept" | "Not Start";
      challengeQuestion: {
        id: number;
        date: string;
        incompleteChallengeCount: number;
        streakCount: number;
        type: string;
      };
      note: string;
    };
  };
}
