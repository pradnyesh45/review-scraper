// src/utils/paginationHelper.js

const { getClosePopupSelector } = require("../services/GeminiAPIService");

const closePopup = async (page) => {
  let closePopup = true;

  // Loop until there is no popup to close
  while (closePopup) {
    // Generic logic to identify potential popup elements
    const possiblePopupElements = await page.$$("div, section, aside");

    for (const element of possiblePopupElements) {
      const computedStyle = await element.evaluate((el) =>
        window.getComputedStyle(el)
      );
      const zIndex = computedStyle.zIndex || "auto";

      // Check for high z-index elements, or elements that look like popups
      if (parseInt(zIndex, 10) > 1000) {
        console.log("Detected potential popup with high z-index:", zIndex);

        const closeButtons = await element.$$(
          'button, [aria-label="Close"],[aria-label="Close dialog"], [aria-disabled="false"], .close, .popup-close, .animate-fade-in'
        );
        for (const button of closeButtons) {
          const closeButtonHtml = await button.evaluate((el) => el.outerHTML);
          console.log("Close button HTML:", closeButtonHtml);
          try {
            await Promise.race([
              button.click(),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), 5000)
              ),
            ]);
            console.log("Clicked close button.");
          } catch (error) {
            console.warn("Error clicking close button:", error);
          }

          // // Try clicking on any close button within the popup
          // const closeButton = await element.$(
          //   'button, [aria-label="Close"], [aria-label="Close Dialog"], .close, .popup-close'
          // );
          // if (closeButton) {
          //   console.log("Clicking close button.");
          //   try {
          //     await Promise.race([
          //       closeButton.click(),
          //       new Promise((_, reject) =>
          //         setTimeout(() => reject(new Error("Timeout")), 5000)
          //       ),
          //     ]);
          //     console.log("zIndex Popup closed successfully.");
          //   } catch (error) {
          //     console.warn("Error clicking the close button:", error);
          //   }
        }
      }
    }

    // Check for ARIA role "dialog" (common for modals)
    const dialogPopup = await page.$('[role="dialog"]');
    if (dialogPopup) {
      console.log("Detected a dialog popup.");
      const closeButtons = await dialogPopup.$$(
        'button, [aria-label="Close"],[aria-label="Close dialog"], [aria-disabled="false"], .close, .popup-close, .animate-fade-in'
      );
      for (const button of closeButtons) {
        const closeButtonHtml = await button.evaluate((el) => el.outerHTML);
        console.log("Close button HTML:", closeButtonHtml);
        try {
          await Promise.race([
            button.click(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 5000)
            ),
          ]);
          console.log("Clicked close button.");
        } catch (error) {
          console.warn("Error clicking close button:", error);
        }
        // const closeButton = await dialogPopup.$(
        //   'button, [aria-label="Close dialog"], .close'
        // );
        // if (closeButton) {
        //   console.log("Clicking close button.");
        //   try {
        //     await Promise.race([
        //       closeButton.click(),
        //       new Promise((_, reject) =>
        //         setTimeout(() => reject(new Error("Timeout")), 5000)
        //       ),
        //     ]);
        //     console.log("Dialog Popup closed successfully.");
        //   } catch (error) {
        //     console.warn("Error clicking the close button:", error);
        //   }
        console.log("Dialog closed successfully.");
      }
    }
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
        await Promise.race([
          closeButton.click(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000)
          ),
        ]);
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
