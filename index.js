/*
 * Project Name: cloudflare-internship-2020
 * File Name: index.js
 * Programmer: Kai Prince
 * Date: Thu, Apr 16, 2020
 * Description: This file contains a simple Worker which returns the response
 *  from a randomly-chosen web page.
 */

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

/**
 * Consumes a url string, and returns an array of url strings.
 * @param {string} variantsUrl The url of the variants api.
 */
async function getVariantUrls(variantsUrl) {
  const responseJson = await (await fetch(variantsUrl)).json();
  const variants = responseJson.variants;
  return variants;
}

/**
 * Returns an item from an array, selected at random.
 * @param {Array} array
 */
function getRandomItem(array) {
  const index = getRandomIntInclusive(0, Array(array).length);
  return array[index];
}

/**
 * Returns a random number between a min and max, inclusive.
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {number} min The minimum range
 * @param {number} max The maximum range
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
