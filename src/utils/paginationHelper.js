// src/utils/paginationHelper.js
async function handlePagination(page, paginationSelector) {
  const nextPageButton = await page.$(paginationSelector);

  if (nextPageButton) {
    await nextPageButton.click();
    await page.waitForTimeout(2000); // Wait for the next page to load
    return true;
  }

  return false;
}

module.exports = { handlePagination };
