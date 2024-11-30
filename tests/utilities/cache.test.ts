import { Cache } from "../../src/utils/cache";


const cache = new Cache();
beforeAll(async () => {
    await cache.createConnection();

})

afterAll(async () => {
    await cache.tearConnection();
});

let keyGenerator: Function;
describe("Testing the resources provided by the cache", () => {
    const username = 'GreenDud'
    keyGenerator = Cache.keyGenerator('github');
    it("Should get the correct cache key for each Github Routes", () => {
        expect(keyGenerator(username, "trophies")).toEqual('github:GreenDud:trophies');
        expect(keyGenerator(username, "languages")).toEqual('github:GreenDud:languages');
        expect(keyGenerator(username, "stats")).toEqual('github:GreenDud:stats');
        expect(keyGenerator(username, "streak")).toEqual('github:GreenDud:streak');
    });

    it("Should get the correct cache key for each Leetcode Routes", () => {
        keyGenerator = Cache.keyGenerator('leetcode');
        expect(keyGenerator(username, "stats")).toEqual('leetcode:GreenDud:stats');
        expect(keyGenerator(username, "badges")).toEqual('leetcode:GreenDud:badges');
        expect(keyGenerator(username, "completion")).toEqual('leetcode:GreenDud:completion');
        expect(keyGenerator(username, "submission")).toEqual('leetcode:GreenDud:submission');
        expect(keyGenerator(username, "streak")).toEqual('leetcode:GreenDud:streak');
    });

    it ("Should get the correct cache key for each Wakatime Routes", () => {
        keyGenerator = Cache.keyGenerator('wakatime');
        expect(keyGenerator(username, "insights")).toEqual('wakatime:GreenDud:insights');
        expect(keyGenerator(username, "languages")).toEqual('wakatime:GreenDud:languages');
        expect(keyGenerator(username, "stats")).toEqual('wakatime:GreenDud:stats');
    })

    const cacheKey = keyGenerator(username, "languages")
    it('Should not have a key set prior to retrieval', async () => {
        expect(
            await cache.getItem(cacheKey))
        .toEqual(null);
    })

    it('Should not be able to delete unset keys', async () => {
        expect(
            await cache.deleteItem(cacheKey)).toEqual(false);
    })

    it('Should set and recieve a cache validly', async () => {
        const streakKey = Cache.keyGenerator("leetcode")(username, "streak");

        await cache.setItem(streakKey, { times: 1 });
        expect(await cache.getItem(streakKey)).toEqual({ times: 1 });
    })

    it('Should delete a key successfully not be able to access keys after deletion', async () => {
        const trophyKey = Cache.keyGenerator("github")(username, "trophies");

        await cache.setItem(trophyKey, { times: 1 });
        expect(await cache.deleteItem(trophyKey)).toEqual(true);

        expect(await cache.getItem(trophyKey)).toEqual(null);
    })
    
})