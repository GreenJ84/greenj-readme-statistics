import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphQLQuery, GraphQLError, GIT_URL } from "../utils/constants";
const token = "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";

export async function githubGraphQL(query: GraphQLQuery): Promise<any> {
    const client = new ApolloClient({
        uri: GIT_URL,
        cache: new InMemoryCache(),
    });
    const headers = {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
    };
    
    try {
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
                return result.data as any
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