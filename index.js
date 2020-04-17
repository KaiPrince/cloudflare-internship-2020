/*
 * Project Name: cloudflare-internship-2020
 * File Name: index.js
 * Programmer: Kai Prince
 * Date: Thu, Apr 16, 2020
 * Description: This file contains a simple Worker which returns the response
 *  from a randomly-chosen web page.
 */

import { getVariantUrls, getRandomItem } from "./utils";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Respond with a random variant page.
 * @param {Request} request
 */
async function handleRequest(request) {
  const variantsApiUrl =
    "https://cfw-takehome.developers.workers.dev/api/variants";

  const urls = await getVariantUrls(variantsApiUrl);

  const randomUrl = getRandomItem(urls);

  const response = await fetch(randomUrl);
  return response;
}
