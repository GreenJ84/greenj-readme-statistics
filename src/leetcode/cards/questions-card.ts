import { Request } from "express";
import { QUESTIONDATA } from "../leetcodeTypes";

export const questionsCard = (req: Request, data: QUESTIONDATA): string => {
    const { username } = req.params;
    const theme = data.theme;
    const {
        // Theme variables
        background,
        border,
        hideBorder,
        borderRadius,
        stroke,
        detailMain,
        detailSub,
        statsMain,
        statsSub,
        textMain,
        textSub,
        dates,
        locale,
        // Card variables
        title,
    } = req.query;
        
    if (background !== undefined) {
        theme.background = ("#" + background) as string;
    }
    if (border !== undefined) {
        theme.border = ("#" + border) as string;
    }
    if (hideBorder !== undefined) {
        theme.hideBorder = true;
    } 
    if (borderRadius !== undefined) {
        theme.borderRadius = parseInt(borderRadius as string);
    }
    if (stroke !== undefined) {
        theme.stroke = ("#" + stroke) as string;
    }
    if (detailMain !== undefined) {
        theme.detailMain = ("#" + detailMain) as string;
    }
    if (detailSub !== undefined) {
        theme.detailSub = ("#" + detailSub) as string;
    }
    if (statsMain !== undefined) {
        theme.statsMain = ("#" + statsMain) as string;
    }
    if (statsSub !== undefined) {
        theme.statsSub = ("#" + statsSub) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSub !== undefined) {
        theme.textSub = ("#" + textSub) as string;
    }
    if (dates !== undefined) {
        theme.dates = ("#" + dates) as string;
    }
    if (locale !== undefined) {
        theme.locale = locale as string;
    }


    if (title != undefined) {
        data.title = title as string;
    } else {
        data.title = `${username}'s Question Stats`
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate" viewBox="0 0 552 215" width="552px" height="215px" direction="ltr">
    <style>
        <title id="titleId">${username}'s LeetCode Question Stats</title>
        .header {
            font: 700 22px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: ${theme.textMain};
            animation: fadeInAnimation 0.8s ease-in-out forwards;
        }
        .stat {
            font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
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
        fill: ${theme.textMain};
        animation: scaleInAnimation 0.3s ease-in-out forwards;
    }
    
    .acceptance-title {
        font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
        fill: ${theme.textSub};
        animation: scaleInAnimation 0.3s ease-in-out forwards;
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
        stroke-dasharray: 377;
        fill: none;
        stroke-width: 6;
        stroke-linecap: round;
        opacity: 0.8;
        transform-origin: -10px 8px;
        transform: rotate(-90deg);
        animation: acceptanceAnimation 1s forwards ease-in-out;
    }
    
    @keyframes acceptanceAnimation {
        from {
        stroke-dashoffset: 377;
        }
        to {
        stroke-dashoffset: 129.16020000000003;
        }
    }
    /* Animations */
    
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
    <g style='isolation: isolate'>
            <rect stroke='${ theme.hideBorder ? theme.background : theme.border}' fill='${theme.background}' rx='${theme.borderRadius}' x='0.5' y='0.5' width='551' height='214'/>
    </g>
    <g transform="translate(25, 35)">
        <g transform="translate(0, 0)">
            <text x="0" y="0" class="header">
                ${data.title}
            </text>
        </g>
    </g>

    <g transform="translate(0, 55)">
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
        <g transform="translate(0, 0)">
            <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)" >
            <text class="stat bold" y="12.5">
                Ranking:
            </text>
            <text class="num" text-anchor="middle" x="260" y="12.5">
                ${data.ranking}
            </text>
            </g>
        </g>
        <g transform="translate(0, 30)">
            <g class="stagger" style="animation-delay: 600ms" transform="translate(25, 0)">
            <text class="stat bold" y="12.5">
                Total Questions Solved:
            </text>
            <text class="all num" text-anchor="middle" x="235" y="12.5">
                ${data.all[0]}
            </text>
            <text class="all stat" text-anchor="middle" x="260" y="12.5">
                /
            </text>
            <text class="all stat" text-anchor="middle" x="285" y="12.5">
                ${data.all[1]}
            </text>
            </g>
        </g>

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

        <g transform="translate(0, 90)">
            <g class="stagger" style="animation-delay: 900ms" transform="translate(25, 0)">
            <text class="stat bold medium" y="12.5">
                Medium Questions Solved:
            </text>
            <text class="med num" text-anchor="middle" x="235" y="12.5">
                ${data.medium[0]}
            </text>
            <text class="med stat" text-anchor="middle" x="260" y="12.5">
                /
            </text>
            <text class="med stat" text-anchor="middle" x="285" y="12.5">
                ${data.medium[1]}
            </text>
            </g>
        </g>

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