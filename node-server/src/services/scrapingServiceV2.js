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
  // const html = await page.content();

  // Get dynamic CSS selectors from OpenAI
  // const cssSelectors = await getCSSSelectors(html);
  // console.log("CSS Selectors", cssSelectors);

  // reviews = reviews.concat(cssSelectors);
  // reviewsCount += reviews.length;
  let paginationInnerTxt = 1;

  //   const html = await page.content();
  //   const html = await cleaningHtml(page);

  //   // Get dynamic CSS selectors from OpenAI
  //   const jsonResponseOfReviews = await getDirectJsonResponseV2(html);
  //   await closePopup(page);
  //   console.log("JSON Response of Reviews", jsonResponseOfReviews);

  //   reviews = reviews.concat(jsonResponseOfReviews);
  //   reviewsCount += reviews.length;

  while (true) {
    const html = await cleaningHtml(page);
    const jsonResponseOfReviews = await getDirectJsonResponseV2(html);
    await closePopup(page);
    console.log("JSON Response of Reviews", jsonResponseOfReviews);

    reviews = reviews.concat(jsonResponseOfReviews);
    reviewsCount += jsonResponseOfReviews.length;

    // Extract the page's HTML
    // await closePopup(page);
    // await seeAllReviews(page);
    // const html = await page.content();
    // // const html = await cleaningHtml(page);

    // // Get dynamic CSS selectors from OpenAI
    // const cssSelectors = await getCSSSelectors(html);
    // await closePopup(page);
    // console.log("CSS Selectors", cssSelectors);

    // if (
    //   !cssSelectors.reviewSelector ||
    //   !cssSelectors.titleSelector ||
    //   !cssSelectors.ratingSelector ||
    //   !cssSelectors.bodySelector ||
    //   !cssSelectors.reviewerSelector
    // ) {
    //   console.log("Missing required CSS selectors. Exiting...");
    //   break;
    // }

    // await closePopup(page);

    // Scrape reviews from the current page using the identified CSS selectors
    // const pageReviews = await page.$$eval(
    //   cssSelectors.reviewSelector,
    //   (reviewElements, selectors) => {
    //     return reviewElements.map((el) => ({
    //       title:
    //         el.querySelector(selectors.titleSelector)?.innerText || "No title",
    //       body:
    //         el.querySelector(selectors.bodySelector)?.innerText || "No body",
    //       rating:
    //         el.querySelector(selectors.ratingSelector)?.innerText ||
    //         Number(
    //           el
    //             .querySelector(selectors.ratingSelector)
    //             ?.ariaLabel?.split(" ")[0]
    //         ) ||
    //         Number(
    //           el.querySelector(selectors.ratingSelector)?.title?.split(" ")[0]
    //         ) ||
    //         "No rating",
    //       reviewer:
    //         el.querySelector(selectors.reviewerSelector)?.innerText ||
    //         "Anonymous",
    //     }));
    //   },
    //   cssSelectors
    // );

    // reviews = reviews.concat(pageReviews);
    // reviewsCount += pageReviews.length;

    console.log(`Scraped ${reviews.length} reviews from this page`);

    // Handle pagination - attempt to navigate to the next page
    // let paginationInnerTxt = 2;
    // const reviewsHtml = getHtmlOfReviewsV2(html);
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
};

module.exports = { scrapeReviewsV2 };
