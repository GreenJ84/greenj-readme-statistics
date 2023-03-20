import { THEMETYPE } from "../utils/themes"

export enum GraphQLResponse {
    StreakResponse,
    StreakProbe,
    StatsResponse
}

export enum ReadMeData {
    STREAKTYPE,
    STATTYPE,
    LANGTYPE
}

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
    title: string
    total: number
    totalText: string
    totalRange: string[]
    curr: number
    currText: string
    currDate: string[]
    longest: number
    longestText: string
    longestDate: string[]
    theme: THEMETYPE
}

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
    grade?: string
    stars: number
    followers: number
    commits: number
    PR: number
    issues: number
    contributedTo: number,
    repos: number
    theme: THEMETYPE
}


export interface LANGTYPE {
    name: string
    usage: number
    color: string | number,
    theme: THEMETYPE
}