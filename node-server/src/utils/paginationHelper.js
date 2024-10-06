// src/utils/paginationHelper.js

const playwright = require("playwright");
const { closePopup } = require("./closePopup");
const handlePagination = async (
  page,
  nextPageSelector,
  nextPageLoadedSelector,
  overlaySelector,
  closeButtonSelector
) => {
  // Example for handling pagination with a "Next" button
  try {
    // Check if any overlay exists
    // const overlay = await page.$(overlaySelector);
    // if (overlay) {
    //   console.log("Overlay detected, attempting to close it...");

    //   // Try clicking the close button if it exists
    //   const closeButton = await page.$(closeButtonSelector);
    //   if (closeButton) {
    //     await closeButton.click();
    //     console.log("Overlay closed.");
    //   } else {
    //     console.log(
    //       "No close button found. Waiting for overlay to disappear..."
    //     );
    //     await page.waitForFunction(
    //       (selector) => {
    //         const el = document.querySelector(selector);
    //         return el === null || el.style.display === "none";
    //       },
    //       {},
    //       overlaySelector
    //     );
    //     console.log("Overlay has disappeared.");
    //   }
    // }

    await closePopup(page);

    const nextButton = await page.$(nextPageSelector); // Adjust this selector as per the page
    // console.log("Next button found:", nextButton);
    if (nextButton) {
      const isDisabled = await page.evaluate(
        (button) => button.disabled,
        nextButton
      );

      if (!isDisabled) {
        await nextButton.click();
        console.log("Navigating to next page...");

        // Wait for the next page's content to load
        await page.waitForSelector(nextPageLoadedSelector, {
          timeout: 10000,
          visible: true,
        });

        console.log("Next page loaded successfully.");
        return true;
      } else {
        console.log("Next button is disabled. No more pages.");
        return false;
      }
    } else {
      console.log("No Next button found. End of pagination.");
      return false;
    }
  } catch (error) {
    console.error("Error during pagination:", error);
    return false;
  }
};

module.exports = { handlePagination };
