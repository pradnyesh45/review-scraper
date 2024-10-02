// src/services/scrapingService.js
const playwright = require("playwright");
const { getCSSSelectors } = require("./openAIService");
const { handlePagination } = require("../utils/paginationHelper");

const scrapeReviews = async (productUrl) => {
  console.log("productUrl", productUrl);
  const browser = await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  console.log("Browser opened");

  // Open the product page
  await page.goto(productUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  console.log(`Scraping reviews from ${productUrl}`);

  let reviews = [];
  let reviewsCount = 0;

  // Extract the page's HTML
  const html = await page.content();

  // Get dynamic CSS selectors from OpenAI
  const cssSelectors = await getCSSSelectors(html);
  console.log("CSS Selectors", cssSelectors);

  reviews = reviews.concat(cssSelectors);
  reviewsCount += reviews.length;

  await browser.close();

  return { reviews_count: reviewsCount, reviews };
};

module.exports = { scrapeReviews };
