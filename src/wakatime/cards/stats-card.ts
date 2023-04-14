/** @format */

import { Request } from "express";
import { ThemeType } from "../../utils/themes";
import { baseCardThemeParse, getFormatDate } from "../../utils/utils";
import { WakaStat } from "../wakatimeTypes";

export const wakaStatsCard = (req: Request, data: WakaStat): string => {
  const theme: ThemeType = baseCardThemeParse(req);

  const {
    ring,
    fire,
    stroke,
    dayAvg,
    sideStat,
    textMain,
    textSub,
    dates,

    title,
  } = req.query;
  if (ring !== undefined) {
    theme.detailSub = ring as string;
  }
  if (fire !== undefined) {
    theme.detailMain = fire as string;
  }
  if (stroke !== undefined) {
    theme.stroke = stroke as string;
  }
  if (dayAvg !== undefined) {
    theme.statsMain = dayAvg as string;
  }
  if (sideStat !== undefined) {
    theme.statsSub = sideStat as string;
  }
  if (textMain !== undefined) {
    theme.textMain = textMain as string;
  }
  if (textSub !== undefined) {
    theme.textSub = textSub as string;
  }
  if (dates !== undefined) {
    theme.dates = dates as string;
  }

  if (title !== undefined) {
    data.title = title as string;
  } else {
    data.title = `${
      req.params.username!.length < 10 ? `${req.params.username!}'s` : "My"
    } WakaTime Stats`;
  }

  return `<!-- WakaTime Stats SVG -->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation: isolate" viewBox="0 0 552 215" width="552px" height="215px" direction="ltr">
        <style>
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
            <clipPath id="outer_rectangle">
                <rect width="552" height="215" rx="${theme.borderRadius}"/>
            </clipPath>
        </defs>
        <g clip-path="url(#outer_rectangle)">

        <!-- Modal Background -->
            <g style="isolation: isolate">
                <rect stroke="${
                  theme.hideBorder ? theme.background : theme.border
                }" fill="${theme.background}" rx="${
    theme.borderRadius
  }" x="1.5" y="1.5" stroke-width="2" width="549" height="212"/>
            </g>
            
        <!-- Seperator Strokes -->
            <g style="isolation: isolate">
                <line x1="368" y1="48" x2="368" y2="196" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${
                  theme.stroke
                }" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
                <line x1="184" y1="48" x2="184" y2="196" vector-effect="non-scaling-stroke" stroke-width="1" stroke="${
                  theme.stroke
                }" stroke-linejoin="miter" stroke-linecap="square" stroke-miterlimit="3"/>
            </g>

        <!-- Title -->
        <g>
            <text x="20.5" y="28" stroke-width="0" text-anchor="start" fill="${
              theme.textMain
            }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
                ${data.title}
            </text>
        </g>

        <!-- Left Side -->
            <g style="isolation: isolate">

                <!-- Best Day Total Hours -->
                <g transform="translate(1,48)">
                    <text x="92" y="50" stroke-width="0" text-anchor="middle" fill="${
                      theme.statsSub
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="700" font-size="30px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.6s">
                        ${data.totalBest} hrs 
                    </text>
                </g>

                <!-- Best Day Label -->
                <g transform="translate(1,84)">
                    <text x="92" y="55" stroke-width="0" text-anchor="middle" fill="${
                      theme.textSub
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="14px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.7s">
                        Best Day
                    </text>
                </g>

                <!-- Best Day date -->
                <g transform="translate(1,114)">
                    <text x="92" y="50" stroke-width="0" text-anchor="middle" fill="${
                      theme.dates
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="12px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.8s">
                        ${getFormatDate(data.bestDate, theme.locale!)}
                    </text>
                </g>
            </g>
        
        <!-- Middle -->
            <g style="isolation: isolate">

                <!-- Daily Average Coding Hours -->
                <g transform="translate(0,48)">
                    <text x="276" y="66" stroke-width="0" text-anchor="middle" fill="${
                      theme.statsMain
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="700" font-size="46px" font-style="normal" style="animation: currstreak 0.6s linear forwards">
                        ${data.dailyAvg}
                    </text>
                </g>

                <!-- Daily Average Label -->
                <g transform="translate(0,108)">
                    <text x="276" y="60" stroke-width="0" text-anchor="middle" fill="${
                      theme.textMain
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="700" font-size="18px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.9s">
                        Daily Average (hrs)
                    </text>
                </g>

                <!-- Todal Days using Wakatime -->
                <g transform="translate(0,145)">
                    <text x="276" y="46" stroke-width="0" text-anchor="middle" fill="${
                      theme.dates
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="12px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 0.9s">
                        ${data.totalDevDays} active Waka days
                    </text>
                </g>
            <!-- Main Stat Details -->

                <!-- Ring around number -->
                <g>
                    <circle cx="276" cy="102" r="38" fill="none" stroke="${
                      theme.detailSub
                    }" stroke-width="5" style="opacity: 0; animation: fadein 0.5s linear forwards 0.4s">
                    </circle>
                </g>

                <!-- Fire background cutout -->
                <g>
                    <circle cx="276" cy="56" r="20" fill="${theme.background}"
                    stroke="none" stroke-width="5" style="opacity: 0; animation: fadein 0.5s linear forwards 0.4s">
                    </circle>
                </g>

                <!-- Fire icon -->
                <g stroke-opacity="0" style="opacity: 0; animation: fadein 0.5s linear forwards 0.6s" transform="translate(-21, 22) scale(1.2)">
                    <path d=" M 235.5 19.5 L 259.5 19.5 L 259.5 43.5 L 235.5 43.5 L 235.5 19.5 Z " fill="none"/>
                    <path d=" M 249 20.17 C 249 20.17 249.74 22.82 249.74 24.97 C 249.74 27.03 248.39 28.7 246.33 28.7 C 244.26 28.7 242.7 27.03 242.7 24.97 L 242.73 24.61 C 240.71 27.01 239.5 30.12 239.5 33.5 C 239.5 37.92 243.08 41.5 247.5 41.5 C 251.92 41.5 255.5 37.92 255.5 33.5 C 255.5 28.11 252.91 23.3 249 20.17 Z  M 247.21 38.5 C 245.43 38.5 243.99 37.1 243.99 35.36 C 243.99 33.74 245.04 32.6 246.8 32.24 C 248.57 31.88 250.4 31.03 251.42 29.66 C 251.81 30.95 252.01 32.31 252.01 33.7 C 252.01 36.35 249.86 38.5 247.21 38.5 Z " fill="${
                      theme.detailMain
                    }" stroke-opacity="0"/>
                </g>
            </g>

        <!-- Right Side -->
            <g style="isolation: isolate">

                <!-- Total Development Hours -->
                <g transform="translate(0,48)">
                    <text x="460" y="50" stroke-width="0" text-anchor="middle" fill="${
                      theme.statsSub
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="700" font-size="32px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 1.2s">
                        ${data.totalDevSec} hrs
                    </text>
                </g>

                <!-- Total Development Label -->
                <g transform="translate(0,84)">
                    <text x="460" y="55" stroke-width="0" text-anchor="middle" fill="${
                      theme.textSub
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="14px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 1.3s">
                        Total Development
                    </text>
                </g>
                <!-- Total Development Range -->
                <g transform="translate(0,114)">
                    <text x="460" y="50" stroke-width="0" text-anchor="middle" fill="${
                      theme.dates
                    }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="12px" font-style="normal" style="opacity: 0; animation: fadein 0.5s linear forwards 1.4s">
                        ${getFormatDate(
                          data.accountStart,
                          theme.locale!
                        )} - Present
                    </text>
                </g>
            </g>
        </g>
    </svg>`;
};
