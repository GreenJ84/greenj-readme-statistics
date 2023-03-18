import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLQuery, GraphQLError, GIT_URL } from "../utils/constants";
import { GraphQLResponse } from "./githubTypes";
const token = "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";

export async function githubGraphQL(query: GraphQLQuery): Promise<GraphQLError | GraphQLResponse> {
    const client = new ApolloClient({
        uri: GIT_URL,
        cache: new InMemoryCache(),
    });
    const headers = {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
    };
    
    const result = await client.query(
        {
            ...query,
            context: {
                headers,
                method: 'GET',
            }
        }
    )
        .then(result => {
            return result.data as GraphQLResponse
        })
        .catch(err => {
            return {
                    message: "An error occurred while retrieving data from the external API",
                    error_code: 500,
                    error: err
                } as GraphQLError
        });
    return result;
};