const cheerio = require("cheerio");

const cleaningHtml = async (page) => {
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent);

  // Remove all <script> and <style> tags
  $("script").remove();
  $("style").remove();
  $("img").remove();

  // Optionally remove other unwanted elements (e.g., ads, popups)
  $(".ad").remove(); // Example class for ads
  $(".popup").remove(); // Example class for popups

  // Return the cleaned HTML
  const cleanedHtml = $.html().replace(/\s\s+/g, " ").replace(/\n/g, "").trim();

  return cleanedHtml;
};

module.exports = { cleaningHtml };
