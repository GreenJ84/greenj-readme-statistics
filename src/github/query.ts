import { ApolloClient, InMemoryCache } from "@apollo/client";
import { LeetCodeGraphQLResponse } from "../leetcode/leetcodeTypes";
import { GraphQLQuery, GraphQLError, USER_AGENT, GIT_URL } from "../utils/constants";

export async function leetcodeGraphQL (query: GraphQLQuery, token: string): Promise<LeetCodeGraphQLResponse> {
    const client = new ApolloClient({
        uri: GIT_URL,
        cache: new InMemoryCache(),
    });
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v4.idl',
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
                    data: {
                        message: "An error occurred while retrieving data from the external API",
                        error_code: 500,
                        error: err
                    } as GraphQLError
                }
            });
        return result;
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