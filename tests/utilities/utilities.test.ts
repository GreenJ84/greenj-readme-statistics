import { Request, Response } from 'express';
import { THEMES } from '../../src/utils/themes';
import { preFlight, normalizeLocaleCode, normalizeParam, sanitizeText, sanitizeColor, sanitizeNumber, sanitizeBoolean, sanitizeUsername, sanitizeQuery, baseCardThemeParse } from '../../src/utils/utils';


describe('sanitizeText', () => {
    it('returns the sanitized value for valid input', () => {
    // Theme Names
    expect(sanitizeText('black_ice')).toEqual('black_ice');
    expect(sanitizeText('synthwave')).toEqual('synthwave');
    expect(sanitizeText('buefy_dark')).toEqual('buefy_dark');
    // Titles
    expect(sanitizeText('Commit_Statistics')).toEqual('Commit_Statistics');
    expect(sanitizeText('My_GitHub')).toEqual('My_GitHub');
    });

    it('throws an error for invalid input', () => {
    expect(() => sanitizeText('!@#$%')).toThrowError('Invalid text value: !@#$%');
    expect(() => sanitizeText('hello123!')).toThrowError('Invalid text value: hello123!');
    expect(() => sanitizeText('"<script>alert("Broken");</script>"')).toThrowError('Invalid text value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeText('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid text value: "axios.get("http://my.trojan.net")"');
    });
});

describe('sanitizeColor', () => {
    it('returns the sanitized value for valid input', () => {
    // Color names
    expect(sanitizeColor('red')).toEqual('red');
    expect(sanitizeColor('blanchedalmond')).toEqual('blanchedalmond');
    expect(sanitizeColor('darkslateblue')).toEqual('darkslateblue');
    expect(sanitizeColor('palevioletred')).toEqual('palevioletred');
    // Hex Codes
    expect(sanitizeColor('abcdef')).toEqual('abcdef');
    expect(sanitizeColor('E4E2E2')).toEqual('E4E2E2');
    expect(sanitizeColor('FF3860')).toEqual('FF3860');
    expect(sanitizeColor('9E9E9E')).toEqual('9E9E9E');
    expect(sanitizeColor('00AEFF')).toEqual('00AEFF');
    });

    it('throws an error for invalid input', () => {
    expect(() => sanitizeColor('not a color')).toThrowError('Invalid color value: not a color');
    expect(() => sanitizeColor('#zzzzzz')).toThrowError('Invalid color value: #zzzzzz');
    expect(() => sanitizeColor('#zzzzzz')).toThrowError('Invalid color value: #zzzzzz');
    expect(() => sanitizeColor('"<script>alert("Broken");</script>"')).toThrowError('Invalid color value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeColor('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid color value: "axios.get("http://my.trojan.net")"');
    });
});

describe('sanitizeNumber', () => {
    it('returns the sanitized value for valid input', () => {
    expect(sanitizeNumber('123')).toEqual("123");
    expect(sanitizeNumber('-3.14')).toEqual("-3.14");
    });

    it('throws an error for invalid input', () => {
    expect(() => sanitizeNumber('not a number')).toThrowError('Invalid number value: not a number');
    expect(() => sanitizeNumber('123abc')).toThrowError('Invalid number value: 123abc');
    expect(() => sanitizeNumber('"<script>alert("Broken");</script>"')).toThrowError('Invalid number value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeNumber('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid number value: "axios.get("http://my.trojan.net")"');
    });
});

describe('sanitizeBoolean', () => {
    it('returns the sanitized value for valid input', () => {
    expect(sanitizeBoolean('true')).toEqual("true");
    expect(sanitizeBoolean('FALSE')).toEqual("false");
    });

    it('throws an error for invalid input', () => {
    expect(() => sanitizeBoolean('not a boolean')).toThrowError('Invalid boolean value: not a boolean');
    expect(() => sanitizeBoolean('yes')).toThrowError('Invalid boolean value: yes');
    expect(() => sanitizeBoolean('"<script>alert("Broken");</script>"')).toThrowError('Invalid boolean value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeBoolean('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid boolean value: "axios.get("http://my.trojan.net")"');
    });
});

describe('sanitizeUsername', () => {
    it('returns the sanitized value for valid input', () => {
    expect(sanitizeUsername('my-username')).toEqual('my-username');
    expect(sanitizeUsername('code4life-xxx')).toEqual('code4life-xxx');
    expect(sanitizeUsername('GreenJ84')).toEqual('GreenJ84');
    expect(sanitizeUsername('123456789012345678901234567890123456')).toEqual('123456789012345678901234567890123456');
    });

    it('throws an error for invalid input', () => {
    expect(() => sanitizeUsername('not a username!')).toThrowError('Invalid username value: not a username!');
    expect(() => sanitizeUsername('a-too-long-username-123456789012345678901234567890123456')).toThrowError('Invalid username value: a-too-long-username-123456789012345678901234567890123456');
    });
    expect(() => sanitizeUsername('"<script>alert("Broken");</script>"')).toThrowError('Invalid username value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeUsername('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid username value: "axios.get("http://my.trojan.net")"');
});

describe('sanitizeQuery', () => {
    const mockRequest = {
        query: {}
    } as Request;
    it('returns the sanitized value for valid input', () => {
        let request = { ...mockRequest } as Request;
        request.query = {
            "background": "151515",
            "border": "E4E2E2",
            "stroke": "E4E2E2",
            "fire": "FB8C00",
            "icons": "FB8C00",
            "stats": "FEFEFE",
            "textMain": "FB8C00",
            "textSub": "FEFEFE",
            "dates": "9E9E9E",
        }
        sanitizeQuery(request)
        console.log(request.query)
        expect(request.query).toEqual({
            "background": "151515",
            "border": "E4E2E2",
            "stroke": "E4E2E2",
            "fire": "FB8C00",
            "icons": "FB8C00",
            "stats": "FEFEFE",
            "textMain": "FB8C00",
            "textSub": "FEFEFE",
            "dates": "9E9E9E",
        });
        request = { ...mockRequest } as Request;
        request.query = {
            "background": "151515",
            "textMain": "FB8C00",
            "textSub": "FEFEFE",
            "dates": "9E9E9E",
            "title": "My_New_Streak",
            "borderRadius": "14",
            "hideBorder": "true"
        }
        sanitizeQuery(request)
        expect(request.query).toEqual({
            "background": "151515",
            "textMain": "FB8C00",
            "textSub": "FEFEFE",
            "dates": "9E9E9E",
            "title": "My_New_Streak",
            "borderRadius": "14",
            "hideBorder": "true"
        });
    });

    const iMock = {
        query: {}
    } as Request;

    it('throws an error for invalid input', () => {
        let request = { ...iMock } as Request;
        request.query = {
            "background": "151515",
            "border": "E4E2E2",
            "stroke": "E4E2 E2",
            "fire": "FB/8C00",
            "icons": "FB8$C00",
            "stats": 'axios.get("http://my.trojan.net")"',
            "textMain": "<script></script>",
            "textSub": "<FEFEFE>",
            "dates": "9^E9E",
        }
        sanitizeQuery(request)
        expect(request.query).toEqual({
            "background": "151515",
            "border": "E4E2E2",
        });
        request = { ...iMock } as Request;
        request.query = {
            "background": "<script></script>",
            "textMain": "FB8C$0",
            "textSub": "FEF EFE",
            "dates": "green yellow",
            "borderRadius": "fourteen",
            "hideBorder": "hidden"
        }
        sanitizeQuery(request)
        expect(request.query).toEqual({});
    });
});


describe('preFlight', () => {
    const mockRequest = {
        params: {},
        headers: {}
    } as Request;

    const mockResponse = {
        status: jest.fn(() => ({
        send: jest.fn(),
        })),
    } as unknown as Response;

    it('returns false and sends 400 if username parameter is missing', () => {
        const result = preFlight(mockRequest, mockResponse);
        expect(result).toBe(false);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('returns false and sends 403 if request is blacklisted', () => {
        mockRequest.params.username = 'blacklistedUser';
        const result = preFlight(mockRequest, mockResponse);
        expect(result).toBe(false);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('returns true if request is allowed', () => {
        mockRequest.params.username = 'allowedUser';
        const result = preFlight(mockRequest, mockResponse);
        expect(result).toBe(true);
    });
});

describe('normalize Parameters', () => {
    it('returns lowercase language, title case script, and uppercase region', () => {
        expect(normalizeParam('Black_Ice')).toBe('black-ice');
        expect(normalizeParam('CORAL_RED')).toBe('coral-red');
        expect(normalizeParam('light_Green')).toBe('light-green');
    });
});


describe('normalize Locale Code', () => {
    it('returns lowercase language, title case script, and uppercase region', () => {
        expect(normalizeLocaleCode('en')).toBe('en');
        expect(normalizeLocaleCode('en_US')).toBe('en-US');
        expect(normalizeLocaleCode('zh_Hans_CN')).toBe('zh-Hans-CN');
    });

    it('returns "en" if locale code is invalid', () => {
        expect(normalizeLocaleCode('')).toBe('en');
        expect(normalizeLocaleCode('invalidCode')).toBe('en');
    });
});

describe('basicCardThemeParse', () => {
    const defaultTheme = {
        ...THEMES["default"]!,
        hideBorder: false,
        borderRadius: 10,
        locale: 'en-US'
    }
    let mockRequest = {
        query: {}
    } as Request;
    it('parses Theme Correctly from Request', () => {
        mockRequest.query = {}
        let card = baseCardThemeParse(mockRequest)
        expect(card).toEqual({
            ...defaultTheme
        });

        mockRequest.query = {
            "background": "151515",
            "border": "E4E2E2",
            "stroke": "E4E2E2",
            "hideBorder": "true"
        }
        card = baseCardThemeParse(mockRequest)
        expect(card).toEqual({
            ...defaultTheme,
            background: "#151515",
            border: "#E4E2E2",
            stroke: "#E4E2E2",
            hideBorder: true
        });

        mockRequest.query = {
            "theme": "black-ice",
            "borderRadius": "14",
            "hideBorder": "true"
        }
        card = baseCardThemeParse(mockRequest)
        expect(card).toEqual({
            ...THEMES["black-ice"]!,
            borderRadius: 14,
            hideBorder: true
        });
    });
});