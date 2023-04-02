import { THEMETYPE } from "../utils/themes"

export type GraphQLResponse =
    StreakResponse |
    StreakProbe |
    StatsResponse


export type ReadMeData =
    STREAKTYPE |
    STATTYPE |
    LANGTYPE

// Streak Related Types
export interface StreakProbe{
    user: {
        createdAt: string
        contributionsCollection: {
            contributionYears: number[]
        }
    }
};
export interface StreakResponse {
    user: {
        createdAt: string
        contributionsCollection: {
            contributionYears: number[]
            contributionCalendar: {
                weeks: {
                    contributionDays: {
                        contributionCount: number
                        date: string
                    }[]
                }[]
            }
        }
    }
};
    export interface contrWeek {
        contributionDays: contrDay[]
    }
    export interface contrDay {
        contributionCount: number
        date: string
    }
export interface STREAKTYPE {
    title?: string
    total: number
    totalText: string
    totalRange: string[]
    curr: number
    currText: string
    currDate: string[]
    longest: number
    longestText: string
    longestDate: string[]
    theme?: THEMETYPE
}


// Stats related types
export interface StatsResponse{
    user: {
        name: string
        contributionsCollection: {
            totalCommitContributions: number
            restrictedContributionsCount: number
        }
        repositoriesContributedTo: {
            totalCount: number
        }
        pullRequests: {
            totalCount: number
        }
        issues: {
            totalCount: number
        }
        followers: {
            totalCount: number
        }
        repositories: {
            totalCount: number
            nodes: {
                name: string
                stargazers: {
                    totalCount: number
                }
            }[]
        }
    }
}
export interface STATTYPE{
    title?: string
    grade?: string
    stars: number
    followers: number
    commits: number
    PR: number
    issues: number
    contributedTo: number,
    repos: number
    theme?: THEMETYPE
}


// Language related types
export interface LangsResponse{
    user: {
        repositories: {
            nodes: {
                name: string
                languages: {
                    edges: {
                        size: number
                        node: {
                            color: string
                            name: string
                        }
                    }[]
                }
            }[]
        }
    }
}
export interface Language {
    name: string
    usage: number | string
    position: number
    width: number
    color: string
}
export interface LANGTYPE {
    title?: string
    totalSize: number
    languages: Language[]
    theme?: THEMETYPE
}