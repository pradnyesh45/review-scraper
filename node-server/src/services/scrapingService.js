// src/services/scrapingService.js
const playwright = require("playwright");
const { getCSSSelectors } = require("./GeminiAPIService");
const { handlePagination } = require("../utils/paginationHelper");
const { closePopup } = require("../utils/closePopup");
const { seeAllReviews } = require("../utils/seeAllReviews");

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
  await closePopup(page);
  await seeAllReviews(page);

  let reviews = [];
  let reviewsCount = 0;

  // Extract the page's HTML
  // const html = await page.content();

  // Get dynamic CSS selectors from OpenAI
  // const cssSelectors = await getCSSSelectors(html);
  // console.log("CSS Selectors", cssSelectors);

  // reviews = reviews.concat(cssSelectors);
  // reviewsCount += reviews.length;

  while (true) {
    // Extract the page's HTML
    await closePopup(page);
    // await seeAllReviews(page);
    const html = await page.content();

    // Get dynamic CSS selectors from OpenAI
    const cssSelectors = await getCSSSelectors(html);
    // await closePopup(page);
    console.log("CSS Selectors", cssSelectors);

    if (
      !cssSelectors.reviewSelector ||
      !cssSelectors.titleSelector ||
      !cssSelectors.ratingSelector ||
      !cssSelectors.bodySelector ||
      !cssSelectors.reviewerSelector
    ) {
      console.log("Missing required CSS selectors. Exiting...");
      break;
    }

    await closePopup(page);

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
    let paginationInnerTxt = 2;
    const nextPage = await handlePagination(
      page,
      cssSelectors.nextPageSelector,
      cssSelectors.reviewSelector,
      cssSelectors.overlaySelector,
      cssSelectors.closeOverlaySelector,
      paginationInnerTxt
    );

    if (!nextPage) {
      console.log("No more pages to scrape.");
      break; // Exit the loop if there's no next page
    }
    paginationInnerTxt++;
  }

  // // Handle pagination to retrieve reviews from additional pages
  // let hasNextPage = true;

  // while (hasNextPage) {
  //   // Call the helper function to navigate to the next page if available
  //   hasNextPage = await handlePagination(page);

  //   if (hasNextPage) {
  //     console.log("Navigating to next page...");

  //     // Wait for the new page to load
  //     await page.waitForTimeout(3000); // Adjust this timeout as needed

  //     // Extract the new page's HTML and continue scraping reviews
  //     html = await page.content();
  //     cssSelectors = await getCSSSelectors(html);
  //     newReviews = extractReviewsFromPage(page, cssSelectors);

  //     reviews = reviews.concat(newReviews);
  //     reviewsCount += newReviews.length;
  //   }
  // }

  await browser.close();

  return { reviews_count: reviewsCount, reviews };
};

module.exports = { scrapeReviews };
