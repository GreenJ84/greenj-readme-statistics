import { THEMETYPE } from "../utils/themes"

export enum GraphQLResponse {
    StreakResponse,
    StreakProbe,
}

export enum ReadMeData {
    STREAKTYPE,
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
                weeks: contrWeek[]
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

export interface STATTYPE{
    grade: string
    totalStars: number
    totalCommits: number
    totalPR: number
    totalIssues: number
    contributedTo: number,
    theme: THEMETYPE
}

export interface LANGTYPE {
    name: string
    usage: number
    color: string | number,
    theme: THEMETYPE
}