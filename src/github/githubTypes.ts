export interface STREAKTYPE {
    total: number
    totalText: string
    totalRange: string
    curr: number
    currText: string
    currDate: string
    longest: number
    longestText: string
    longestDate: string
}

export interface STATTYPE{
    grade: string
    totalStars: number
    totalCommits: number
    totalPR: number
    totalIssues: number
    contributedTo: number
}

export interface LANGTYPE {
    name: string
    usage: number
    color: string | number
}