// src/utils/paginationHelper.js

const { getSeeAllReviewsSelector } = require("../services/openAIService");

const seeAllReviews = async (page) => {
  try {
    // Fetch the "See All Reviews" selector
    const seeAllReviewsSelector = await getSeeAllReviewsSelector(
      page.content()
    );
    console.log("See All Reviews Selector:", seeAllReviewsSelector);

    if (!seeAllReviewsSelector) {
      console.warn("No 'See All Reviews' selector found.");
      return; // Exit if no selector is found
    }

    // Wait for the "See All Reviews" button/link to be visible
    const seeAllButton = await page.waitForSelector(seeAllReviewsSelector, {
      visible: true,
    });

    if (seeAllButton) {
      // Scroll into view if needed
      await seeAllButton.evaluate((btn) => {
        btn.scrollIntoView();
      });

      // Attempt to click the "See All Reviews" button/link
      await seeAllButton.click();
      console.log("'See All Reviews' clicked successfully.");

      // Optionally close any popups that appear after clicking
      await closePopup(page);
    }
  } catch (error) {
    console.error("Error during 'See All Reviews' action:", error);
  }
};

module.exports = { seeAllReviews };
