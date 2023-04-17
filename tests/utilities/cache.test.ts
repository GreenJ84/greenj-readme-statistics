import { buildRedis, deleteCacheData, getCacheData, getCacheKey, setCacheData, teardownRedis } from "../../src/utils/cache";

beforeAll(async () => {
    await buildRedis();
})

afterAll(async () => {
    await teardownRedis();
});

describe("Testing the resources provided by the cache", () => {
    const username = 'GreenDud'
    it("Should get the correct cache key for each Github Routes", () => {
        expect(getCacheKey("url/github/register", username)).toEqual('github:GreenDud:profile');
        expect(getCacheKey("url/github/unregister", username)).toEqual('github:GreenDud:profile');
        expect(getCacheKey("url/github/trophies", username)).toEqual('github:GreenDud:trophies');
        expect(getCacheKey("url/github/languages", username)).toEqual('github:GreenDud:languages');
        expect(getCacheKey("url/github/stats", username)).toEqual('github:GreenDud:stats');

        expect(getCacheKey("url/github/streak/register", username)).toEqual('github:GreenDud:streak');
        expect(getCacheKey("url/github/streak", username)).toEqual('github:GreenDud:streak');
    });

    it("Should get the correct cache key for each Leetcode Routes", () => {
        expect(getCacheKey("url/leetcode/register", username)).toEqual('leetcode:GreenDud:profile');
        expect(getCacheKey("url/leetcode/unregister", username)).toEqual('leetcode:GreenDud:profile');
        expect(getCacheKey("url/leetcode/stats", username)).toEqual('leetcode:GreenDud:stats');
        expect(getCacheKey("url/leetcode/badges", username)).toEqual('leetcode:GreenDud:badges');
        expect(getCacheKey("url/leetcode/completion", username)).toEqual('leetcode:GreenDud:completion');
        expect(getCacheKey("url/leetcode/submission", username)).toEqual('leetcode:GreenDud:submission');

        expect(getCacheKey("url/leetcode/streak/register", username)).toEqual('leetcode:GreenDud:streak');
        expect(getCacheKey("url/leetcode/streak", username)).toEqual('leetcode:GreenDud:streak');
    });

    it ("Should get the correct cache key for each Wakatime Routes", () => {
        expect(getCacheKey("url/wakatime/register", username)).toEqual('wakatime:GreenDud:profile');
        expect(getCacheKey("url/wakatime/unregister", username)).toEqual('wakatime:GreenDud:profile');
        expect(getCacheKey("url/wakatime/insights", username)).toEqual('wakatime:GreenDud:insights');
        expect(getCacheKey("url/wakatime/languages", username)).toEqual('wakatime:GreenDud:languages');
        expect(getCacheKey("url/wakatime/stats", username)).toEqual('wakatime:GreenDud:stats');
    })

    it('Should not have a key set prior to retrieval', async () => {
        expect(
            await getCacheData(getCacheKey("url/wakatime/register", username)))
        .toEqual([false, null]);
    })

    it('Should not be able to delete unset keys', async () => {
        expect(
            await deleteCacheData(getCacheKey("url/wakatime/register", username))).toEqual(false);
    })
    
    it('Should set and recieve a cache validly', async () => {
        const streakKey = getCacheKey("url/leetcode/streak", username);

        await setCacheData(streakKey, { times: 1 });
        expect(await getCacheData(streakKey)).toEqual([true, { times: 1 }]);
    })

    it('Should delete a key successfully not be able to access keys after deletion', async () => {
        const trophyKey = getCacheKey("url/github/trophies", username);

        await setCacheData(trophyKey, { times: 1 });
        expect(await deleteCacheData(trophyKey)).toEqual(true);

        expect(await getCacheData(trophyKey)).toEqual([false, null]);
    })
    
})