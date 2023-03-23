import { Request } from "express";
import { SUBMISSIONDATA } from "../leetcodeTypes";

export const recentCard = (req: Request, data: SUBMISSIONDATA) => {
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
        data.title = `${username}'s Recent Submissions`
    }



    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate" viewBox="0 0 552 340" width="552px" height="340px" direction="ltr">
    <title id="titleId">${username}'s Recent LeetCode Submissions </title>
    <style>
    .header {
        font: 700 22px 'Segoe UI', Ubuntu, Sans-Serif;
        fill: ${theme.textMain};
        animation: fadeInAnimation 0.8s ease-in-out forwards;
    }
    
    .question {
        font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
        fill: ${theme.textSub};
        letter-spacing: 1.1px;
    }
    .langs {
        font: 400 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
        fill: ${theme.statsMain};
    }
    
    .stagger {
        opacity: 0;
        animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .bold {
        font-weight: 700
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
            <rect width='552' height='340' rx='${theme.borderRadius}'/>
        </clipPath>
    </defs>
    <g style='isolation: isolate'>
            <rect stroke='${theme.hideBorder ? theme.background : theme.border}' fill='${theme.background}' rx='${theme.borderRadius}' x='0.5' y='0.5' width='551' height='339'/>
    </g>
    <g transform="translate(25, 35)">
        <g transform="translate(0, 0)">
            <text x="0" y="0" class="header">
                ${data.title}
            </text>
        </g>
    </g>

    <g transform="translate(0, 55)">
    ${data.recentSubmissionList.map((submission, idx) => { 
        return `<g transform="translate(0, ${47 * idx})">
            <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)" >
                <text class="question bold" y="12.5">
                    ${submission.title}:
                </text>
                <text class="langs" x="30" y="32">
                    - Completed in: ${submission.lang.charAt(0).toUpperCase()+submission.lang.substring(1)}
                </text>
            </g>
        </g>`})}
    </g>
</svg>`;
}