import { Request } from "express";
import { baseCardThemeParse } from "../../utils/utils";
import { SUBMISSIONDATA } from "../leetcodeTypes";

export const recentCard = (req: Request, data: SUBMISSIONDATA) => {
    const theme = baseCardThemeParse(req);

    const {
        // Theme variables
        question,
        sideStat,
        textMain,
        textSub,
        line,
        // Card variables
        title,
    } = req.query;

    if (question !== undefined) {
        theme.statsMain = ("#" + question) as string;
    }
    if (sideStat !== undefined) {
        theme.statsSub = ("#" + sideStat) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSub !== undefined) {
        theme.textSub = ("#" + textSub) as string;
    }
    if (line !== undefined) {
        theme.stroke = ("#" + line) as string;
    }


    if (title != undefined) {
        data.title = title as string;
    } else {
        data.title = `${req.params.username!.length < 10 ? `${req.params.username!}'s` : "My"} Most Recent`
    }



    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate" viewBox="0 0 452 340" width="452px" height="340px" direction="ltr">
    <title id="titleId">${data.title}</title>
    <style>
    .question {
        font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
        fill: ${theme.statsMain};
        letter-spacing: 1.1px;
    }
    .langText {
        font: 400 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
        fill: ${theme.textSub};
    }
    .langs {
        font: 400 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
        fill: ${theme.statsSub};
    }
    .stagger {
        opacity: 0;
        animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .bold {
        font-weight: 700
    }

    /* Animations */
    @keyframes acceptanceAnimation {
        from {
        stroke-dashoffset: 377;
        }
        to {
        stroke-dashoffset: 129.16020000000003;
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
            <rect width='452' height='340' rx='${theme.borderRadius}'/>
        </clipPath>
    </defs>
    <g style='isolation: isolate'>
            <rect stroke='${theme.hideBorder ? theme.background : theme.border}' fill='${theme.background}' rx='${theme.borderRadius}' x='1.5' y='1.5' width='449' height='337'/>
    </g>

    <!-- Title -->
    <g>
        <text x="20.5" y="28" stroke-width="0" text-anchor="start" fill="${theme.textMain}" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadeInAnimation 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
            ${data.title}
        </text>
    </g>

    <g transform="translate(0, 55)">
    ${data.recentSubmissionList.map((submission, idx) => {
        return `<g transform="translate(0, ${47 * idx})">
            ${idx !== 0 && `<line x1='25' y1='-5' x2='415' y2='-5' stroke-width='1' stroke='${theme.stroke}' />`}
            <g class="stagger" style="animation-delay: 450ms" transform="translate(25, 0)" >
                <text class="question bold" y="12.5">
                    ${submission.title.length < 48 ? submission.title : submission.title.slice(0, 48)}:
                </text>
                <text class="langText" x="30" y="32">
                    - Completed in:
                </text>
                <text class="langs" x="160" y="32">
                    ${submission.lang.charAt(0).toUpperCase()+submission.lang.substring(1)}
                </text>
            </g>
        </g>`})}
    </g>
</svg>`;
}