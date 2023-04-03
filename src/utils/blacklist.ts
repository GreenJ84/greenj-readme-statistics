import fs from 'fs';
import { Request } from 'express';
import { ResponseError } from './constants';
import { getCacheData, setCacheData } from './cache';

const filename = 'src/utils/blacklist.txt'

let blacklist: string[] = fs.readFileSync(filename, 'utf8').split('\n').filter(line => !line.startsWith("#"));

export const addToBlacklist = (newBlacklist: string) => {
    blacklist.push(newBlacklist);
    fs.writeFileSync(filename, blacklist.join('\n'));
};

export const checkBlacklistRequest = (req: Request, user: string = "DONTEVERBLOCKME"): [boolean, string] => {
    if (req.headers !== undefined && 'user-agent' in req.headers && blacklist.includes(req.headers['user-agent']!)) {
        return [false, "I do not like bots that are not nice. You have been excluded. 01000110 01110101 01100011 01101011 00100000 01101111 01100110 01100110 00100000 01100010 01100001 01100100 00100000 01100010 01101111 01110100"];
    }
    else if (req.ip !== undefined && blacklist.includes(req.ip)) {
        return [false, "This specific IP has lost access to this api. Feel free to create your own server with the code."];
    }
    else if (blacklist.includes(user)) {
        return [false, "This specific user has lost access to this api. Feel free to create your own server with the code."];
    } else {
        return [true, ""]
    }
}

export const manageLimiter = async (req: Request): Promise<ResponseError> => {
    let errors = [];

    const ipKey = `limit_exceeded:${req.ip}`;
    const [ipSuccess, ipCache] = await getCacheData(ipKey);
    if (!ipSuccess) {
        errors.push(`Ip address(${req.ip}) has just exceeded the rate limit`);
        setCacheData(ipKey, { times: 1 })
    } else {
        //Increment and reset cache data
        const data = ipCache as { times: number };
        errors.push(`Ip address(${req.ip}) has violated the rate limit ${data.times + 1} times`);
        if (data.times + 1 > 6) {
            addToBlacklist(req.ip as string)
        }
        setCacheData(ipKey, {times: data.times + 1})
    }

    if (req.params.username !== undefined) {
        const userKey = `limit_exceeded:${req.params.username!}`;
        const [userSuccess, userCache] = await getCacheData(userKey);
        if (!userSuccess) {
            errors.push(`Current user(${req.params.username!}) has just exceeded the rate limit`);
            setCacheData(userKey, { times: 1 })
        } else {
            //Increment and reset cache data
            const data = userCache as { times: number };
            errors.push(`Current user(${req.params.username!}) has violated the rate limit ${data.times + 1} times`);
            if (data.times + 1 > 6) {
                addToBlacklist(req.params.username! as string)
            }
            setCacheData(userKey, {times: data.times + 1})
        }
    }
    return {
        error: 'Exceeded Rate Limit',
        error_code: 429,
        message: errors.join(".\n"),
    } as ResponseError;
}