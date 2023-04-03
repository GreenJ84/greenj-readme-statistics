/** @format */

import { Request } from "express";
import { baseCardThemeParse } from "../../utils/utils";
import { LANGTYPE } from "../githubTypes";

export const langsCardSetup = (req: Request, data: LANGTYPE): string => {
    const theme = baseCardThemeParse(req);
    
    const {
        stats,
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

    if (title !== undefined) {
        data.title = title as string
    } else {
        data.title = `${req.params.username!}'s Language Stats`
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink' style='isolation: isolate' viewBox='0 0 552 215' width='552px' height='215px' direction='ltr' role="img" aria-labelledby="descId">
        <title id="titleId">${ data.title }</title>
        <style>
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
            .lang-name {
                font: 400 16px "Segoe UI", Ubuntu, Sans-Serif;
                fill: ${ theme.textSub };
                letter-spacing: 2px;
            }
            .lang-stat {
                font: 500 20px "Segoe UI", Ubuntu, Sans-Serif;
                fill: ${ theme.statsMain };
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
        <g clip-path="url(#outer_rectangle)">
            <!-- Background -->
            <g style="isolation: isolate">
                <rect stroke="${ theme.hideBorder ? theme.background : theme.border }" fill="${ theme.background }" rx="${ theme.borderRadius }" x="1.5" y="1.5" stroke-width="2" width="549" height="212"/>
                <line x1="276" y1="80" x2="276" y2="202" vector-effect="non-scaling-stroke" stroke-width="1.5" stroke="${ theme.stroke }" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
            </g>
    
            <!-- Title -->
            <g transform="translate(90,0)">
                <text x="120.5" y="28" stroke-width="0" text-anchor="middle" fill="${theme.textMain}" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadeInAnimation 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
                    ${data.title}
                </text>
            </g>

            <g transform="translate(25, 55)">
                <mask id="rect-mask">
                    <rect x="0" y="0" width="500" height="15" fill="white" rx="5"/>
                </mask>
                ${data.languages.map((lang) => {
                    return `<rect
                        mask="url(#rect-mask)"
                        data-testid="lang-progress"
                        x="${lang.position}"
                        y="0"
                        width="${lang.width}"
                        height="15"
                        fill="${ lang.color}"
                    />`
                })}
                
                <g transform="translate(0, 40)">
                ${data.languages.slice(0,4).map((lang, idx) => { return `<g transform="translate(0, ${idx * 30})">
                        <g class="stagger" style="animation-delay: 450ms">
                            <circle cx="5" cy="6" r="5" fill="${ lang.color}" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ lang.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${( lang.usage)}%
                            </text>
                        </g>
                    </g>`
                })}

                <g transform="translate(270, 40)">
                ${data.languages.slice(4,8).map((lang, idx) => { return `<g transform="translate(0, ${(idx - 1) * 30 - 12.5})">
                    <g class="stagger" style="animation-delay: 450ms">
                        <circle cx="5" cy="6" r="5" fill="${ lang.color}" />
                        <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                            ${ lang.name }
                        </text>
                        <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                            ${( lang.usage)}%
                        </text>
                    </g>
                </g>`
                })}
                </g>
            </g>
        </g>
    </svg>`;
}