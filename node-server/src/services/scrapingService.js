// src/services/scrapingService.js
const playwright = require("playwright");
const { getCSSSelectors } = require("./GeminiAPIService");
const { handlePagination } = require("../utils/paginationHelper");
const { closePopup } = require("../utils/closePopup");
const { seeAllReviews } = require("../utils/seeAllReviews");
const { cleaningHtml } = require("../utils/cleanHTML");
const { scrollToBottom, closeOverlay } = require("../utils/scrapeHelper");

const scrapeReviews = async (productUrl) => {
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

  const html = await page.content();

  // Get dynamic CSS selectors from OpenAI
  const cssSelectors = await getCSSSelectors(html);
  await closePopup(page);
  console.log("CSS Selectors", cssSelectors);

  if (
    !cssSelectors.reviewSelector ||
    !cssSelectors.titleSelector ||
    !cssSelectors.ratingSelector ||
    !cssSelectors.bodySelector ||
    !cssSelectors.reviewerSelector
  ) {
    console.log("Missing required CSS selectors. Exiting...");
    return null;
  }

  while (true) {
    // Scrape reviews from the current page using the identified CSS selectors
    const pageReviews = await page.$$eval(
      cssSelectors.reviewSelector,
      (reviewElements, selectors) => {
        return reviewElements.map((el) => ({
          title:
            el.querySelector(selectors.titleSelector)?.innerText || "No title",
          body:
            el.querySelector(selectors.bodySelector)?.innerText || "No body",
          rating:
            el.querySelector(selectors.ratingSelector)?.innerText ||
            Number(
              el
                .querySelector(selectors.ratingSelector)
                ?.ariaLabel?.split(" ")[0]
            ) ||
            Number(
              el.querySelector(selectors.ratingSelector)?.title?.split(" ")[0]
            ) ||
            "No rating",
          reviewer:
            el.querySelector(selectors.reviewerSelector)?.innerText ||
            "Anonymous",
        }));
      },
      cssSelectors
    );

    reviews = reviews.concat(pageReviews);
    reviewsCount += pageReviews.length;

    console.log(`Scraped ${pageReviews.length} reviews from this page`);

    // Handle pagination - attempt to navigate to the next page
    const nextPage = await handlePagination(
      page,
      cssSelectors.nextPageSelector,
      cssSelectors.reviewSelector,
      cssSelectors.overlaySelector,
      cssSelectors.closeOverlaySelector,
      paginationInnerTxt.toString()
    );

    if (!nextPage || paginationInnerTxt >= 6) {
      console.log("No more pages to scrape.");
      break; // Exit the loop if there's no next page
    }
    paginationInnerTxt++;
    console.log(
      "Navigating to next page... paginationInnerText: ",
      paginationInnerTxt
    );
  }

  await browser.close();

  return { reviews_count: reviewsCount, reviews };
};

module.exports = { scrapeReviews };
