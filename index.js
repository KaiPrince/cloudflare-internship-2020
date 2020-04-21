/*
 * Project Name: cloudflare-internship-2020
 * File Name: index.js
 * Programmer: Kai Prince
 * Date: Thu, Apr 16, 2020
 * Description: This file contains a simple Worker which returns the response
 *  from a randomly-chosen web page.
 */

// import { getVariantUrls, getRandomItem } from "./utils";
// import Rewriter from "./htmlRewriter";

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

  const cookieIndex = getVariantCookie(request);
  const urlIndex = cookieIndex || getRandomIndex(urls);
  console.log(urlIndex);
  const randomUrl = urls[urlIndex];

  const response = await fetch(randomUrl);
  const withCookie = addCookie(response, urlIndex);
  const rewritten = rewriteHtml(withCookie);
  return rewritten;
}

function getVariantCookie(request) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) return null;
  const variantIndex = cookieString.replace(
    /(?:(?:^|.*;\s*)variant\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  return variantIndex;
}

/**
 * Consumes a url string, and returns an array of url strings.
 * @param {string} apiUrl The url of the variants api.
 */
async function getVariantUrls(apiUrl) {
  const responseJson = await (await fetch(apiUrl)).json();
  const variants = responseJson.variants;
  return variants;
}

/**
 * Returns an item from an array, selected at random.
 * @param {Array} array
 */
function getRandomIndex(array) {
  const index = getRandomIntInclusive(0, Array(array).length);
  return index;
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

/**
 * Consumes an html string and produces an altered html string.
 * @param {string} html The html request to rewrite
 */
function rewriteHtml(html) {
  let rewriter = new HTMLRewriter();
  rewriter = rewriteTitle(rewriter);
  rewriter = rewriteHeading(rewriter);
  rewriter = rewriteDescription(rewriter);
  rewriter = rewriteUrl(rewriter);

  return rewriter.transform(html);
}

function rewriteTitle(rewiter) {
  return rewiter.on("title", new TitleElementHandler());
}
function rewriteHeading(rewiter) {
  return rewiter.on("h1#title", new HeadingElementHandler());
}
function rewriteDescription(rewiter) {
  return rewiter.on("p#description", new DescriptionElementHandler());
}
function rewriteUrl(rewiter) {
  return rewiter.on("a#url", new LinkElementHandler());
}

class TitleElementHandler {
  element(element) {
    element.setInnerContent("Hello World!");
  }
}
class HeadingElementHandler {
  element(element) {
    element.setInnerContent("Hello!");
  }
}
class DescriptionElementHandler {
  element(element) {
    element.setInnerContent("Happy hacking.");
  }
}
class LinkElementHandler {
  element(element) {
    element.setInnerContent("Check out my Github");
    element.setAttribute("href", "https://github.com/KaiPrince");
  }
}

function addCookie(response, variant) {
  const newResponse = new Response(response.body, {
    headers: new Headers({ ...response.headers }).set(
      "Set-Cookie",
      `variant=${variant}`
    ),
  });
  return newResponse;
}
