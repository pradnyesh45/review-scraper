// src/utils/paginationHelper.js
async function handlePagination(page, paginationSelector) {
  const nextPageButton = await page.$(paginationSelector);

  if (nextPageButton) {
    await nextPageButton.click();
    await page.waitForLoadState("domcontentloaded"); // Wait for the next page to load
    return true;
  }

  return false;
}

module.exports = { handlePagination };
