// src/utils/paginationHelper.js

const { getClosePopupSelector } = require("../services/openAIService");

const closePopup = async (page) => {
  let closePopup = true;

  // Loop until there is no popup to close
  while (closePopup) {
    // Fetch the close popup selector
    const closePopupSelector = await getClosePopupSelector(page.content());
    console.log("Close Popup Selector:", closePopupSelector);

    if (!closePopupSelector) {
      console.warn("No close popup selector found, exiting loop.");
      break; // Exit loop if no selector is found
    }

    // Check if the close button exists
    const closeButton = await page.$(closePopupSelector);

    if (closeButton) {
      // Wait for the close button to be clickable
      await closeButton.evaluate((btn) => {
        // Optionally scroll into view if needed
        btn.scrollIntoView();
      });

      try {
        await closeButton.click();
        console.log("Popup closed successfully.");
      } catch (error) {
        console.error("Error clicking the close button:", error);
      }
    } else {
      closePopup = false; // No close button found, exit the loop
    }
  }
};

module.exports = { closePopup };
