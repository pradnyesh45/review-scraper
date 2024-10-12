// src/utils/paginationHelper.js

const { getClosePopupSelector } = require("../services/GeminiAPIService");

const closePopup = async (page) => {
  let closePopup = true;

  // Loop until there is no popup to close
  while (closePopup) {
    // Generic logic to identify potential popup elements
    const possiblePopupElements = await page.$$(
      "div.popup, section.popup, aside.popup"
    );

    // for (const element of possiblePopupElements) {
    //   const computedStyle = await element.evaluate((el) =>
    //     window.getComputedStyle(el)
    //   );
    //   const zIndex = computedStyle.zIndex || "auto";

    //   // Check for high z-index elements, or elements that look like popups
    //   if (parseInt(zIndex, 10) > 1000) {
    //     console.log("Detected potential popup with high z-index:", zIndex);

    //     // const closeButtons = await element.$$(
    //     //   'button, [aria-label="Close"],[aria-label="Close dialog"], [aria-disabled="false"], .close, .popup-close, .animate-fade-in'
    //     // );
    //     // for (const button of closeButtons) {
    //     //   const closeButtonHtml = await button.evaluate((el) => el.outerHTML);
    //     //   console.log("Close button HTML:", closeButtonHtml);
    //     // try {
    //     //   await Promise.race([
    //     //     button.click(),
    //     //     new Promise((_, reject) =>
    //     //       setTimeout(() => reject(new Error("Timeout")), 5000)
    //     //     ),
    //     //   ]);
    //     //   console.log("Clicked close button.");
    //     // } catch (error) {
    //     //   console.warn("Error clicking close button:", error);
    //     // }

    //     // // Try clicking on any close button within the popup
    //     const closeButton = await element.$(
    //       '[aria-label="Close"], [aria-label="Close Dialog"], .close, .popup-close, button'
    //     );
    //     if (closeButton) {
    //       console.log("Clicking close button.");
    //       try {
    //         await Promise.race([
    //           closeButton.click(),
    //           new Promise((_, reject) =>
    //             setTimeout(() => reject(new Error("Timeout")), 1000)
    //           ),
    //         ]);
    //         console.log("zIndex Popup closed successfully.");
    //       } catch (error) {
    //         console.warn("Error clicking the close button:", error);
    //       }
    //     }
    //   }
    // }

    // Check for ARIA role "dialog" (common for modals)
    const dialogPopup = await page.$('[role="dialog"]');
    // if (dialogPopup) {
    //   console.log("Detected a dialog popup.");
    //   // const closeButtons = await dialogPopup.$$(
    //   //   'button, [aria-label="Close"],[aria-label="Close dialog"], [aria-disabled="false"], .close, .popup-close, .animate-fade-in'
    //   // );
    //   // for (const button of closeButtons) {
    //   //   const closeButtonHtml = await button.evaluate((el) => el.outerHTML);
    //   //   console.log("Close button HTML:", closeButtonHtml);
    //   //   try {
    //   //     await Promise.race([
    //   //       button.click(),
    //   //       new Promise((_, reject) =>
    //   //         setTimeout(() => reject(new Error("Timeout")), 5000)
    //   //       ),
    //   //     ]);
    //   //     console.log("Clicked close button.");
    //   //   } catch (error) {
    //   //     console.warn("Error clicking close button:", error);
    //   //   }
    //   const closeButton = await dialogPopup.$(
    //     '[aria-label="Close dialog"], .close, button, [aria-label="Close"]'
    //   );
    //   if (closeButton) {
    //     console.log("Clicking close button.");
    //     try {
    //       await Promise.race([
    //         closeButton.click(),
    //         new Promise((_, reject) =>
    //           setTimeout(() => reject(new Error("Timeout")), 1000)
    //         ),
    //       ]);
    //       console.log("Dialog Popup closed successfully.");
    //     } catch (error) {
    //       console.warn("Error clicking the close button:", error);
    //     }
    //     console.log("Dialog closed successfully.");
    //   }
    // }

    let closePopupSelector = `div.animate-fade-in[role="button"][tabindex="0"][aria-disabled="false"]`;
    let closeButton = null;

    try {
      closeButton = await new Promise((resolve) => {
        setTimeout(async () => {
          try {
            resolve(await page.$(closePopupSelector, { timeout: 1000 }));
          } catch (error) {
            console.error("Error waiting for first selector:", error);
            resolve(null); // Resolve with null to allow fallback to next selector
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Error during first selector handling:", error);
    }

    if (!closeButton) {
      closePopupSelector = `button.store-selection-popup--close`;

      try {
        closeButton = await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              resolve(await page.$(closePopupSelector));
            } catch (error) {
              console.error("Error waiting for second selector:", error);
              resolve(null); // Resolve with null to allow fallback to next selector
            }
          }, 1000);
        });
      } catch (error) {
        console.error("Error during second selector handling:", error);
      }
    }

    if (!closeButton) {
      closePopupSelector = `div.needsclick[tabindex="0"][arai-label="Close dialog"]`;

      try {
        closeButton = await new Promise((resolve) => {
          setTimeout(async () => {
            try {
              resolve(await page.$(closePopupSelector));
            } catch (error) {
              console.error("Error waiting for third selector:", error);
              resolve(null); // Resolve with null as no more fallback
            }
          }, 1000);
        });
      } catch (error) {
        console.error("Error during third selector handling:", error);
      }
    }
    // Fetch the close popup selector
    if (!closeButton) {
      closePopupSelector = await getClosePopupSelector(page.content());
      console.log("Close Popup Selector:", closePopupSelector);
    }

    if (!closePopupSelector) {
      console.warn("No close popup selector found, exiting loop.");
      break; // Exit loop if no selector is found
    }

    // Check if the close button exists
    if (!closeButton) {
      closeButton = await page.$(closePopupSelector);
    }

    if (closeButton) {
      const closeButtonHtml = await closeButton.evaluate((el) => el.outerHTML);
      console.log("Close button HTML:", closeButtonHtml);
      // Wait for the close button to be clickable
      await closeButton.evaluate((btn) => {
        // Optionally scroll into view if needed
        btn.scrollIntoView();
      });

      try {
        await Promise.race([
          closeButton.click(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 1000)
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
