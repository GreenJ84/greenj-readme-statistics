import { CRED_URL, GRAPHQL_URL_CN, USER_AGENT } from "../utils/constants";
import { parse_cookie } from "./utils";

// Credential
export interface ICredential {
    // The authentication session.
    session?: string;
    //The csrf token.
    csrf?: string;
}

export async function get_csrf(): Promise<String> {
    const cookies_raw = await fetch(CRED_URL, {
        headers: {
            "user-agent": USER_AGENT,
        },
    }).then((res) => {
        return res.headers.get("set-cookie") as string;
    })
    .catch((err) => {
        return `error: ${err}`
    });
    const csrf_token = parse_cookie(cookies_raw).csrftoken!;

    return csrf_token;
};

export async function get_csrf_cn() {
    const cookies_raw = await fetch(GRAPHQL_URL_CN, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "user-agent": USER_AGENT,
        },
        body: JSON.stringify({
            operationName: "nojGlobalData",
            variables: {},
            query: "query nojGlobalData {\n  siteRegion\n  chinaHost\n  websocketUrl\n}\n",
        }),
    }).then((res) => {
        return res.headers.get("set-cookie") as string;
    }).catch((err) => {
        return `error: ${err}`
    });

    const csrf_token = parse_cookie(cookies_raw).csrftoken;

    return csrf_token;
};