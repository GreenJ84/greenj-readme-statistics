import { Request, Response } from 'express';
import { preFlight, normalizeLocaleCode, normalizeParam } from '../../src/utils/utils';

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