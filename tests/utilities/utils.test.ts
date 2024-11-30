import { Request } from 'express';
import { Themes } from '../../src/utils/themes';
import { normalizeLocaleCode, baseCardThemeParse, parseCookie, getFormatDate } from '../../src/utils/utils';

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
        ...Themes["default"]!,
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
            "background": "#151515",
            "border": "#E4E2E2",
            "stroke": "#E4E2E2",
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
            ...Themes["black-ice"]!,
            borderRadius: 14,
            hideBorder: true,
            locale: 'en-US'
        });
    });
});

describe("parseCookie", () => {
    it("should parse a valid cookie string", () => {
    const cookie = "foo=bar;baz=qux;abc=def";
    const parsedCookie = parseCookie(cookie);
    expect(parsedCookie).toEqual({
        foo: "bar",
        baz: "qux",
        abc: "def"
    });
    });

    it("should parse a cookie with spaces around keys and values", () => {
    const cookie = " foo = bar ; baz = qux ; abc = def ";
    const parsedCookie = parseCookie(cookie);
    expect(parsedCookie).toEqual({
        foo: "bar",
        baz: "qux",
        abc: "def"
    });
    });

    it("should ignore cookies with no values", () => {
    const cookie = "foo=bar;;baz=qux;abc=def;;";
    const parsedCookie = parseCookie(cookie);
    expect(parsedCookie).toEqual({
        foo: "bar",
        baz: "qux",
        abc: "def"
    });
    });

    it("should handle cookies with special characters", () => {
    const cookie = "foo=bar;baz=%20qux%20;abc=%3Ddef%3D";
    const parsedCookie = parseCookie(cookie);
    expect(parsedCookie).toEqual({
        foo: "bar",
        baz: "qux",
        abc: "=def="
    });
    });

    it("should return an empty object for an empty string", () => {
    const cookie = "";
    const parsedCookie = parseCookie(cookie);
    expect(parsedCookie).toEqual({});
    });
});

describe('getFormatDate', () => {
    const dateString = '2022-03-15T14:30:00.000Z';
    
    it('should format date with month and day only if current year', () => {
        expect(getFormatDate(
            new Date().getFullYear().toString() + dateString.slice(4),
            'en-US')
        ).toEqual('Mar 15');
    });

    it('should format date with year if not current year', () => {
        expect(getFormatDate(dateString, 'en-US', 'MMM dd, yyyy')).toEqual('Mar 15, 2022');
    });

    it('should format date according to specified format', () => {
        expect(getFormatDate(dateString, 'en-US', 'MM/dd/yyyy')).toEqual('03/15/2022');
    });

    it('formats the date correctly in French', () => {
        const result = getFormatDate(dateString, 'fr-FR');
        expect(result).toEqual('15 mars 2022');
    });

    it('formats the date correctly in German', () => {
        const result = getFormatDate(dateString, 'de-DE');
        expect(result).toEqual('15. März 2022');
    });

    it('formats the date correctly in Italian', () => {
        const result = getFormatDate(dateString, 'it-IT');
        expect(result).toEqual('15 mar 2022');
    });

    it('formats the date correctly in Spanish', () => {
        const result = getFormatDate(dateString, 'es-ES');
        expect(result).toEqual('15 mar 2022');
    });

    it('formats the date correctly in Portuguese with formatting', () => {
        const result = getFormatDate(dateString, 'pt-PT', 'dd MMM yyyy');
        expect(result).toEqual('15 Mar 2022');
    });
});