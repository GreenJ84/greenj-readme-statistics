import { THEMETYPE } from "../utils/themes";

export type LeetCodeGraphQLResponse =
    ProbeResponse |
    StreakResponse |
    ProfileResponse |
    DAILY_QUESTION

export interface ProbeResponse{
    matchedUser: {
        userCalendar: {
            activeYears: number[]
        }
    }
}

export interface StreakResponse {
    allQuestionsCount: {
        difficulty: string;
        count: number;
    }[];
    matchedUser: {
        userCalendar: {
            streak: number
            totalActiveDays: number
        }
        submitStats: {
            acSubmissionNum: {
                difficulty: string
                count: number
                submissions: number
            }[]
        }
    }
}
export interface STREAKDATA{
    title?: string
    streak: [number, number]
    totalActive: number
    mostActiveYear: number
    completion: string
    completionActuals: [number, number]
    theme?: THEMETYPE
}




export interface ProfileResponse {
    allQuestionsCount: {
        difficulty: string;
        count: number;
    }[];
    matchedUser: {
        contributions: {
            points: number
        }
        profile: {
            starRating: number
            reputation: number
            ranking: number
        }
        submitStats: {
            acSubmissionNum: {
                difficulty: string
                count: number
                submissions: number
            }[]
        }
        badges: {
            id: string;
            displayName: string;
            icon: string;
            creationDate: string;
        }[]
    }
    recentSubmissionList: {
        title: string;
        titleSlug: string;
        timestamp: string;
        statusDisplay: string;
        lang: string;
    }[]
}


export interface PROFILEDATA {
    title?: string
    completion: string
    reputation: number
    stars: number
    badges: number
    contributions: number
    grade: [string, number]
    theme?: THEMETYPE
}
export interface BADGEDATA {
    badges: {
        displayName: string;
        icon: string;
        creationDate: string;
    }[]
    theme?: THEMETYPE
}

export interface QUESTIONDATA {
    title?:string
    ranking: number
    all: [number, number]
    hard: [number, number]
    medium: [number, number]
    easy: [number, number]
    acceptance: string
    theme?: THEMETYPE
}

export interface SUBMISSIONDATA {
    title?: string
    recentSubmissionList: {
        title: string;
        titleSlug: string;
        timestamp: string;
        statusDisplay: string;
        lang: string;
    }[]
    theme?: THEMETYPE
}

export interface DAILY_QUESTION {
    activeDailyCodingChallengeQuestion: {
        date: string
        link: string
        question: {
            questionId: number
            boundTopicId: string
            title: string
            titleSlug: string
            content: string
            isPaidOnly: boolean
            difficulty: "Easy" | "Medium" | "Hard"
            likes: number
            dislikes: number
            topicTags: {
                name: string
                slug: string
            }
            codeSnippets: {
                lang: string
                langSlug: string
                code: string
            }[]
            stats: any
            hints: any
            status: "Accept" | "Not Accept" | "Not Start"
            challengeQuestion: {
                id: number
                date: string
                incompleteChallengeCount: number
                streakCount: number
                type: string
            }
            note: string
        }
    }
}