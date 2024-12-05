import { Request } from "express";
import {
  sanitizeText,
  sanitizeParam,
  sanitizeColor,
  sanitizeNumber,
  sanitizeBoolean,
  sanitizeUsername,
  sanitizeQuery
} from "../../src/utils/sanitization"

describe('sanitizeText', () => {
  it('returns the sanitized value for valid input', () => {
    expect(sanitizeText('Commit_Statistics')).toEqual('Commit Statistics');
    expect(sanitizeText('My_GitHub')).toEqual('My GitHub');
    expect(sanitizeText('My_GitHub_Stats')).toEqual('My GitHub Stats');
  });

  it('throws an error for invalid input', () => {
    expect(() => sanitizeText('!@#$%')).toThrowError('Invalid text value: !@#$%');
    expect(() => sanitizeText('hello123!')).toThrowError('Invalid text value: hello123!');
    expect(() => sanitizeText('"<script>alert("Broken");</script>"')).toThrowError('Invalid text value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeText('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid text value: "axios.get("http://my.trojan.net")"');
  });
});

describe('sanitizeParam', () => {
  it('returns the sanitized value for valid input', () => {
    expect(sanitizeParam('black_ice')).toEqual('black-ice');
    expect(sanitizeParam('synthwave')).toEqual('synthwave');
    expect(sanitizeParam('buefy_dark')).toEqual('buefy-dark');
  });

  it('throws an error for invalid input', () => {
    expect(() => sanitizeParam('!@#$%')).toThrowError('Invalid text value: !@#$%');
    expect(() => sanitizeParam('hello123!')).toThrowError('Invalid text value: hello123!');
    expect(() => sanitizeParam('"<script>alert("Broken");</script>"')).toThrowError('Invalid text value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeParam('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid text value: "axios.get("http://my.trojan.net")"');
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
    expect(sanitizeColor('abcdef')).toEqual('#abcdef');
    expect(sanitizeColor('E4E2E2')).toEqual('#E4E2E2');
    expect(sanitizeColor('FF3860')).toEqual('#FF3860');
    expect(sanitizeColor('9E9E9E')).toEqual('#9E9E9E');
    expect(sanitizeColor('00AEFF')).toEqual('#00AEFF');
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
    expect(() => sanitizeUsername('"<script>alert("Broken");</script>"')).toThrowError('Invalid username value: "<script>alert("Broken");</script>"');
    expect(() => sanitizeUsername('"axios.get("http://my.trojan.net")"')).toThrowError('Invalid username value: "axios.get("http://my.trojan.net")"');
  });
});

describe('sanitizeQuery', () => {
  const mockRequest = {
      query: {},
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
      expect(sanitizeQuery(request)).toEqual(undefined)
      expect(request.query).toEqual({
          "background": "#151515",
          "border": "#E4E2E2",
          "stroke": "#E4E2E2",
          "fire": "#FB8C00",
          "icons": "#FB8C00",
          "stats": "#FEFEFE",
          "textMain": "#FB8C00",
          "textSub": "#FEFEFE",
          "dates": "#9E9E9E",
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
      expect(sanitizeQuery(request)).toEqual(undefined)
      expect(request.query).toEqual({
          "background": "#151515",
          "textMain": "#FB8C00",
          "textSub": "#FEFEFE",
          "dates": "#9E9E9E",
          "title": "My New Streak",
          "borderRadius": "14",
          "hideBorder": "true"
      });
  });

  mockRequest.query = {};
  it('throws errors for invalid query', () => {
      let request = { ...mockRequest } as Request;
      request.query = {
          "background": "151515",
          "hideBorder": "fasle",
      }
      expect(() => sanitizeQuery(request)).toThrowError("Invalid boolean value: fasle");

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
      expect(() => sanitizeQuery(request)).toThrowError("Invalid color value: E4E2 E2");

      request.query = {
        "title": "151515",
      }
      expect(() => sanitizeQuery(request)).toThrowError("");
    });

    mockRequest.query = {};
    it('throws errors for xss input found', () => {
      const request = { ...mockRequest } as Request;
      request.query = {
          "background": "<script></script>",
      }
      expect(() => sanitizeQuery(request)).toThrowError("Malicious xss found in parameter: background, value: <script></script>");

      request.query = {
        "stats": '<script>axios.get("http://my.trojan.net")</script>',
      }
      expect(() => sanitizeQuery(request)).toThrowError("Malicious xss found in parameter: stats, value: <script>axios.get(\"http://my.trojan.net\")</script>");
  });
});
