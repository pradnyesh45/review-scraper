// src/utils/scrapeHelper.js

const scrollToBottom = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
};

const closeOverlay = async (page) => {
  let closeButtonSelectors = [
    `[data-testid="CloseIcon"]`,
    `button.animate-fade-in[aria-disabled="false"]`,
    `button.klaviyo-close-form.kl-private-reset-css-Xuajs1[aria-label="Close dialog"]`,
    ".store-selection-popup--inner .store-selection-popup--close",
    ".MuiSvgIcon-root.MuiSvgIcon-fontSizeInherit",
    `[data-testid="CloseIcon"]`,
    `[data-testid*="Close"]`,
    `button[aria-label="Close dialog"]`,
  ];
  for (const selector of closeButtonSelectors) {
    try {
      const isVisible = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element
          ? element.offsetWidth > 0 || element.offsetHeight > 0
          : false;
      }, selector);

      if (isVisible) {
        // await page.waitForSelector(selector);
        await page.click(selector);
        console.log("clicked close buttonn.....", selector);
        // Wait for the overlay to be removed or hidden
        continue; // Exit the loop after closing the first found overlay
      }
    } catch (error) {
      // Ignore errors (e.g., element not found or not clickable)
      console.warn(`Error handling selector ${selector}: ${error.message}`);
      continue;
    }
  }
};

module.exports = { scrollToBottom, closeOverlay };
