import { Request } from "express";
import { baseCardThemeParse } from "../../utils/utils";
import { LeetUserCompletion } from "../leetcodeTypes";

export const leetCompletionCard = (req: Request, data: LeetUserCompletion): string => {
    const theme = baseCardThemeParse(req);

    const {
        // Theme variables
        ring,
        score,
        stats,
        textMain,
        textSub,
        // Card variables
        title,
    } = req.query;
        
    if (ring !== undefined) {
        theme.detailMain = ring as string;
    }
    if (score !== undefined) {
        theme.statsMain = score as string;
    }
    if (stats !== undefined) {
        theme.statsSub = stats as string;
    }
    if (textMain !== undefined) {
        theme.textMain = textMain as string;
    }
    if (textSub !== undefined) {
        theme.textSub = textSub as string;
    }


    if (title != undefined) {
        data.title = title as string;
    } else {
        data.title = `${req.params.username!.length < 10 ? `${req.params.username}'s` : "My"} Question Stats`
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate" viewBox="0 0 552 215" width="552px" height="215px" direction="ltr">
    <title id="titleId">${data.title}</title>
    <style>
        .stat {
            font: 400 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
            fill: ${theme.textSub};
        }
        .num{
            font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
            fill: ${theme.statsSub};
            text-align: center;
            letter-spacing: 1.5px;
        }
        .stagger {
            opacity: 0;
            animation: fadeInAnimation 0.3s ease-in-out forwards;
        }
        
        .acceptance-text {
            font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: ${theme.statsMain};
            animation: scaleInAnimation 0.3s ease-in-out forwards, fadeInAnimation 0.3s ease-in-out forwards;
        }
        
        .acceptance-title {
            font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
            fill: ${theme.textMain};
            animation: scaleInAnimation 0.3s ease-in-out forwards, fadeInAnimation 0.3s ease-in-out forwards;
        }

        .bold {
            font-weight: 700
        }
        
        .acceptance-circle-rim {
            stroke: ${theme.detailMain};
            fill: none;
            stroke-width: 6;
            opacity: 0.2;
        }
        
        .acceptance-circle {
            stroke: ${theme.detailMain};
            stroke-dasharray: calc(${parseInt(data.acceptance)} * (377 / 100)) 377;
            fill: none;
            stroke-width: 6;
            stroke-linecap: round;
            transform-origin: -10px 8px;
            animation: acceptanceAnimation 1s forwards ease-in-out;
        }
        
        /* Animations */
        @keyframes acceptanceAnimation {
            from {
                stroke-dashoffset: -200;
                transform: rotate(90deg);
            }
            to {
                stroke-dashoffset: 0;
                transform: rotate(-90deg);
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
        <clipPath id='outer_rectangle'>
            <rect width='552' height='215' rx='${theme.borderRadius}'/>
        </clipPath>
    </defs>

    <!-- Background -->
    <g style='isolation: isolate'>
            <rect stroke='${ theme.hideBorder ? theme.background : theme.border}' fill='${theme.background}' rx='${theme.borderRadius}' x="1.5" y="1.5" stroke-width="2" width="549" height="212"/>
    </g>

    <!-- Title -->
    <g>
        <text x="20.5" y="28" stroke-width="0" text-anchor="start" fill="${theme.textMain}" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadeInAnimation 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
            ${data.title}
        </text>
    </g>

    <g transform="translate(0, 55)">
    <!-- Acceptance -->
        <g transform="translate(460, 47.5)">
            <circle class="acceptance-circle-rim" cx="-10" cy="8" r="60" />
            <circle class="acceptance-circle" cx="-10" cy="8" r="60" />
            <text class="acceptance-text" x="0" y="0" alignment-baseline="central" dominant-baseline="central" text-anchor="middle">
                ${data.acceptance}% 
            </text>
            <text class="acceptance-title" x="0" y="20" alignment-baseline="central" dominant-baseline="central" text-anchor="middle"> 
                acceptance 
            </text>
        </g>

    <!-- Ranking -->
        <g transform="translate(0, 0)">
            <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)" >
            <text class="stat bold" y="12.5">
                Ranking:
            </text>
            <text class="num" text-anchor="middle" x="260" y="12.5">
                ${data.ranking.toLocaleString()}
            </text>
            </g>
        </g>
        <g transform="translate(0, 30)">
            <g class="stagger" style="animation-delay: 600ms" transform="translate(25, 0)">
            <text class="stat bold" y="12.5">
                Total Questions Solved:
            </text>
            <text class="all num" text-anchor="middle" x="235" y="12.5">
                ${data.all[0].toLocaleString()}
            </text>
            <text class="all stat" text-anchor="middle" x="260" y="12.5">
                /
            </text>
            <text class="all stat" text-anchor="middle" x="285" y="12.5">
                ${data.all[1].toLocaleString()}
            </text>
            </g>
        </g>

    <!-- Easy Questions -->
        <g transform="translate(0, 60)">
            <g class="stagger" style="animation-delay: 750ms" transform="translate(25, 0)">
            <text class="stat bold easy" y="12.5">
                Easy Questions Solved:
            </text>
            <text class="easy num" text-anchor="middle" x="235" y="12.5">
                ${data.easy[0]}
            </text>
            <text class="easy stat" text-anchor="middle" x="260" y="12.5">
                /
            </text>
            <text class="easy stat" text-anchor="middle" x="285" y="12.5">
                ${data.easy[1]}
            </text>
            </g>
        </g>

    <!-- Medium questions -->
        <g transform="translate(0, 90)">
            <g class="stagger" style="animation-delay: 900ms" transform="translate(25, 0)">
            <text class="stat bold medium" y="12.5">
                Medium Questions Solved:
            </text>
            <text class="med num" text-anchor="middle" x="235" y="12.5">
                ${data.medium[0].toLocaleString()}
            </text>
            <text class="med stat" text-anchor="middle" x="260" y="12.5">
                /
            </text>
            <text class="med stat" text-anchor="middle" x="285" y="12.5">
                ${data.medium[1].toLocaleString()}
            </text>
            </g>
        </g>

    <!-- Hard Questions -->
        <g transform="translate(0, 120)">
            <g class="stagger" style="animation-delay: 1050ms" transform="translate(25, 0)">
            <text class="stat bold hard" y="12.5">
                Hard Questions Solved:
            </text>
            <text class="hard num" text-anchor="middle" x="235" y="12.5">
                ${data.hard[0]}
            </text>
            <text class="hard stat" text-anchor="middle" x="260" y="12.5">
                /
            </text>
            <text class="hard stat" text-anchor="middle" x="285" y="12.5">
                ${data.hard[1]}
            </text>
            </g>
        </g>
    </g>
</svg>`;
}