import { Request } from "express";
import { baseCardThemeParse } from "../../utils/utils";
import { SUBMISSIONDATA } from "../leetcodeTypes";

export const recentCard = (req: Request, data: SUBMISSIONDATA) => {
    const { username } = req.params;
    const theme = baseCardThemeParse(req);

    const {
        // Theme variables
        stats,
        list,
        difficulty,
        language,
        textMain,
        textSub,
        dates,
        // Card variables
        title,
    } = req.query;

    if (stats !== undefined) {
        theme.detailMain = ("#" + stats) as string;
    }
    if (list !== undefined) {
        theme.detailSub = ("#" + list) as string;
    }
    if (difficulty !== undefined) {
        theme.statsMain = ("#" + difficulty) as string;
    }
    if (language !== undefined) {
        theme.statsSub = ("#" + language) as string;
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


    if (title != undefined) {
        data.title = title as string;
    } else {
        data.title = `${username}'s Recent Submissions`
    }



    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate" viewBox="0 0 552 340" width="552px" height="340px" direction="ltr">
    <title id="titleId">${data.title}</title>
    <style>
    .header {
        fill: ${theme.textMain}
        stroke: none;
        font-family: \'Segoe UI\', Ubuntu, sans-serif;
        font-weight: 400;
        font-size: 24px;
        font-style: normal;
        opacity: 0; 
        animation: fadein 0.5s linear forwards 0.7s; 
        letter-spacing: 4px; 
        text-shadow: 1px 1px 2px black;
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
    <!-- Title -->
    <g transform="translate(90,0)">
        <text x="120.5" y="28" stroke-width="0" text-anchor="middle" class="header">
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