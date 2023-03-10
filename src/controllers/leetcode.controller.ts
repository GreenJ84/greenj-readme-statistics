/** @format */

export { };
import fs from 'fs';
import { Request, Response } from "express";
import { gql } from "graphql-tag";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BASE_URL } from "leetcode-query";

export const getLeetcodeProfileStats = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { } = req.query;

    if (!username) {
        res.send({ message: 'No username found on API Call', error: "Missing username parameter.", error_code: 400})
    }

    const endpoint = BASE_URL;
    const query = gql(
        fs.readFileSync('../leetcode/graphql/leetcode-profile.graphql', 'utf8')
    );
    const client = new ApolloClient({
        uri: endpoint,
        cache: new InMemoryCache(),
    });

    try {
        client.query({ query })
            .then(result => {
                res.status(300).send(result)
            })
            .catch(err => {
                console.error(err)
                res.send({
                    message: "Something has gone wrong with the API",
                    error_code: 400,
                    error: err
                })
            });
    }
    catch (err) {
        console.log("an error has occured", err);
        res.status(500).send(`An error occurred while retrieving data from the external API: ${err}`);
    }
}