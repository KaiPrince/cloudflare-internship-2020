/*
 * Project Name: cloudflare-internship-2020
 * File Name: utils.js
 * Programmer: Kai Prince
 * Date: Thu, Apr 16, 2020
 * Description: This file contains utility functions.
 */

/**
 * Consumes a url string, and returns an array of url strings.
 * @param {string} apiUrl The url of the variants api.
 */
export async function getVariantUrls(apiUrl) {
  const responseJson = await (await fetch(apiUrl)).json();
  const variants = responseJson.variants;
  return variants;
}

/**
 * Returns an item from an array, selected at random.
 * @param {Array} array
 */
export function getRandomItem(array) {
  const index = getRandomIntInclusive(0, Array(array).length);
  return array[index];
}

/**
 * Returns a random number between a min and max, inclusive.
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {number} min The minimum range
 * @param {number} max The maximum range
 */
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
