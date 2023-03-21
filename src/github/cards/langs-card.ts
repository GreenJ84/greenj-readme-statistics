/** @format */

import { Request } from "express";
import { LANGTYPE } from "../githubTypes";

export const langsCardSetup = (req: Request, data: LANGTYPE): string => {
    const theme = data.theme;
    const {
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
    }

    const svgString: string = createStatsCard(data);
    return svgString;
};

const createStatsCard = (data: LANGTYPE): string => {
    const theme = data.theme;
    theme;
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
                fill: ${ theme.detailMain };
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
                <rect stroke="${ theme.hideBorder ? theme.background : theme.border }" fill="${ theme.background }" rx="${ theme.borderRadius }" x="0.5" y="0.5" width="552" height="215"/>
                <line x1="276" y1="80" x2="276" y2="202" vector-effect="non-scaling-stroke" stroke-width="1.5" stroke="${ theme.stroke }" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
            </g>
    
            <!-- Title -->
            <g transform="translate(0,0)">
                <text x="25" y="35" stroke-width="1" text-anchor="start" fill="${ theme.textMain }" stroke="${ theme.textMain }" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="500" font-size="24px" font-style="normal" style="opacity: 0; animation: fadeInAnimation 0.5s linear forwards 0.7s; letter-spacing: 2px;">
                    ${ data.title }
                </text>
            </g>
            <g transform="translate(25, 55)">
                <mask id="rect-mask">
                    <rect x="0" y="0" width="500" height="15" fill="white" rx="5"/>
                </mask>
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[0]!.position}"
                    y="0"
                    width="${data.languages[0]!.width}"
                    height="15"
                    fill="${ data.languages[0]!.color}"
                />
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[1]!.position}"
                    y="0"
                    width="${data.languages[1]!.width}"
                    height="15"
                    fill="${ data.languages[1]!.color}"
                />
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[2]!.position}"
                    y="0"
                    width="${data.languages[2]!.width}"
                    height="15"
                    fill="${ data.languages[2]!.color}"
                />
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[3]!.position}"
                    y="0"
                    width="${data.languages[3]!.width}"
                    height="15"
                    fill="${ data.languages[3]!.color}"
                />
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[4]!.position}"
                    y="0"
                    width="${data.languages[4]!.width}"
                    height="15"
                    fill="${ data.languages[4]!.color}"
                />
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[5]!.position}"
                    y="0"
                    width="${data.languages[5]!.width}"
                    height="15"
                    fill="${ data.languages[5]!.color}"
                />
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[6]!.position}"
                    y="0"
                    width="${data.languages[6]!.width}"
                    height="15"
                    fill="${ data.languages[6]!.color}"
                />
                <rect
                    mask="url(#rect-mask)"
                    data-testid="lang-progress"
                    x="${data.languages[7]!.position}"
                    y="0"
                    width="${data.languages[7]!.width}"
                    height="15"
                    fill="${ data.languages[7]!.color}"
                />
                
                <g transform="translate(0, 40)">
                    <g transform="translate(0, 0)">
                        <g class="stagger" style="animation-delay: 450ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[0]!.color}" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[0]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${( data.languages[0]!.usage)}%
                            </text>
                        </g>
                    </g>
    
                    <g transform="translate(0, 30)">
                        <g class="stagger" style="animation-delay: 600ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[1]!.color }" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[1]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${ (data.languages[1]!.usage) }%
                            </text>
                        </g>
                    </g>
    
                    <g transform="translate(0, 60)">
                        <g class="stagger" style="animation-delay: 750ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[2]!.color }" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[2]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${ (data.languages[2]!.usage)}%
                            </text>
                        </g>
                    </g>
    
                    <g transform="translate(0, 90)">
                        <g class="stagger" style="animation-delay: 900ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[3]!.color }" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[3]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${ (data.languages[3]!.usage) }%
                            </text>
                        </g>
                    </g>
                </g>
    
                <g transform="translate(270, 40)">
                    <g transform="translate(0, 0)">
                            <g class="stagger" style="animation-delay: 450ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[4]!.color }" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[4]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${ (data.languages[4]!.usage) }%
                            </text>
                        </g>
                    </g>
    
                    <g transform="translate(0, 30)">
                            <g class="stagger" style="animation-delay: 600ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[5]!.color }" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[5]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${ (data.languages[5]!.usage)}%
                            </text>
                        </g>
                    </g>
    
                    <g transform="translate(0, 60)">
                        <g class="stagger" style="animation-delay: 750ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[6]!.color }" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[6]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${ (data.languages[6]!.usage)}%
                            </text>
                        </g>
                    </g>
    
                    <g transform="translate(0, 90)">
                        <g class="stagger" style="animation-delay: 900ms">
                            <circle cx="5" cy="6" r="5" fill="${ data.languages[7]!.color }" />
                            <text data-testid="lang-name" x="15" y="10" class='lang-name'>
                                ${ data.languages[7]!.name }
                            </text>
                            <text data-testid="lang-name" x="140" y="10" class='lang-stat'>
                                ${ (data.languages[7]!.usage)}%
                            </text>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>`;
}