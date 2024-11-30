import { ThemeType } from "../utils/themes";

//=========== Raw Data Types ============
export type RawGraphResponse = RawUserProbe | RawUserData;

export interface RawUserProbe {
  user: {
    createdAt: string;
    contributionsCollection: {
      contributionYears: number[];
    };
  };
}

export type RawUserData = RawProfileData | RawStreakData | RawUserStats | RawUserLanguages;

export interface RawProfileData extends RawUserProbe, RawUserLanguages, RawUserStats {
  user: {
    name: string;
    createdAt: string;
    contributionsCollection: {
      contributionYears: number[];
      totalCommitContributions: number;
      restrictedContributionsCount: number;
    };
    repositoriesContributedTo: {
      totalCount: number;
    };
    pullRequests: {
      totalCount: number;
    };
    issues: {
      totalCount: number;
    };
    followers: {
      totalCount: number;
    };
    repositories: {
      totalCount: number;
      nodes: {
        name: string;
        stargazers: {
          totalCount: number;
        };
        languages: {
          edges: {
            size: number;
            node: {
              color: string;
              name: string;
            };
          }[];
        };
      }[];
    };
  };
}

export interface RawStreakData {
  user: {
    createdAt: string;
    contributionsCollection: {
      contributionYears: number[];
      contributionCalendar: {
        weeks: {
          contributionDays: {
            contributionCount: number;
            date: string;
          }[];
        }[];
      };
    };
  };
}

export interface RawUserStats {
  user: {
    name: string;
    contributionsCollection: {
      totalCommitContributions: number;
      restrictedContributionsCount: number;
    };
    repositoriesContributedTo: {
      totalCount: number;
    };
    pullRequests: {
      totalCount: number;
    };
    issues: {
      totalCount: number;
    };
    followers: {
      totalCount: number;
    };
    repositories: {
      totalCount: number;
      nodes: {
        name: string;
        stargazers: {
          totalCount: number;
        };
      }[];
    };
  };
}


// Language related types
export interface RawUserLanguages {
  user: {
    repositories: {
      nodes: {
        name: string;
        languages: {
          edges: {
            size: number;
            node: {
              color: string;
              name: string;
            };
          }[];
        };
      }[];
    };
  };
}

//=========== Parse Data Types ============
export type UserData = UserProfile | UserStreak | UserStats | UserLanguages;

export interface UserProfile {
  streak: UserStreak;
  stats: UserStats;
  languages: UserLanguages;
}

export interface UserStreak {
  title?: string;
  total: number;
  totalText: string;
  totalRange: string[];
  curr: number;
  currText: string;
  currDate: string[];
  longest: number;
  longestText: string;
  longestDate: string[];
  theme?: ThemeType;
}

export interface UserStats {
  title?: string;
  grade?: [string, number];
  stars: number;
  followers: number;
  commits: number;
  PR: number;
  issues: number;
  contributedTo: number;
  repos: number;
  theme?: ThemeType;
}

export interface LanguageData {
  name: string;
  usage: number | string;
  position: number;
  width: number;
  color: string;
}

export interface UserLanguages {
  title?: string;
  totalSize: number;
  languages: LanguageData[];
  theme?: ThemeType;
}