/** @format */

import { Request } from "express";
import { ThemeType } from "../../utils/themes";
import { baseCardThemeParse } from "../../utils/utils";
import { WakaInsight } from "../wakatimeTypes";

export const wakaInsightCard = (req: Request, data: WakaInsight): string => {
  const theme: ThemeType = baseCardThemeParse(req);

  const {
    icons,
    logo,
    stats,
    textMain,
    textSub,
    stroke,

    title,
  } = req.query;

  if (icons !== undefined) {
    theme.detailSub = icons as string;
  }
  if (logo !== undefined) {
    theme.detailMain = logo as string;
  }
  if (stats !== undefined) {
    theme.statsMain = stats as string;
  }
  if (textMain !== undefined) {
    theme.textMain = textMain as string;
  }
  if (textSub !== undefined) {
    theme.textSub = textSub as string;
  }
  if (stroke !== undefined) {
    theme.stroke = stroke as string;
  }

  if (title != undefined) {
    data.title = title as string;
  } else {
    data.title = `${
      req.params.username!.length < 10 ? `${req.params.username!}'s` : "My"
    } WakaTime Insights`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink' style='isolation: isolate' viewBox='0 0 552 215' width='552px' height='215px' direction='ltr' role="img">
    <title id="titleId">${data.title}</title>
    <style>
        .statText {
            font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
            fill: ${theme.textSub};
            letter-spacing: 1.1px;
        }
        .stat {
            font: 600 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
            fill: ${theme.statsMain};
            letter-spacing: 1.1px;
        }
        @supports(-moz-appearance: auto) {
        /* Selector detects Firefox */
            .stat { font-size:12px; }
            .statText { font-size:12px; }
        }
        .stagger {
            opacity: 0;
            animation: fadeInAnimation 0.3s ease-in-out forwards;
        }
        .not_bold { font-weight: 400 }
        .bold { font-weight: 700 }
        .icon, .st0 {
            fill: ${theme.detailSub};
            display: block;
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
        <clipPath id="outer_rectangle">
            <rect width="552" height="215" rx="10"/>
        </clipPath>
    </defs>
    <g clip-path="url(#outer_rectangle)">

    <!-- Background -->
        <g style="isolation: isolate">
            <rect stroke="${
              theme.hideBorder ? theme.background : theme.border
            }" fill="${theme.background}" rx="${
    theme.borderRadius
  }" x="1.5" y="1.5" stroke-width="2" width="549" height="212"/>
        </g>

    <!-- Title -->
        <g>
            <text x="20.5" y="28" stroke-width="0" text-anchor="start" fill="${
              theme.textMain
            }" stroke="none" font-family="\'Segoe UI\', Ubuntu, sans-serif" font-weight="400" font-size="24px" font-style="normal" style="opacity: 0; animation: fadeInAnimation 0.5s linear forwards 0.7s; letter-spacing: 4px; text-shadow: 1px 1px 2px black;">
                ${data.title}
            </text>
        </g>

    <!-- WakaTime Logo -->
        <g transform="translate(390.5, 50)">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M75 8.823c-36.552 0 -66.177 29.625 -66.177 66.177s29.625 66.177 66.177 66.177 66.177 -29.625 66.177 -66.177 -29.625 -66.177 -66.177 -66.177Z" stroke="${
                  theme.detailMain
                }" stroke-width="17.647058823529413"/>
                <path d="M83.907 94.209a3.339 3.339 0 0 1 -2.661 1.377 3.639 3.639 0 0 1 -0.684 -0.075 3.573 3.573 0 0 1 -0.609 -0.207 4.518 4.518 0 0 1 -0.291 -0.15 3.459 3.459 0 0 1 -0.45 -0.309 3.882 3.882 0 0 1 -0.225 -0.198 4.152 4.152 0 0 1 -0.309 -0.336 3.975 3.975 0 0 1 -0.393 -0.6l-3.9 -6.261 -3.9 6.261a3.441 3.441 0 0 1 -2.991 1.875 3.402 3.402 0 0 1 -2.982 -1.902L47.466 68.85a3.993 3.993 0 0 1 -0.909 -2.559c0 -2.091 1.539 -3.789 3.432 -3.789 1.227 0 2.307 0.711 2.907 1.782l14.391 21.261 4.05 -6.591a3.411 3.411 0 0 1 3.018 -1.977c1.191 0 2.241 0.666 2.859 1.689l4.182 6.852 22.575 -32.316a3.348 3.348 0 0 1 2.877 -1.725c1.893 0 3.432 1.698 3.432 3.789a4.032 4.032 0 0 1 -0.777 2.409l-25.614 36.543Z" fill="${
                  theme.detailMain
                }" stroke="${
    theme.detailMain
  }" stroke-width="4.411764705882353"/>
            </svg>
        </g>

    <!-- Top Language -->
        <g transform="translate(0, 60)">
            <g class="stagger" style="animation-delay: 450ms" transform="translate(15, 0)">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 18 18" style="enable-background:new 0 0 412.996 412.996;" xml:space="preserve">
                    <path class="st0" d="M17.128 1.235H0.872c-0.481 0 -0.872 0.39 -0.872 0.872v10.199c0 0.481 0.39 0.872 0.872 0.872h6.08v1.975h-2.366c-0.445 0 -0.806 0.362 -0.806 0.806s0.362 0.806 0.806 0.806h8.829c0.445 0 0.806 -0.362 0.806 -0.806s-0.362 -0.806 -0.806 -0.806h-2.366v-1.975h6.08c0.481 0 0.872 -0.39 0.872 -0.872v-10.199c0 -0.481 -0.39 -0.872 -0.872 -0.872zm-0.436 10.634H1.308v-9.327h15.385v9.327z"/>
                    <path class="st0" d="m4.123 7.699 2.749 1.279a0.532 0.532 0 0 0 0.225 0.05c0.102 0 0.201 -0.029 0.288 -0.084a0.532 0.532 0 0 0 0.247 -0.45v-0.014c0 -0.207 -0.121 -0.397 -0.309 -0.485l-1.72 -0.799 1.72 -0.799a0.536 0.536 0 0 0 0.309 -0.485v-0.014c0 -0.184 -0.092 -0.352 -0.247 -0.45a0.533 0.533 0 0 0 -0.288 -0.084c-0.077 0 -0.155 0.017 -0.225 0.049L4.123 6.691a0.536 0.536 0 0 0 -0.309 0.485v0.038c0 0.207 0.121 0.397 0.309 0.485z"/>
                    <path class="st0" d="M7.656 10.303a0.536 0.536 0 0 0 0.432 0.219h0.014a0.533 0.533 0 0 0 0.509 -0.371l1.811 -5.612a0.536 0.536 0 0 0 -0.077 -0.478 0.536 0.536 0 0 0 -0.432 -0.219h-0.014a0.533 0.533 0 0 0 -0.509 0.371L7.578 9.825a0.537 0.537 0 0 0 0.078 0.478z"/>
                    <path class="st0" d="M10.368 5.911c0 0.207 0.121 0.397 0.309 0.485l1.72 0.799 -1.72 0.799a0.536 0.536 0 0 0 -0.309 0.485v0.014c0 0.183 0.092 0.352 0.247 0.45a0.534 0.534 0 0 0 0.287 0.084c0.078 0 0.154 -0.017 0.225 -0.05l2.749 -1.279c0.188 -0.088 0.309 -0.278 0.309 -0.484v-0.038c0 -0.207 -0.121 -0.397 -0.309 -0.485l-2.749 -1.278a0.537 0.537 0 0 0 -0.225 -0.049 0.534 0.534 0 0 0 -0.288 0.083 0.532 0.532 0 0 0 -0.247 0.451v0.014z"/>
                </svg>
                <text class="statText bold" x="25" y="12.5">
                    Top Language:
                </text>
                <text
                    class="stat bold"
                    x="170"
                    y="12.5"
                    data-testid="language"
                >
                    ${
                      data.topLanguage.name
                    } (${data.topLanguage.percent.toFixed(1)}%)
                </text>
            </g>
        </g>

    <!-- Daily Average -->
        <g transform="translate(0, 85)">
            <g class="stagger" style="animation-delay: 600ms" transform="translate(15, 0)">
                <svg height="18px" width="18px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 11.52 11.52" xml:space="preserve">
                    <path class="st0" d="M5.869 1.149C4.744 1.985 2.084 4.4 0.089 4.4c-0.131 0 -0.078 0.095 -0.078 0.095l1.743 0.728 -1.06 1.05v1.736l5.651 2.362L11.52 5.247v-1.736L5.869 1.149zM1.541 4.6c0.599 -0.224 1.201 -0.555 1.779 -0.927 0.144 -0.093 0.287 -0.189 0.427 -0.286 0.031 -0.021 0.062 -0.042 0.092 -0.064a20.827 20.827 0 0 0 0.403 -0.288c0.015 -0.011 0.03 -0.022 0.045 -0.034 0.128 -0.094 0.253 -0.188 0.375 -0.282 0.017 -0.013 0.033 -0.025 0.049 -0.038 0.135 -0.104 0.266 -0.206 0.394 -0.306l4.603 1.924c-1.213 0.924 -2.773 1.968 -3.969 1.968 -0.085 0 -0.169 -0.006 -0.248 -0.017l-2.865 -1.197 -0.493 -0.206 -0.593 -0.248zm0.706 0.83L5.356 6.729c0.125 0.022 0.253 0.032 0.384 0.032 1.251 0 2.764 -0.95 3.995 -1.864L6.201 8.397 1.314 6.354l0.934 -0.925zm8.778 -0.389L6.23 9.788l-5.043 -2.108v-0.411l5.075 2.121L11.026 4.675v0.366zm0 -0.658L6.215 9.146l-5.027 -2.101v-0.438l5.078 2.122L11.026 4.017v0.365z"/>
                    <path class="st0" d="M4.712 5.264c0.018 0.009 0.042 0.006 0.061 -0.007l0.459 -0.206a0.848 0.848 0 0 0 0.149 -0.086l1.478 -1.069c0.018 -0.013 0.018 -0.028 0 -0.037l-0.337 -0.167c-0.021 -0.011 -0.045 -0.015 -0.072 -0.014l-0.592 0.009c-0.027 0.001 -0.045 0.007 -0.063 0.02l-0.376 0.272c-0.024 0.018 -0.015 0.029 0.015 0.03l0.549 -0.001 0.006 0.003 -1.036 0.75 -0.6 0.287c-0.018 0.013 -0.018 0.028 0 0.037l0.361 0.179z"/>
                </svg>
                <text class="statText bold" x="25" y="12.5">
                    Daily Average:
                </text>
                <text
                    class="stat bold"
                    x="170"
                    y="12.5"
                    data-testid="daily_average"
                >
                    ${data.dailyAverage} hrs
                </text>
            </g>
        </g>

    <!-- Top Project -->
        <g transform="translate(0, 110)">
            <g class="stagger" style="animation-delay: 750ms" transform="translate(15, 0)">
                <svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path class="st0" d="M4.922 13.219h1.406c0.077 0 0.141 -0.063 0.141 -0.141V4.922c0 -0.077 -0.063 -0.141 -0.141 -0.141h-1.406c-0.077 0 -0.141 0.063 -0.141 0.141v8.156c0 0.077 0.063 0.141 0.141 0.141zm3.375 -4.922h1.406c0.077 0 0.141 -0.063 0.141 -0.141V4.922c0 -0.077 -0.063 -0.141 -0.141 -0.141h-1.406c-0.077 0 -0.141 0.063 -0.141 0.141v3.234c0 0.077 0.063 0.141 0.141 0.141zm3.375 1.266h1.406c0.077 0 0.141 -0.063 0.141 -0.141V4.922c0 -0.077 -0.063 -0.141 -0.141 -0.141h-1.406c-0.077 0 -0.141 0.063 -0.141 0.141v4.5c0 0.077 0.063 0.141 0.141 0.141zm3.797 -7.594H2.531c-0.311 0 -0.563 0.251 -0.563 0.563v12.938c0 0.311 0.251 0.563 0.563 0.563h12.938c0.311 0 0.563 -0.251 0.563 -0.563V2.531c0 -0.311 -0.251 -0.563 -0.563 -0.563zm-0.703 12.797H3.234V3.234h11.531v11.531z"/>
                </svg>
                <text class="statText bold" x="25" y="12.5">
                    Top Project:
                </text>
                <text
                    class="stat bold"
                    x="170"
                    y="12.5"
                    data-testid="project"
                >
                    ${data.topProject.name}
                </text>
            </g>
        </g>

    <!-- Top Category -->
        <g transform="translate(0, 135)">
            <g class="stagger" style="animation-delay: 900ms" transform="translate(15, 0)">
                <svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path class="st0" d="M7.5 2.25H3a0.75 0.75 0 0 0 -0.75 0.75v4.5a0.75 0.75 0 0 0 0.75 0.75h4.5a0.75 0.75 0 0 0 0.75 -0.75V3a0.75 0.75 0 0 0 -0.75 -0.75zM6.75 6.75H3.75V3.75h3v3zm8.25 3h-4.5a0.75 0.75 0 0 0 -0.75 0.75v4.5a0.75 0.75 0 0 0 0.75 0.75h4.5a0.75 0.75 0 0 0 0.75 -0.75v-4.5a0.75 0.75 0 0 0 -0.75 -0.75zm-0.75 4.5h-3v-3h3v3zM12.75 2.25c-1.655 0 -3 1.345 -3 3s1.345 3 3 3 3 -1.345 3 -3 -1.345 -3 -3 -3zm0 4.5c-0.827 0 -1.5 -0.673 -1.5 -1.5s0.673 -1.5 1.5 -1.5 1.5 0.673 1.5 1.5 -0.673 1.5 -1.5 1.5zM5.25 9.75c-1.655 0 -3 1.345 -3 3s1.345 3 3 3 3 -1.345 3 -3 -1.345 -3 -3 -3zm0 4.5c-0.827 0 -1.5 -0.673 -1.5 -1.5s0.673 -1.5 1.5 -1.5 1.5 0.673 1.5 1.5 -0.673 1.5 -1.5 1.5z"/>
                </svg>
                <text class="statText bold" x="25" y="12.5">
                    Top Category:
                </text>
                <text
                    class="stat bold"
                    x="170"
                    y="12.5"
                    data-testid="category"
                >
                    ${data.topCategory.name}(${data.topCategory.percent.toFixed(
    1
  )}%)
                </text>
            </g>
        </g>

    <!-- Top Editor -->
        <g transform="translate(0, 160)">
            <g class="stagger" style="animation-delay: 1050ms" transform="translate(15, 0)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="${
                  theme.detailSub
                }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path fill="none" d="M8.25 3H3a1.5 1.5 0 0 0 -1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5 -1.5v-5.25"/>
                    <path fill="none" d="M13.875 1.875a1.591 1.591 0 0 1 2.25 2.25L9 11.25l-3 0.75 0.75 -3 7.125 -7.125z"/>
                </svg>
                <text class="statText bold" x="25" y="12.5">
                    Top Editor:
                </text>
                <text
                    class="stat bold"
                    x="170"
                    y="12.5"
                    data-testid="editor"
                >
                    ${data.topEditor.name} (${data.topEditor.percent.toFixed(
    1
  )}%)
                </text>
            </g>
        </g>

    <!-- Top OS -->
        <g transform="translate(0, 185)">
            <g class="stagger" style="animation-delay: 1050ms" transform="translate(15, 0)">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="18px" height="16.945px" viewBox="0 0 18 16.945" enable-background="new 0 0 256 241" xml:space="preserve">
                    <path class="st0" d="M17.859 13.219V0.141H0.141v13.078h7.805v2.039H5.273v1.547h7.453v-1.547h-2.672v-2.039h7.805zM1.336 1.336h15.258v10.617H1.336V1.336zm4.296 4.38c0 0.97 0.454 1.835 1.163 2.391V10.688h3.246v-0.864h0.477c0.662 0 1.199 -0.537 1.199 -1.199v-0.851h0.407a0.245 0.245 0 0 0 0.245 -0.245c0 -0.036 -0.007 -0.066 -0.02 -0.096l-0.633 -1.666s-0.066 -0.662 -0.126 -0.918C11.325 3.709 10.053 2.672 8.672 2.672c-1.679 0 -3.041 1.361 -3.041 3.044zm4.995 0.315c0 -0.185 0.152 -0.338 0.341 -0.338 0.185 0 0.338 0.152 0.338 0.338 0 0.189 -0.152 0.341 -0.338 0.341a0.341 0.341 0 0 1 -0.341 -0.341zm-4.611 -0.354c0 -1.454 1.179 -2.63 2.63 -2.63 0.759 0 1.438 0.321 1.918 0.831 0 0 0.03 2.097 -2.348 2.15 -1.653 0 -1.53 1.401 -1.53 1.401 -0.414 -0.467 -0.669 -1.08 -0.669 -1.752z"/>
                </svg>
                <text class="statText bold" x="25" y="12.5">
                    Top OS:
                </text>
                <text
                    class="stat bold"
                    x="170"
                    y="12.5"
                    data-testid="os"
                >
                    ${data.topOS.name} (${data.topOS.percent.toFixed(1)}%)
                </text>
            </g>
        </g>
    </g>
</svg>
`;
};
