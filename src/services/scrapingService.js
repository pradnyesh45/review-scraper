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

  // Extract the page's HTML
  const html = await page.content();

  // Get dynamic CSS selectors from OpenAI
  const cssSelectors = await getCSSSelectors(html);
  console.log("CSS Selectors", cssSelectors);

  let reviews = [];
  let reviewsCount = 0;

  // Scrape reviews from the current page using the identified CSS selectors
  // while (true) {
  //   const pageReviews = await page.$$eval(
  //     cssSelectors.reviewSelector,
  //     (reviewElements, selectors) => {
  //       return reviewElements.map((el) => ({
  //         title:
  //           el.querySelector(selectors.titleSelector)?.innerText || "No title",
  //         body:
  //           el.querySelector(selectors.bodySelector)?.innerText || "No body",
  //         rating:
  //           el.querySelector(selectors.ratingSelector)?.innerText ||
  //           "No rating",
  //         reviewer:
  //           el.querySelector(selectors.reviewerSelector)?.innerText ||
  //           "Anonymous",
  //       }));
  //     },
  //     cssSelectors
  //   );
  // finalOutput
  reviews = reviews.concat(cssSelectors);
  reviewsCount += reviews.length;

  // Handle pagination
  // const nextPage = await handlePagination(
  //   page,
  //   cssSelectors.paginationSelector
  // );
  // if (!nextPage) {
  //   break;
  // }
  // }

  await browser.close();

  return { reviews_count: reviewsCount, reviews };
};

module.exports = { scrapeReviews };
