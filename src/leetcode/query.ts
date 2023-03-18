import { ApolloClient, InMemoryCache } from "@apollo/client";
import { USER_AGENT, GraphQLQuery, GraphQLError } from "../utils/constants";
import { LeetCodeGraphQLResponse } from "./leetcodeTypes";

export async function leetcodeGraphQL (query: GraphQLQuery, url: string, csrf: string): Promise<LeetCodeGraphQLResponse | GraphQLError> {
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
                return result.data as LeetCodeGraphQLResponse
            })
            .catch(err => {
                return {
                        message: "An error occurred while retrieving data from the external API",
                        error_code: 500,
                        error: err
                    } as GraphQLError
            });
        return result;
    }
    catch (err) {
        console.log("an error has occured", err);
        return {
            message: "An error occurred while connecting to the external API",
            error_code: 500,
            error: err
        } as GraphQLError
    }
};