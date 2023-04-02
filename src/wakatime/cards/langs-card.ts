import { Request } from "express";
import { THEMETYPE } from "../../utils/themes";
import { baseCardThemeParse } from "../../utils/utils";
import { LANGTYPE } from "../wakatimeTypes";

export const langsCardSetup = (req: Request, data: LANGTYPE): string => {
    const theme: THEMETYPE = baseCardThemeParse(req, data.theme);
    
    const {
        stats,
        pieBG,
        textMain,
        textSub,
        
        title
    } = req.query;

    if (stats !== undefined) {
        theme.statsMain = ("#" + stats) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSub !== undefined) {
        theme.textSub = ("#" + textSub) as string;
    }
    if (pieBG !== undefined) {
        theme.stroke = ("#" + pieBG) as string;
    }

    if (title !== undefined) {
        data.title = title as string
    } else {
        data.title = `${req.params.username!.length < 10 ? req.params.username! : "My"}'s Language Stats`
    }


    let pieOffset = 0.0;
    return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink' style='isolation: isolate' viewBox='0 0 552 215' width='552px' height='215px' direction='ltr' role="img">
        <title id="titleId">${data.title}</title>
        <style>
            .top-name {
                font: 600 18px "Segoe UI", Ubuntu, Sans-Serif;
                fill: ${theme.statsMain};
                letter-spacing: 4px;
            }
            .top-stat {
                font: 900 20px "Segoe UI", Ubuntu, Sans-Serif;
                fill: ${theme.statsMain};
                letter-spacing: 3px;
            }
            .lang-name {
                font: 400 16px "Segoe UI", Ubuntu, Sans-Serif;
                fill: ${theme.textSub};
                letter-spacing: 2px;
            }
            .lang-stat {
                font: 500 20px "Segoe UI", Ubuntu, Sans-Serif;
                fill: ${theme.statsSub};
                letter-spacing: 2px;
            }
            .stagger {
                opacity: 0;
                animation: fadeInAnimation 0.3s ease-in-out forwards;
            }
            #rect-mask rect{
                animation: slideInAnimation 1s ease-in-out forwards;
            }
            .lang-progress{
                animation: growWidthAnimation 0.6s ease-in-out forwards;
            }
            /* Animations */
            @keyframes slideInAnimation {
                from {
                    width: 0;
                }
                to {
                    width: calc(100%-100px);
                }
            }
            @keyframes growWidthAnimation {
                from {
                    width: 0;
                }
                to {
                    width: 100%;
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
            @keyframes rankAnimation {
                from {
                    stroke-dashoffset: 251.32741228718345;
                }
                to {
                    stroke-dashoffset: 106.04382276211012;
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
        <g clip-path="url(#outer_rectangle)">

        <!-- Background -->
            <g style="isolation: isolate">
                <rect stroke="${theme.hideBorder ? theme.background : theme.border}" fill="${theme.background}" rx="${theme.borderRadius}" x="1.5" y="1.5" width="549" height="212"  stroke-width="2"/>
            </g>

        <!-- Title -->
            <g>
                <text x="20.5" y="28" stroke-width="0" text-anchor="start" fill="${theme.textMain}" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadeInAnimation 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
                    ${data.title}dkjsafaasdkjfhdsajkf
                </text>
            </g>

        <!-- Top Language Used -->
            <g  transform="translate(40, 62)">
                <g class="stagger" style="animation-delay: 450ms">
                    <circle cx="0" cy="4" r="6" fill="${data.languages[0]!.color}" />
                    <text data-testid="lang-name" x="15" y="10" class="top-name">
                        ${data.languages[0]!.name}
                    </text>
                    <text data-testid="lang-name" x="180" y="10" class="top-stat">
                        ${data.languages[0]!.percent}%
                    </text>
                </g>
            </g>

        <!-- Other Language Used mapping -->
            <g transform="translate(40, 50)">
                <g transform="translate(0, 40)">
                    ${data.languages.slice(1, 6).map((lang, idx) => {
                        return `<g transform="translate(0, ${idx * 25})">
                            <g class="stagger" style="animation-delay: 450ms">
                                <circle cx="0" cy="4" r="6" fill="${lang.color}" />
                                <text data-testid="lang-name" x="15" y="10" class="lang-name">
                                    ${lang.name}
                                </text>
                                <text data-testid="lang-name" x="180" y="10" class="lang-stat">
                                    ${lang.percent}%
                                </text>
                            </g>
                        </g>`
                    })}
                </g>
                <!-- Percentage Chart -->
                <g data-testid="percentage-pie-chart"
                    transform="translate(380, 75)"
                >
                    <!-- Percentage Chart -->
                    <circle r="81" cx="0" cy="0" fill="${theme.stroke}"/>
                        ${data.languages.slice(0, 6).map(lang => {
                            let off = pieOffset;
                            pieOffset += lang.percent;
                            return `<circle r="40" cx="0" cy="0" 
                                fill="none"
                                stroke="${lang.color}"
                                stroke-width="80"
                                stroke-dasharray="calc(${lang.percent - .1} * (251 / 100)) 502.655"
                                transform="rotate(${off/100*360 + .5})"
                            />`
                        })}
                </g>
            </g>
        </g>
    </svg>`
}