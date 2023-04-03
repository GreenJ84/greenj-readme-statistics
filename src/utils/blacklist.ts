import fs from 'fs';
import { Request } from 'express';

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

