import { ApolloClient, InMemoryCache } from "@apollo/client";
import { USER_AGENT } from "../utils/constants";
import { LeetCodeGraphQLResponse, LeetCodeGraphQLQuery } from "./leetcodeTypes";

export async function leetcodeGraphQL (query: LeetCodeGraphQLQuery, url: string, csrf: string = ""): Promise<LeetCodeGraphQLResponse> {
    const BASE = url;
    const client = new ApolloClient({
        uri: `${BASE}/graphql`,
        cache: new InMemoryCache(),
    });
    const headers = {
        'Content-Type': 'application/json',
        origin: BASE,
        referer: BASE,
        cookie: `csrftoken=${csrf}; LEETCODE_SESSION=;`,
        "x-csrftoken": `${csrf}`,
        "user-agent": USER_AGENT,
    };
    
    try {
        const result = await client.query(
            {
                ...query,
                context: {
                    headers,
                    method: 'POST',
                }
            }
        )
            .then(result => {
                return result.data
            })
            .catch(err => {
                return {
                    data: {
                        message: "An error occurred while retrieving data from the external API",
                        error_code: 500,
                        error: err
                    }
                }
            });
        return result as LeetCodeGraphQLResponse;
    }
    catch (err) {
        console.log("an error has occured", err);
        return {
            data: {
                message: "An error occurred while connecting to the external API",
                error_code: 500,
                error: err
            }
        }
    }
};