/** @format */

import { ThemeType } from "../utils/themes";

export type RawGraphResponse =
  | RawUserProbe
  | RawUserData
  | RawDaily;

export interface RawUserProbe {
  matchedUser: {
    userCalendar: {
      activeYears: number[];
    };
  };
}

export type RawUserData = RawStreakData | RawUserStats | RawUserBadges | RawUserCompletion | RawUserSubmissions | RawProfileData;

export interface RawStreakData {
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

export interface RawUserStats {
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
    };
    submitStats: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
      totalSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
    };
    badges: {
      id: string;
    }[];
  };
}

export interface RawUserBadges {
  matchedUser: {
    badges: {
      id: string;
      displayName: string;
      icon: string;
      creationDate: string;
    }[];
  };
}

export interface RawUserCompletion {
  allQuestionsCount: {
    difficulty: string;
    count: number;
  }[];
  matchedUser: {
    profile: {
      ranking: number;
    };
    submitStats: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
      totalSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
    };
  };
}

export interface RawUserSubmissions {
  recentSubmissionList: {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }[];
}

export interface RawProfileData extends RawUserStats, RawUserBadges, RawUserCompletion, RawUserSubmissions, RawUserProbe {
  allQuestionsCount: {
    difficulty: string;
    count: number;
  }[];
  matchedUser: {
    userCalendar: {
      activeYears: number[];
    }
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
      totalSubmissionNum: {
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

export interface RawDaily {
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

export type UserData = UserProfile
  | UserStats
  | UserBadges
  | UserCompletion
  | UserSubmissions
  | UserStreak;

export interface UserStreak {
  title?: string;
  streak: [number, number];
  totalActive: number;
  mostActiveYear: number;
  completion: string;
  completionActuals: [number, number];
  theme?: ThemeType;
}

export interface UserStats {
  title?: string;
  completion: string;
  reputation: number;
  stars: number;
  badges: number;
  contributions: number;
  grade: [string, number];
  theme?: ThemeType;
}
export interface UserBadges {
  badges: {
    displayName: string;
    icon: string;
    creationDate: string;
  }[];
  theme?: ThemeType;
}

export interface UserCompletion {
  title?: string;
  ranking: number;
  all: [number, number];
  hard: [number, number];
  medium: [number, number];
  easy: [number, number];
  acceptance: string;
  theme?: ThemeType;
}

export interface UserSubmissions {
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

export interface UserProfile {
  stats: UserStats;
  badges: UserBadges;
  completion: UserCompletion;
  submissions: UserSubmissions;
  streak: UserStreak;
}
