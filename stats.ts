/**
 * Build a GraphQL query for a contribution graph
 *
 * @param user GitHub username to get graphs for
 * @param year Year to get graph for
 * @return GraphQL query
 */
function buildContributionGraphQuery(user: string, year: number): string {
    const start = `${year}-01-01T00:00:00Z`;
    const end = `${year}-12-31T23:59:59Z`;
    return `query {
    user(login: "${user}") {
        createdAt
        contributionsCollection(from: "${start}", to: "${end}") {
        contributionYears
        contributionCalendar {
            weeks {
            contributionDays {
                contributionCount
                date
            }
            }
        }
        }
    }
    }`;
}

/**
    * Execute multiple requests with cURL and handle GitHub API rate limits and errors
    *
    * @param user GitHub username to get graphs for
    * @param years Years to get graphs for
    * @returns List of GraphQL response objects with years as keys
*/
async function executeContributionGraphRequests(user: string, years: number[]): Promise<{[year: number]: any}> {
    const tokens: {[year: number]: string} = {};
    const requests: {[year: number]: any} = {};
    // build handles for each year
    for (const year of years) {
    tokens[year] = await getGitHubToken();
    const query = buildContributionGraphQuery(user, year);
    requests[year] = getGraphQLCurlHandle(query, tokens[year]);
    }

    Promise.all(Object.values(requests).map(url => fetch(url)))
        .then(responses => Promise.all(responses.map(res => res.text())))
        .then(texts => console.log(texts));
    // build multi-curl handle
    const multi = curl_multi_init();
    for (const handle of Object.values(requests)) {
    curl_multi_add_handle(multi, handle);
    }
    // execute queries
    let running: number|null = null;
    do {
    curl_multi_exec(multi, running);
    } while (running);
    // collect responses
    const responses: {[year: number]: any} = {};
    for (const year of Object.keys(requests)) {
    const contents = curl_multi_getcontent(handle);
    const decoded = isString(contents) ? JSON.parse(contents) : null;
    // if response is empty or invalid, retry request one time or throw an error
    if (!decoded || !decoded.data || decoded.errors?.length) {
        const message = decoded.errors?.[0].message ?? (decoded.message ?? "An API error occurred.");
        const error_type = decoded.errors?.[0].type ?? "";
        // Missing SSL certificate
        if (curl_errno(handle) === 60) {
        throw new AssertionError("You don't have a valid SSL Certificate installed or XAMPP.", 500);
        }
        // Other cURL error
        else if (curl_errno(handle)) {
        throw new AssertionError("cURL error: " + curl_error(handle), 500);
        }
        // GitHub API error - Not Found
        else if (error_type === "NOT_FOUND") {
        throw new InvalidArgumentException("Could not find a user with that name.", 404);
        }
        // if rate limit is exceeded, don't retry with same token
        if (message.includes("rate limit exceeded")) {
        await removeGitHubToken(tokens[year]);
        }
        console.error(`First attempt to decode response for ${user}'s ${year} contributions failed. ${message}`);
        console.error(`Contents: ${contents}`);
        // retry request
        const query = buildContributionGraphQuery(user, parseInt(year));
        const token = await getGitHubToken();
        const request = getGraphQLCurlHandle(query, token);
        const retryContents = await curl_exec(request);
        const retryDecoded = isString(retryContents) ? JSON.parse(retryContents) : null;
        // if the response is still empty or invalid, log an error and skip the year
        if (!retryDecoded || !retryDecoded.data) {
        const message = retryDecoded.errors?.[0].message ?? (retryDecoded.message ?? "An API error occurred.");
        if (message.includes("rate limit exceeded")) {
            await removeGitHubToken(token);
        }
        console.error(`Failed to decode response for ${user}'s ${year} contributions after 2 attempts. ${message}`);
        console.error(`Contents: ${contents}`);
            continue;
        }
    }
    responses[parseInt(year)] = decoded;
}
// close the handles
for (const request of Object.values(requests)) {
    curl_multi_remove_handle(multi, handle);
}
curl_multi_close($multi);
return $responses;
}


/**
    * Get the previous Sunday of a given date
    * @param date Date to get previous Sunday of (YYYY-MM-DD)
    * @return Previous Sunday in format "YYYY-MM-DD"
*/
function getPreviousSunday(date: string): string {
    const dayOfWeek = new Date(date).getDay();
    return new Date(new Date(date).setDate(new Date(date).getDate() - dayOfWeek)).toISOString().slice(0, 10);
}

/**
    * Get a stats object with the contribution count, weekly streak, and dates
    * @param contributions Y-M-D contribution dates with contribution counts
    * @return Streak stats object
*/
function getWeeklyContributionStats(contributions: Record<string, number>): Record<string, any> {
    // if no contributions, display error
    if (Object.keys(contributions).length === 0) {
    throw new Error("No contributions found.");
    }
    const thisWeek = getPreviousSunday(Object.keys(contributions)[Object.keys(contributions).length - 1]!);
    const firstWeek = getPreviousSunday(Object.keys(contributions)[0]!);
    const stats = {
    mode: "weekly",
    totalContributions: 0,
    firstContribution: "",
    longestStreak: {
        start: firstWeek,
        end: firstWeek,
        length: 0,
    },
    currentStreak: {
        start: firstWeek,
        end: firstWeek,
        length: 0,
    },
    };

    // calculate contributions per week
    const weeks: Record<string, number> = {};
    Object.entries(contributions).forEach(([date, count]) => {
    const week = getPreviousSunday(date);
    if (!weeks[week]) {
        weeks[week] = 0;
    }
    if (count > 0) {
        weeks[week] += count;
        // set first contribution date the first time
        if (!stats.firstContribution) {
        stats.firstContribution = date;
        }
    }
    });

    // calculate the stats from the contributions object
    Object.entries(weeks).forEach(([week, count]) => {
    // add contribution count to total
    stats.totalContributions += count;
    // check if still in streak
    if (count > 0) {
        // increment streak
        ++stats.currentStreak.length;
        stats.currentStreak.end = week;
        // set start on first week of streak
        if (stats.currentStreak.length === 1) {
        stats.currentStreak.start = week;
        }
        // update longestStreak
        if (stats.currentStreak.length > stats.longestStreak.length) {
        // copy current streak start, end, and length into longest streak
        stats.longestStreak.start = stats.currentStreak.start;
        stats.longestStreak.end = stats.currentStreak.end;
        stats.longestStreak.length = stats.currentStreak.length;
        }
    }
    // reset streak but give exception for this week
    else if (week !== thisWeek) {
        // reset streak
        stats.currentStreak.length = 0;
        stats.currentStreak.start = thisWeek;
        stats.currentStreak.end = thisWeek;
    }
    });
    return stats;
}

export {}