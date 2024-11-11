/** @format */

import { getCacheKey, getRegistrationCache, setRegistrationCache } from "./cache";

let allowlist: string[] = ["GreenJ84"]

export const addToAllowlist = (newAllowlist: string) => {
  allowlist.push(newAllowlist);
  const cacheKey = getCacheKey("url/allowlist/users")
  
  setRegistrationCache(cacheKey, allowlist.join("/"))
};

export const checkAllowlistRequest = (
  user: string
): boolean => {
  return allowlist.includes(user)
};

export const setAllowlist = async () => {
  const cacheKey = getCacheKey("url/allowlist/users")

  const [success, cacheAllowed] = await getRegistrationCache(cacheKey)
  if (success) {
    allowlist.concat((cacheAllowed! as string).split('/'));
  }
}