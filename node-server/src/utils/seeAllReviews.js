// src/utils/paginationHelper.js

const { getSeeAllReviewsSelector } = require("../services/GeminiAPIService");
const { closePopup } = require("./closePopup");

const seeAllReviews = async (page) => {
  try {
    const seeAllReviewsButtonSelector = 'span.r-view-all[role="button"]';
    let seeAllButton = await page.$(seeAllReviewsButtonSelector);
    const seeAllReviewsButtonHtml1 = await seeAllButton.evaluate(
      (el) => el.outerHTML
    );
    console.log("See All Reviews button HTML1:", seeAllReviewsButtonHtml1);
    // Fetch the "See All Reviews" selector
    const seeAllReviewsSelector = await getSeeAllReviewsSelector(
      page.content()
    );
    console.log("See All Reviews Selector:", seeAllReviewsSelector);

    if (!seeAllButton && !seeAllReviewsSelector) {
      console.warn("No 'See All Reviews' selector found.");
      return; // Exit if no selector is found
    }

    // Wait for the "See All Reviews" button/link to be visible
    if (!seeAllButton) {
      seeAllButton = await page.$(seeAllReviewsSelector);
    }
    if (!seeAllButton) {
      seeAllButton = await page.$(
        `${seeAllReviewsSelector}:has-text("reviews")`
      );
    }

    if (seeAllButton) {
      // Scroll into view if needed
      await seeAllButton.evaluate((btn) => {
        btn.scrollIntoView();
      });

      const seeAllReviewsButtonHtml = await seeAllButton.evaluate(
        (el) => el.outerHTML
      );
      console.log("See All Reviews button HTML:", seeAllReviewsButtonHtml);

      // Attempt to click the "See All Reviews" button/link
      await Promise.race([
        seeAllButton.click(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2000)
        ),
      ]);
      console.log("'See All Reviews' clicked successfully.");

      // Optionally close any popups that appear after clicking
      await closePopup(page);
    }
  } catch (error) {
    console.error("Error during 'See All Reviews' action:", error);
  }
};

module.exports = { seeAllReviews };
