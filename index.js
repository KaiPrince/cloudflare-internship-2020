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
  const variantsUrl =
    "https://cfw-takehome.developers.workers.dev/api/variants";

  const urls = await getUrls(variantsUrl);

  const randomUrl = getRandomItem(urls);

  const response = await fetch(randomUrl);
  return response;
}

async function getUrls(variantsUrl) {
  const responseJson = await (await fetch(variantsUrl)).json();
  const variants = responseJson.variants;
  return variants;
}

function getRandomItem(array) {
  const index = getRandomIntInclusive(0, Array(array).length);
  return array[index];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
