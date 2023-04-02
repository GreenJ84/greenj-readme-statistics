/** @format */

import { Request } from "express";
import { THEMETYPE } from "../../utils/themes";
import { baseCardThemeParse } from "../../utils/utils";
import { STATTYPE } from "../githubTypes";

export const statsCardSetup = (req: Request, data: STATTYPE): string => {
    const theme: THEMETYPE = baseCardThemeParse(req);
    
    const {
        scoreRing,
        icons,
        score,
        stats,
        textMain,
        textSub,
        title
    } = req.query;

    if (scoreRing !== undefined) {
        theme.detailMain = ("#" + scoreRing) as string;
    }
    if (icons !== undefined) {
        theme.detailSub = ("#" + icons) as string;
    }
    if (score !== undefined) {
        theme.statsMain = ("#" + score) as string;
    }
    if (stats !== undefined) {
        theme.statsSub = ("#" + stats) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSub !== undefined) {
        theme.textSub = ("#" + textSub) as string;
    }
    if (title != undefined) {
        data.title = title as string;
    } else { data.title = "GreenJ84's GitHub Stats" }

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink' style='isolation: isolate' viewBox='0 0 552 215' width='552px' height='215px' direction='ltr' role="img" aria-labelledby="descId">
        <title id="titleId">${data.title}, Rank: ${data.grade}</title>
        <desc id="descId">
            Total Stars Earned: ${data.stars}, Total Commits : ${data.commits}, Total PRs: ${data.PR}, Total Issues: ${data.issues}, Contributed to: ${data.contributedTo}
        </desc>
        <style>
            .statText {
                font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
                fill: ${theme.textSub};
                letter-spacing: 1.1px;
            }
            .stat {
                font: 650 20px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
                fill: ${theme.statsSub};
                letter-spacing: 1.1px;
            }
            @supports(-moz-appearance: auto) {
            /* Selector detects Firefox */
                .stat { font-size:12px; }
            }
            .stagger {
                opacity: 0;
                animation: fadeInAnimation 0.3s ease-in-out forwards;
            }
            .rank-text {
                font: 800 26px 'Segoe UI', Ubuntu, Sans-Serif; 
                fill: ${theme.statsMain};
                animation: scaleInAnimation 0.3s ease-in-out forwards;
            }
            .not_bold { font-weight: 400 }
            .bold { font-weight: 700 }
            .icon {
                fill: ${ theme.detailSub };
                display: block;
            }
            .rank-circle-rim {
                stroke: ${ theme.detailMain };
                fill: none;
                stroke-width: 12;
                opacity: 0.2;
            }
            .rank-circle {
                stroke: ${ theme.detailMain };
                stroke-dasharray: 250;
                fill: none;
                stroke-width: 18;
                stroke-linecap: round;
                opacity: 0.8;
                transform-origin: -10px 8px;
                transform: rotate(-90deg);
                animation: rankAnimation 1s forwards ease-in-out;
            }
            
            /* Animations */
            @keyframes rankAnimation {
                from {
                    stroke-dashoffset: 251.32741228718345;
                }
                to {
                    stroke-dashoffset: 106.04382276211012;
                }
            }
            @keyframes scaleInAnimation {
                from {
                    transform: translate(-5px, 5px) scale(0);
                }
                to {
                    transform: translate(-5px, 5px) scale(1);
                }
            }
            @keyframes fadeInAnimation {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        </style>
        <defs>
            <clipPath id="outer_rectangle">
                <rect width="552" height="215" rx="${theme.borderRadius}"/>
            </clipPath>
        </defs>
        <g clip-path="url(#outer_rectangle)">
            <!-- Background -->
            <g style="isolation: isolate">
                <rect
                    stroke="${ theme.hideBorder ? theme.background : theme.border}" 
                    fill="${theme.background}" rx="${theme.borderRadius}" 
                    x="1.5" y="1.5" stroke-width="2" width="549" height="212"
                />
            </g>

            <!-- Title -->
            <g transform="translate(90,0)">
                <text x="120.5" y="28" stroke-width="0" text-anchor="middle" fill="${theme.textMain}" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
                    ${data.title}
                </text>
            </g>
            <!-- Rank Circle -->
            <g
                data-testid="rank-circle"
                transform="translate(460.5, 100)"
            >
                <circle class="rank-circle-rim" cx="-10" cy="8" r="55" />
                <circle class="rank-circle" cx="-10" cy="8" r="55" />
                <g class="rank-text">
                    <text x="-5" y="3"
                    alignment-baseline="central"
                    dominant-baseline="central"
                    text-anchor="middle"
                    >
                        ${ data.grade }
                    </text>
                </g>
            </g>
            <!-- Stars -->
            <g transform="translate(0, 60)">
                <g class="stagger" style="animation-delay: 450ms" transform="translate(15, 0)">
                    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"/>
                    </svg>
                    <text class="statText bold" x="40" y="12.5">
                        Total Stars Earned:
                    </text>
                    <text
                        class="stat old"
                        x="300.01"
                        y="12.5"
                        data-testid="stars"
                    >
                        ${ data.stars }
                    </text>
                </g>
            </g>
            <!-- Commits -->
            <g transform="translate(0, 85)">
                <g class="stagger" style="animation-delay: 600ms" transform="translate(15, 0)">
                    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        <path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"/>
                    </svg>
                    <text class="statText bold" x="40" y="12.5">
                        Total Commits (2023):
                    </text>
                    <text
                        class="stat bold"
                        x="300.01"
                        y="12.5"
                        data-testid="commits"
                    >
                        ${ data.commits > 1000 ? `${Math.floor(data.commits/1000)}.${Math.floor(data.commits/100)%10}k`: data.commits }
                    </text>
                </g>
            </g>
            <!-- Pull Requests -->
            <g transform="translate(0, 110)">
                <g class="stagger" style="animation-delay: 750ms" transform="translate(15, 0)">
                    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        <path fill-rule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/>
                    </svg>
                    <text class="statText bold" x="40" y="12.5">
                        Total PRs:
                    </text>
                    <text
                        class="stat  bold"
                        x="300.01"
                        y="12.5"
                        data-testid="prs"
                    >
                        ${ data.PR }
                    </text>
                </g>
            </g>
            <!-- Issues -->
            <g transform="translate(0, 135)">
                <g class="stagger" style="animation-delay: 900ms" transform="translate(15, 0)">
                    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        <path fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"/>
                    </svg>
                    <text class="statText bold" x="40" y="12.5">
                        Total Issues:
                    </text>
                    <text
                        class="stat bold"
                        x="300.01"
                        y="12.5"
                        data-testid="issues"
                    >
                        ${ data.issues }
                    </text>
                </g>
            </g>
        <!-- Repos -->
            <g transform="translate(0, 160)">
                <g class="stagger" style="animation-delay: 1050ms" transform="translate(15, 0)">
                    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        <path d="M3.706 5.903c0.111 0.789 0.526 2.138 2.058 2.719C7.333 9.219 7.333 9.689 7.333 10v0.109c-0.96 0.289 -1.667 1.171 -1.667 2.225 0 1.287 1.047 2.333 2.333 2.333s2.333 -1.047 2.333 -2.333c0 -1.053 -0.707 -1.935 -1.667 -2.225V10c0 -0.311 0 -0.781 1.569 -1.377 1.532 -0.581 1.947 -1.931 2.058 -2.719C13.275 5.627 14 4.735 14 3.667 14 2.38 12.953 1.333 11.667 1.333S9.333 2.38 9.333 3.667c0 1.035 0.681 1.903 1.616 2.209 -0.097 0.49 -0.377 1.194 -1.185 1.501 -0.795 0.301 -1.369 0.635 -1.764 1.024 -0.395 -0.389 -0.969 -0.723 -1.764 -1.024 -0.809 -0.307 -1.089 -1.011 -1.185 -1.501C5.985 5.57 6.667 4.701 6.667 3.667 6.667 2.38 5.62 1.333 4.333 1.333S2 2.38 2 3.667c0 1.068 0.725 1.961 1.706 2.237zM11.667 2.667c0.551 0 1 0.449 1 1S12.218 4.667 11.667 4.667 10.667 4.218 10.667 3.667 11.115 2.667 11.667 2.667zm-2.667 9.667c0 0.551 -0.449 1 -1 1s-1 -0.449 -1 -1 0.449 -1 1 -1 1 0.449 1 1zM4.333 2.667C4.885 2.667 5.333 3.115 5.333 3.667S4.885 4.667 4.333 4.667 3.333 4.218 3.333 3.667 3.782 2.667 4.333 2.667z"/>
                    </svg>
                    <text class="statText bold" x="40" y="12.5">
                        Total Repos:
                    </text>
                    <text
                        class="stat bold"
                        x="300.01"
                        y="12.5"
                        data-testid="contribs"
                    >
                        ${ data.repos }
                    </text>
                </g>
            </g>
            <!-- Contributed To -->
            <g transform="translate(0, 185)">
                <g class="stagger" style="animation-delay: 1050ms" transform="translate(15, 0)">
                    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                        <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                    </svg>
                    <text class="statText bold" x="40" y="12.5">
                        Contributed to (last year):
                    </text>
                    <text
                        class="stat bold"
                        x="300.01"
                        y="12.5"
                        data-testid="contribs"
                    >
                        ${ data.contributedTo }
                    </text>
                </g>
            </g>
        </g>
    </svg>`;
};
