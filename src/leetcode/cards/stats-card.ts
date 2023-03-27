import { PROFILEDATA } from "../leetcodeTypes";
import { Request } from "express";
import { baseCardThemeParse } from "../../utils/utils";

export const statsCard = (req: Request, data: PROFILEDATA): string => {
    const { username } = req.params;
    const theme = data.theme;
    baseCardThemeParse(req, theme);

    const {
        // Theme variables
        ring,
        icons,
        score,
        stats,
        textMain,
        textSub,
        // Card variables
        title,
    } = req.query;

    if (ring !== undefined) {
        theme.detailMain = ("#" + ring) as string;
    }
    if (icons !== undefined) {
        theme.detailSub = ("#" + icons) as string;
    }
    if (score !== undefined) {
        theme.statsMain = ("#" + score) as string;
    }
    if (stats !== undefined) {
        theme.statsSub = ("#" + stats) as string;
    }
    if (textMain !== undefined) {
        theme.textMain = ("#" + textMain) as string;
    }
    if (textSub !== undefined) {
        theme.textSub = ("#" + textSub) as string;
    }



    if (title != undefined) {
        data.title = title as string;
    } else { data.title = `${username} Leetcode Stats` }


    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink='http://www.w3.org/1999/xlink' style='isolation: isolate' viewBox='0 0 552 215' width='552px' height='215px' direction='ltr' role="img" aria-labelledby="descId">
    <title id="titleId">${data.title}</title>
    <style>
        .statText {
            font: 500 16px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
            fill: ${theme.textSub};
            letter-spacing: 1.1px;
        }
        .stat {
            font: 600 20px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
            fill: ${theme.statsSub};
            letter-spacing: 1.1px;
        }
        @supports(-moz-appearance: auto) {
        /* Selector detects Firefox */
            .stat { font-size:12px; }
        }
      
        .stagger {
            opacity: 0;
            animation: fadeInAnimation 0.3s ease-in-out forwards;
        }
        .rank-text {
            font: 800 26px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.statsMain};
            animation: scaleInAnimation 0.3s ease-in-out forwards;
        }
        .not_bold { font-weight: 400 }
        .bold { font-weight: 700 }
        .icon {
            fill: ${theme.detailSub};
            display: block;
        }
        .st0{
            fill:none;
            stroke: ${theme.detailSub};
            stroke-width:2;
            stroke-linecap:round;
            stroke-linejoin:round;
            stroke-miterlimit:10;
        }

        .rank-circle-rim {
            stroke: ${theme.detailMain};
            fill: none;
            stroke-width: 10;
            opacity: 0.2;
        }
        .rank-circle {
            stroke: ${theme.detailMain};
            stroke-dasharray: 400;
            fill: none;
            stroke-width: 14;
            stroke-linecap: round;
            opacity: 0.8;
            transform-origin: -10px 8px;
            transform: rotate(-90deg);
            animation: rankAnimation 1s forwards ease-in-out;
        }
        
        /* Animations */
        @keyframes rankAnimation {
            from {
                stroke-dashoffset: 400;
            }
            to {
                stroke-dashoffset: ${Math.max(data.grade[1]*3/8, 10)};
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
        <clipPath id="outer_rectangle">
            <rect width="552" height="215" rx="10"/>
        </clipPath>
    </defs>
    <g clip-path="url(#outer_rectangle)">
        <!-- Background -->
        <g style="isolation: isolate">
            <rect stroke="${ theme.hideBorder ? theme.background : theme.border}" fill="${theme.background}" rx="${theme.borderRadius}" x="0.5" y="0.5" width="552" height="215"/>
        </g>

        <!-- Title -->
        <g transform="translate(0,0)">
            <text x="18" y="35" stroke-width="1" text-anchor="start" fill="${theme.textMain}" stroke="${theme.textMain}" font-family="Segoe UI, Ubuntu, sans-serif" font-weight="500" font-size="24px" font-style="normal" style="opacity: 0; animation: fadeInAnimation 0.5s linear forwards 0.7s; letter-spacing: 2px;">
                ${ data.title }
            </text>
        </g>
        <!-- Rank Circle -->
        <g 
            data-testid="rank-circle"
            transform="translate(460.5, 100)"
        >
            <circle class="rank-circle-rim" cx="-10" cy="8" r="55" />
            <circle class="rank-circle" cx="-10" cy="8" r="55" />
            <g class="rank-text">
                <text x="-5" y="3"
                alignment-baseline="central"
                dominant-baseline="central"
                text-anchor="middle"
                >
                    ${data.grade[0]}
                </text>
            </g>
        </g>
        <!-- Completion -->
        <g transform="translate(0, 60)">
            <g class="stagger" style="animation-delay: 600ms" transform="translate(15, 0)">
                <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                    <path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"/>
                </svg>
                <text class="statText bold" x="40" y="12.5">
                    Completion:
                </text>
                <text
                    class="stat bold"
                    x="260"
                    y="12.5"
                    data-testid="commits"
                >
                    ${ data.completion }%
                </text>
            </g>
        </g>
        <!-- Reputation -->
        <g transform="translate(0, 90)">
            <g class="stagger" style="animation-delay: 600ms" transform="translate(15, 0)">
                <svg data-testid="icon" class="icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="15px" viewBox="0 0 16 15" enable-background="new 0 0 256 240" xml:space="preserve">
                    <path d="M5.29 1.266c1.149 0 2.08 0.931 2.08 2.08s-0.931 2.08 -2.08 2.08 -2.08 -0.931 -2.08 -2.08 0.931 -2.08 2.08 -2.08zM1.938 9.063c0 -0.156 0.1 -0.262 0.262 -0.262s0.262 0.1 0.262 0.262v5.812h5.717v-5.812c0 -0.156 0.1 -0.262 0.262 -0.262 0.156 0 0.262 0.1 0.262 0.262v5.812h1.818V8.539c0 -1.433 -1.171 -2.599 -2.599 -2.599h-0.524l-1.528 2.376 -0.184 -1.779 0.251 -0.602H4.81l0.251 0.602 -0.195 1.79 -1.528 -2.387h-0.614C1.291 5.94 0.125 7.111 0.125 8.539v6.336h1.818v-5.812h-0.006zM15.832 1.433 14.42 0.157a0.12 0.12 0 0 0 -0.17 0.007l-0.42 0.465s-1.301 -0.295 -1.71 -0.382c-0.326 -0.066 -0.499 0.121 -0.538 0.284 -0.056 0.257 -0.219 0.957 -0.319 1.398 -0.042 0.191 0.062 0.389 0.25 0.444 0.205 0.062 0.413 -0.062 0.461 -0.267l0.132 -0.562s0.298 -0.239 0.742 0.187l1.8 1.8c0.08 0.083 0.08 0.215 0 0.295 -0.083 0.083 -0.215 0.083 -0.295 0l-0.673 -0.683c-0.052 -0.056 -0.146 -0.049 -0.191 0.017 -0.035 0.049 -0.024 0.118 0.017 0.16l0.683 0.694c0.083 0.083 0.083 0.226 0.004 0.305 -0.08 0.08 -0.208 0.08 -0.291 -0.004l-0.687 -0.69c-0.042 -0.045 -0.111 -0.056 -0.16 -0.021 -0.069 0.045 -0.076 0.135 -0.021 0.191 0 0 0.475 0.475 0.676 0.68 0.08 0.083 0.076 0.215 -0.007 0.291 -0.083 0.073 -0.208 0.073 -0.288 -0.007L12.745 4.087c-0.056 -0.056 -0.146 -0.049 -0.191 0.017 -0.035 0.049 -0.024 0.118 0.017 0.16l0.659 0.656c0.083 0.083 0.08 0.219 -0.003 0.298 -0.08 0.076 -0.212 0.076 -0.291 -0.004l-0.517 -0.513c0.007 -0.031 0.014 -0.066 0.014 -0.097a0.384 0.384 0 0 0 -0.385 -0.385c-0.031 0 -0.062 0.007 -0.094 0.01 0.007 -0.031 0.01 -0.059 0.01 -0.094a0.384 0.384 0 0 0 -0.385 -0.385c-0.031 0 -0.062 0.007 -0.094 0.01 0.007 -0.028 0.01 -0.056 0.01 -0.087a0.384 0.384 0 0 0 -0.385 -0.385c-0.028 0 -0.056 0.003 -0.08 0.007 0.007 -0.031 0.01 -0.059 0.01 -0.094a0.384 0.384 0 0 0 -0.385 -0.385c-0.038 0 -0.076 0.007 -0.111 0.017l-0.826 -0.822c-0.052 -0.052 -0.132 -0.049 -0.18 0.004 -0.045 0.052 -0.038 0.128 0.01 0.177l0.794 0.784c-0.121 0.121 -0.493 0.499 -0.499 0.506 -0.059 0.066 -0.087 0.156 -0.087 0.239 0 0.215 0.18 0.385 0.395 0.385 0.028 0 0.056 -0.003 0.08 -0.007a0.408 0.408 0 0 0 -0.01 0.094 0.384 0.384 0 0 0 0.385 0.385c0.031 0 0.062 -0.007 0.094 -0.01a0.349 0.349 0 0 0 -0.01 0.087 0.384 0.384 0 0 0 0.385 0.385c0.031 0 0.062 -0.007 0.094 -0.01 -0.007 0.031 -0.01 0.059 -0.01 0.094a0.384 0.384 0 0 0 0.385 0.385 0.383 0.383 0 0 0 0.309 -0.156l0.437 -0.441s0.354 0.357 0.475 0.475c0.25 0.239 0.552 0.104 0.645 0 0.08 -0.087 0.128 -0.191 0.132 -0.302 0.014 0.004 0.028 0.004 0.042 0.004 0.118 0 0.232 -0.042 0.323 -0.132 0.09 -0.094 0.135 -0.215 0.132 -0.337 0.003 0.004 0.184 0.021 0.333 -0.128a0.456 0.456 0 0 0 0.132 -0.347c0.007 0 0.187 0.014 0.337 -0.132 0.18 -0.173 0.17 -0.475 -0.007 -0.652l-0.34 -0.34c0.139 -0.049 0.385 -0.156 0.534 -0.375 0.049 -0.073 0.326 -0.499 0.326 -0.499l0.489 -0.538c0.048 -0.056 0.041 -0.132 -0.011 -0.177z"/>
                </svg>
                <text class="statText bold" x="40" y="12.5">
                    Reputation:
                </text>
                <text
                    class="stat bold"
                    x="260"
                    y="12.5"
                    data-testid="commits"
                >
                    ${data.reputation}
                </text>
            </g>
        </g>
        <!-- Stars -->
        <g transform="translate(0, 120)">
            <g class="stagger" style="animation-delay: 750ms" transform="translate(15, 0)">
                <svg data-testid="icon" class="icon" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" xml:space="preserve" width="16" height="16">
                    <g>
                        <path class="st0" d="M8.95 4.95c-2.3 0.45 -3 1.15 -3.45 3.45 -0.45 -2.3 -1.15 -3 -3.45 -3.45C4.35 4.5 5.05 3.8 5.5 1.5c0.45 2.3 1.15 3 3.45 3.45z"/>
                    </g>
                    <g>
                        <path class="st0" d="M10.9 12.5c-1.6 0.3 -2.05 0.8 -2.4 2.4 -0.3 -1.6 -0.8 -2.05 -2.4 -2.4 1.6 -0.3 2.05 -0.8 2.4 -2.4 0.3 1.6 0.8 2.1 2.4 2.4z"/>
                    </g>
                    <g>
                        <path class="st0" d="M14.5 7.5c-1.3 0.25 -1.7 0.65 -1.95 1.95 -0.25 -1.3 -0.65 -1.7 -1.95 -1.95 1.3 -0.25 1.7 -0.65 1.95 -1.95 0.25 1.3 0.65 1.7 1.95 1.95z"/>
                    </g>
                    <path class="st0" x1="5" y1="23" x2="5" y2="23" d="M2.5 11.5L2.5 11.5"/>
                    <path class="st0" x1="28" y1="6" x2="28" y2="6" d="M14 3L14 3"/>
                </svg>
                <text class="statText bold" x="40" y="12.5">
                    Total Stars:
                </text>
                <text
                    class="stat bold"
                    x="260"
                    y="12.5"
                    data-testid="prs"
                >
                    ${ data.stars }
                </text>
            </g>
        </g>
        <!-- Badges -->
        <g transform="translate(0, 150)">
            <g class="stagger" style="animation-delay: 1050ms" transform="translate(15, 0)">
                <svg data-testid="icon" class="icon" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" style="enable-background:new 0 0 511.999 511.999;" xml:space="preserve" width="16" height="16">
                    <path d="m14.987 12.533 0.968 -1.452a0.267 0.267 0 0 0 0.013 -0.274 0.267 0.267 0 0 0 -0.235 -0.141h-1.6V9.6a0.266 0.266 0 0 0 -0.267 -0.267H13.6V2.4a0.266 0.266 0 0 0 -0.267 -0.267h-0.8V0.8a0.266 0.266 0 0 0 -0.267 -0.267H3.733a0.266 0.266 0 0 0 -0.267 0.267v1.333h-0.8A0.266 0.266 0 0 0 2.4 2.4v6.933h-0.267a0.266 0.266 0 0 0 -0.267 0.267v1.067h-1.6a0.267 0.267 0 0 0 -0.235 0.141 0.267 0.267 0 0 0 0.013 0.274l0.968 1.452L0.045 13.985a0.267 0.267 0 0 0 -0.013 0.274 0.267 0.267 0 0 0 0.235 0.141h2.4a0.266 0.266 0 0 0 0.267 -0.267v-1.067h1.569l3.345 2.351c0.046 0.032 0.1 0.049 0.153 0.049s0.107 -0.016 0.153 -0.049l3.345 -2.351h1.569v1.067a0.266 0.266 0 0 0 0.267 0.267h2.4a0.267 0.267 0 0 0 0.235 -0.141 0.267 0.267 0 0 0 -0.013 -0.274l-0.968 -1.452zM3.467 3.467a0.266 0.266 0 0 1 0.267 -0.267h0.8V1.867a0.266 0.266 0 0 1 0.267 -0.267h6.4a0.266 0.266 0 0 1 0.267 0.267V3.2h0.8a0.266 0.266 0 0 1 0.267 0.267v5.867H12v-5.6h-0.8a0.266 0.266 0 0 1 -0.267 -0.267V2.133H5.067v1.333a0.266 0.266 0 0 1 -0.267 0.267H4v5.6h-0.533V3.467zm2.667 2.4C6.133 4.838 6.971 4 8 4c1.029 0 1.867 0.838 1.867 1.867 0 0.654 -0.339 1.229 -0.849 1.563 0.739 0.348 1.273 1.059 1.367 1.904h-0.537c-0.13 -0.903 -0.909 -1.6 -1.848 -1.6s-1.718 0.697 -1.848 1.6h-0.537c0.094 -0.845 0.628 -1.556 1.367 -1.904 -0.51 -0.334 -0.849 -0.909 -0.849 -1.563zm-3.733 8H0.765l0.79 -1.185a0.267 0.267 0 0 0 0 -0.296L0.765 11.2h1.102v1.6a0.266 0.266 0 0 0 0.267 0.267H2.4v0.8zm5.761 0.288a0.267 0.267 0 0 1 -0.161 0.054 0.267 0.267 0 0 1 -0.161 -0.054l-1.438 -1.088h0.884L8 13.608l0.715 -0.541h0.884l-1.438 1.088zm3.252 -1.622H2.4v-2.667h11.2v2.667h-2.187zm2.187 1.333v-0.8h0.267a0.266 0.266 0 0 0 0.267 -0.267v-1.6h1.102l-0.79 1.185a0.267 0.267 0 0 0 0 0.296l0.79 1.185H13.6z"/>
                    <path d="M4.8 10.933h1.067c0.147 0 0.267 -0.119 0.267 -0.267s-0.119 -0.267 -0.267 -0.267H4.8c-0.147 0 -0.267 0.119 -0.267 0.267s0.119 0.267 0.267 0.267z"/>
                    <path d="M6.933 10.933h1.6c0.147 0 0.267 -0.119 0.267 -0.267s-0.119 -0.267 -0.267 -0.267h-1.6c-0.147 0 -0.267 0.119 -0.267 0.267s0.119 0.267 0.267 0.267z"/>
                    <path d="M7.2 11.467h-2.4c-0.147 0 -0.267 0.119 -0.267 0.267S4.653 12 4.8 12h2.4c0.147 0 0.267 -0.119 0.267 -0.267s-0.119 -0.267 -0.267 -0.267z"/>
                    <path d="M11.2 11.467h-0.533c-0.147 0 -0.267 0.119 -0.267 0.267s0.119 0.267 0.267 0.267H11.2c0.147 0 0.267 -0.119 0.267 -0.267s-0.119 -0.267 -0.267 -0.267z"/>
                    <path d="M9.6 11.467h-1.333c-0.147 0 -0.267 0.119 -0.267 0.267s0.119 0.267 0.267 0.267H9.6c0.147 0 0.267 -0.119 0.267 -0.267s-0.119 -0.267 -0.267 -0.267z"/>
                    <path d="M11.2 10.4h-1.333c-0.147 0 -0.267 0.119 -0.267 0.267s0.119 0.267 0.267 0.267H11.2c0.147 0 0.267 -0.119 0.267 -0.267s-0.119 -0.267 -0.267 -0.267z"/>
                    <path d="M8 7.2c0.735 0 1.333 -0.598 1.333 -1.333 0 -0.735 -0.598 -1.333 -1.333 -1.333 -0.735 0 -1.333 0.598 -1.333 1.333 0 0.735 0.598 1.333 1.333 1.333z"/>
                </svg>
                <text class="statText bold" x="40" y="12.5">
                    Total Badges:
                </text>
                <text
                    class="stat bold"
                    x="260"
                    y="12.5"
                    data-testid="contribs"
                >
                    ${ data.badges }
                </text>
            </g>
        </g>
        <!-- Contributions -->
        <g transform="translate(0, 180)">
            <g class="stagger" style="animation-delay: 1050ms" transform="translate(15, 0)">
                <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
                    <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                </svg>
                <text class="statText bold" x="40" y="12.5">
                    Contributions Score:
                </text>
                <text
                    class="stat bold"
                    x="260"
                    y="12.5"
                    data-testid="contribs"
                >
                    ${ data.contributions}
                </text>
            </g>
        </g>
    </g>
</svg>`;
}