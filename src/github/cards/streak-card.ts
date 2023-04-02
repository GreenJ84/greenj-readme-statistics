/** @format */

import { Request } from "express";
import { baseCardThemeParse, getFormatDate } from "../../utils/utils";
import { STREAKTYPE } from "../githubTypes";

export const streakCardSetup = (req: Request, data: STREAKTYPE): string => {
  const theme = baseCardThemeParse(req);

  const {
    ring,
    fire,
    currStreak,
    statsSide,
    textMain,
    textSide,
    dates,

    title,
  } = req.query;
  if (ring !== undefined) {
    theme.detailMain = ("#" + ring) as string;
  }
  if (fire !== undefined) {
    theme.detailSub = ("#" + fire) as string;
  }
  if (currStreak !== undefined) {
    theme.statsMain = ("#" + currStreak) as string;
  }
  if (statsSide !== undefined) {
    theme.statsSub = ("#" + statsSide) as string;
  }
  if (textMain !== undefined) {
    theme.textMain = ("#" + textMain) as string;
  }
  if (textSide !== undefined) {
    theme.textSub = ("#" + textSide) as string;
  }
  if (dates !== undefined) {
    theme.dates = ("#" + dates) as string;
  }

  if (title !== undefined) {
    data.title = title as string;
  } else {
    data.title = `${req.params.username!.length < 10 ? `${req.params.username!}'s` : "My"} Commit Streak`;
  }

  function checkDate(date: string): string {
    if (new Date(date) == new Date()) {
      return "Present"
    }
    return getFormatDate(date, theme.locale!);
  }

  return `<!-- GitHub Streak SVG -->
    <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='isolation: isolate' viewBox='0 0 552 215' width='552px' height='215px' direction='ltr'>
        <style>
            .stat, .label, .date{
              stroke: none;
              font-family:"Segoe UI", Ubuntu, sans-serif;
              font-style: normal;
            }
            .stat{
              fill: ${theme.statsSub};
              font-weight: 700;
              font-size: 30px;
              opacity: 0; 
              animation: fadein 0.5s linear forwards 0.9s;
            }
            .label{
              fill: ${theme.statsMain};
              font-weight:700;
              font-size:14px;
              animation: fadein 0.6s linear forwards 0.6s;
            }
            .date{
              fill:${theme.dates};
              font-weight: 400;
              font-size: 12px;
              opacity: 0;
              animation: fadein 0.5s linear forwards 0.8s;
            }
            @keyframes currstreak {
                0% { font-size: 3px; opacity: 0.2; }
                80% { font-size: 44px; opacity: 1; }
                100% { font-size: 34px; opacity: 1; }
            }
            @keyframes fadein {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
        </style>
        <defs>
            <clipPath id='outer_rectangle'>
                <rect width='552' height='215' rx='${theme.borderRadius}'/>
            </clipPath>
        </defs>
        <g clip-path='url(#outer_rectangle)'>
        <!-- Background -->
            <g style='isolation: isolate'>
                <rect stroke='${theme.hideBorder ? "" : theme.border}' fill='${theme.background}' rx='${theme.borderRadius}' x="1.5" y="1.5" stroke-width="2" width="549" height="212"/>
            </g>
            <g style='isolation: isolate'>
        <!-- Seperators -->
                <line x1='368' y1='48' x2='368' y2='196' vector-effect='non-scaling-stroke' stroke-width='1' stroke='${theme.stroke}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
                <line x1='184' y1='48' x2='184' y2='196' vector-effect='non-scaling-stroke' stroke-width='1' stroke='${theme.stroke}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
            </g>

        <!-- Title -->
            <g>
                <text x="20.5" y="28" stroke-width="0" text-anchor="start" fill="${theme.textMain}" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
                    ${data.title}
                </text>
            </g>

          <!-- Left Side -->
            <g style='isolation: isolate'>
                <!-- Total Contributions Number -->
                <g transform='translate(1,48)'>
                    <text x='92' y='50' stroke-width='0' text-anchor='middle' class="stat">
                        ${data.total}
                    </text>
                </g>
                <!-- Total Contributions Label -->
                <g transform='translate(1,84)'>
                    <text x='92' y='55' stroke-width='0' text-anchor='middle' class="label">
                        ${data.totalText}
                    </text>
                </g>
                <!-- total contributions range -->
                <g transform='translate(1,114)'>
                    <text x='92' y='50' stroke-width='0' text-anchor='middle' class="date">
                        ${ getFormatDate(data.totalRange[0]!, theme.locale!)} - Present
                    </text>
                </g>
            </g>
          <!-- Middle -->
            <g style='isolation: isolate'>
                <!-- Current Streak Big Number -->
                <g transform='translate(0,48)'>
                    <text x='276' y='66' stroke-width='0' text-anchor='middle' class="stat">
                        ${data.curr}
                    </text>
                </g>
                <!-- Current Streak Label -->
                <g transform='translate(0,108)'>
                    <text x='276' y='60' stroke-width='0' text-anchor='middle' class="label">
                        ${data.currText}
                    </text>
                </g>
                <!-- Current Streak Range -->
                <g transform='translate(0,145)'>
                    <text x='276' y='46' stroke-width='0' text-anchor='middle' class="date">
                    ${checkDate(data.currDate[0]!)} - ${checkDate(data.currDate[1]!)}
                    </text>
                </g>

            <!-- Ring detail -->
                <!-- ring around number -->
                <g mask='url(#mask_out_ring_behind_fire)'>
                    <circle cx='276' cy='102' r='38' fill='none' stroke='${theme.detailMain}' stroke-width='4' style='opacity: 0; animation: fadein 0.5s linear forwards 0.4s'>
                    </circle>
                </g>
                <!-- Fire cutout -->
                <g>
                    <circle cx='276' cy='56' r='20' fill='${theme.background}' stroke='${theme.background}' stroke-width='5' style='opacity: 0; animation: fadein 0.5s linear forwards 0.4s'>
                    </circle>
                </g>
                <!-- fire icon -->
                <g stroke-opacity='0' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s' transform="translate(-21, 22) scale(1.2)">
                    <path d=' M 235.5 19.5 L 259.5 19.5 L 259.5 43.5 L 235.5 43.5 L 235.5 19.5 Z ' fill='none'/>
                    <path d=' M 249 20.17 C 249 20.17 249.74 22.82 249.74 24.97 C 249.74 27.03 248.39 28.7 246.33 28.7 C 244.26 28.7 242.7 27.03 242.7 24.97 L 242.73 24.61 C 240.71 27.01 239.5 30.12 239.5 33.5 C 239.5 37.92 243.08 41.5 247.5 41.5 C 251.92 41.5 255.5 37.92 255.5 33.5 C 255.5 28.11 252.91 23.3 249 20.17 Z  M 247.21 38.5 C 245.43 38.5 243.99 37.1 243.99 35.36 C 243.99 33.74 245.04 32.6 246.8 32.24 C 248.57 31.88 250.4 31.03 251.42 29.66 C 251.81 30.95 252.01 32.31 252.01 33.7 C 252.01 36.35 249.86 38.5 247.21 38.5 Z ' fill='${theme.detailSub}' stroke-opacity='0'/>
                </g>
            </g>

        <!-- Right Side -->
            <g style='isolation: isolate'>
                <!-- Longest Streak Big Number -->
                <g transform='translate(0,48)'>
                    <text x='460' y='50' stroke-width='0' text-anchor='middle' class="stat">
                        ${data.longest}
                    </text>
                </g>
                <!-- Longest Streak Label -->
                <g transform='translate(0,84)'>
                    <text x='460' y='55' stroke-width='0' text-anchor='middle' class="label">
                        ${data.longestText}
                    </text>
                </g>
                <!-- Longest Streak Range -->
                <g transform='translate(0,114)'>
                    <text x='460' y='50' stroke-width='0' text-anchor='middle' class="date">
                    ${checkDate(data.longestDate[0]!)} - ${checkDate(data.longestDate[1]!)}
                    </text>
                </g>
            </g>
        </g>
    </svg>`;
};
