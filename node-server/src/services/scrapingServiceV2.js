// src/services/scrapingService.js
const playwright = require("playwright");
const {
  getCSSSelectors,
  getDirectJsonResponseV2,
  getNextPageSelector,
} = require("./GeminiAPIService");
const { handlePagination } = require("../utils/paginationHelper");
const { closePopup } = require("../utils/closePopup");
const { seeAllReviews } = require("../utils/seeAllReviews");
const { cleaningHtml } = require("../utils/cleanHTML");
const { scrollToBottom, closeOverlay } = require("../utils/scrapeHelper");

const scrapeReviewsV2 = async (productUrl) => {
  console.log("productUrl", productUrl);
  const browser =
    process.env.NODE_ENV === "production"
      ? await playwright.chromium.launch({ headless: true })
      : await playwright.chromium.launch({ headless: false });
  const page = await browser.newPage();
  console.log("Browser opened");

  // Open the product page
  await page.goto(productUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  console.log(`Scraping reviews from ${productUrl}`);
  await scrollToBottom(page);
  setTimeout(() => {}, 10000);
  await closeOverlay(page);
  await closePopup(page);
  await seeAllReviews(page);

  let reviews = [];
  let reviewsCount = 0;

  // Extract the page's HTML

  let paginationInnerTxt = 1;

  while (true) {
    const html = await cleaningHtml(page);
    const jsonResponseOfReviews = await getDirectJsonResponseV2(html);
    await closePopup(page);
    console.log("JSON Response of Reviews", jsonResponseOfReviews);

    reviews = reviews.concat(jsonResponseOfReviews);
    reviewsCount += jsonResponseOfReviews.length;

    console.log(`Scraped ${reviews.length} reviews from this page`);

    // Handle pagination - attempt to navigate to the next page

    const nextPageSelector = await getNextPageSelector(html);
    paginationInnerTxt++;
    const nextPage = await handlePagination(
      page,
      nextPageSelector,
      null,
      null,
      null,
      paginationInnerTxt.toString()
    );

    if (!nextPage || paginationInnerTxt >= 6) {
      console.log("No more pages to scrape.");
      break; // Exit the loop if there's no next page
    }

    console.log(
      "Navigating to next page... paginationInnerText: ",
      paginationInnerTxt
    );
  }
  await browser.close();

  return { reviews_count: reviewsCount, reviews };
};

module.exports = { scrapeReviewsV2 };
