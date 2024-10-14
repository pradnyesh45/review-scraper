// src/services/openAIService.js
const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.getSeeAllReviewsSelector = async (html) => {
  try {
    const prompt = `Here is an HTML snippet:\n${html}\nIdentify the CSS selector for the text "See All Reviews" or "See more reviews"button.
    I want to put it in a variable like seeAllReviewsSelector in JavaScript. Don't return any comments or explanations, just the selector.`;

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();

    const seeAllReviewsSelectorMatch = resultText.match(
      /seeAllReviewsSelector\s*=\s*'(.*)'/
    );

    const seeAllReviewsSelector = seeAllReviewsSelectorMatch
      ? seeAllReviewsSelectorMatch[1]
      : "";

    console.log("See All Reviews Selector:", seeAllReviewsSelector);

    return seeAllReviewsSelector;
  } catch (error) {
    console.error("Error fetching see all reviews selector:", error.message);
    // throw new Error("Failed to identify see all reviews selector");
  }
};

exports.getClosePopupSelector = async (html) => {
  try {
    const prompt = `Here is an HTML snippet:\n${html}\nIdentify the CSS selector for the close button of the popup overlay. 
    I want to put it in a variable like closePopupSelector in JavaScript. It should Ideally be a button element. Don't return any comments or explanations, just the selector.`;

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();

    const closePopupSelectorMatch = resultText.match(
      /closePopupSelector\s*=\s*'(.*)'/
    );

    const closePopupSelector = closePopupSelectorMatch
      ? closePopupSelectorMatch[1]
      : "";

    console.log("Close Popup Selector:", closePopupSelector);

    return closePopupSelector;
  } catch (error) {
    console.error("Error fetching close popup selector:", error.message);
    // throw new Error("Failed to identify close popup selector");
  }
};

exports.getCSSSelectors = async (html) => {
  try {
    const prompt = `Here is an HTML snippet:\n${html}\nIdentify the CSS selectors for reviews, titles, body, rating, reviewer, next page(the selector which have inner text like 1, 2, 3... so on), overalay and close button of overlay. 
    I want to put them in variables like reviewSelector, titleSelector, bodySelector, ratingSelector, reviewerSelector, nextPageSelector, overlaySelector, closeOverlaySelector in JavaScript.
    Don't return any comments or explanations, just the selectors.`;

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    console.log("Result text", resultText);
    // Extract the CSS selectors from the response text (assuming it's formatted like JS code)
    const reviewSelectorMatch = resultText.match(/reviewSelector\s*=\s*'(.*)'/);
    const titleSelectorMatch = resultText.match(/titleSelector\s*=\s*'(.*)'/);
    const bodySelectorMatch = resultText.match(/bodySelector\s*=\s*'(.*)'/);
    const ratingSelectorMatch = resultText.match(/ratingSelector\s*=\s*'(.*)'/);
    const reviewerSelectorMatch = resultText.match(
      /reviewerSelector\s*=\s*'(.*)'/
    );
    const nextPageSelectorMatch = resultText.match(
      /nextPageSelector\s*=\s*'(.*)'/
    );
    const overlaySelectorMatch = resultText.match(
      /overlaySelector\s*=\s*'(.*)'/
    );
    const closeOverlaySelectorMatch = resultText.match(
      /closeOverlaySelector\s*=\s*'(.*)'/
    );

    // Assign the extracted CSS selectors to variables
    const reviewSelector = reviewSelectorMatch ? reviewSelectorMatch[1] : "";
    const titleSelector = titleSelectorMatch ? titleSelectorMatch[1] : "";
    const bodySelector = bodySelectorMatch ? bodySelectorMatch[1] : "";
    const ratingSelector = ratingSelectorMatch ? ratingSelectorMatch[1] : "";
    const reviewerSelector = reviewerSelectorMatch
      ? reviewerSelectorMatch[1]
      : "";
    const nextPageSelector = nextPageSelectorMatch
      ? nextPageSelectorMatch[1]
      : "";
    const overlaySelector = overlaySelectorMatch ? overlaySelectorMatch[1] : "";
    const closeOverlaySelector = closeOverlaySelectorMatch
      ? closeOverlaySelectorMatch[1]
      : "";

    // Log the selectors to verify they were extracted correctly
    console.log("Review Selector:", reviewSelector);
    console.log("Title Selector:", titleSelector);
    console.log("Body Selector:", bodySelector);
    console.log("Rating Selector:", ratingSelector);
    console.log("Reviewer Selector:", reviewerSelector);
    console.log("Next Page Selector:", nextPageSelector);
    console.log("Overlay Selector:", overlaySelector);
    console.log("Close Overlay Selector:", closeOverlaySelector);

    return {
      reviewSelector,
      titleSelector,
      bodySelector,
      ratingSelector,
      reviewerSelector,
      nextPageSelector,
      overlaySelector,
      closeOverlaySelector,
    };
  } catch (error) {
    console.error("Error fetching result in Json format:", error.message);
    throw new Error("Failed to identify CSS selectors");
  }
};

const getHtmlOfReviewsV2 = (html) => {
  const $ = cheerio.load(html);
  const reviews = [];

  $(
    '[class*="jdgm-rev-widg__body"], [class*="yotpo-reviews-container"], [class*="ElementsWidget__list"], [class*="review-views"], [class*="review"], [class*="reviews"]'
  ).each((i, elem) => {
    reviews.push($(elem).html());
  });
  return reviews.length ? reviews.join("\n") : null;
};

exports.getDirectJsonResponseV2 = async (html) => {
  try {
    // Send a prompt to Gemini API to extract the final outcome for reviews
    const reviews = getHtmlOfReviewsV2(html);
    if (!reviews) {
      throw new Error("No relevant 'review' elements found in the HTML.");
    }
    const prompt = `From the given html, return a list which 
    contains {title: $titleText, body: bodyText, rating: ratingNumber, reviewer: reviewerText}. 
    Just Return a json format like {[{review1}, {review2}]}. 
    Just strintly json output, consider it as function which 
    returns json and nothing else. 
    Do not explain/add anything extra.
    Do not return anything else but valid JSON.
    Html:\n${reviews}`;
    const result = await model.generateContent(prompt);
    let resultText = result.response.text();

    // Ensure we're only working with valid JSON
    resultText = resultText.trim();

    // Remove any non-JSON parts (e.g., markdown code block indicators like "```json")
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "");

    // Try to extract and parse the JSON
    try {
      const cleanedResult = resultText.match(/\[.*\]/s);
      if (!cleanedResult) {
        throw new Error("No valid JSON array structure found in response.");
      }
      const jsonString = cleanedResult[0];
      const resultJson = JSON.parse(jsonString);
      return resultJson;
    } catch (jsonParseError) {
      console.error(
        "Error parsing JSON:",
        jsonParseError.message,
        "Original response:",
        resultText
      );
      throw new Error("Invalid JSON structure received.");
    }
  } catch (error) {
    console.error("Error fetching result in Json format:", error.message);
    throw new Error("Failed to identify CSS selectors");
  }
};

exports.getNextPageSelector = async (html) => {
  try {
    const reviews = getHtmlOfReviewsV2(html);
    if (!reviews) {
      throw new Error("No relevant 'review' elements found in the HTML.");
    }
    const prompt = `Here is an HTML snippet:\n${reviews}\nIdentify the CSS selector for the button which will get us to the Next page of Reviews.
    I want to put it in a variable like nextPageSelector in JavaScript. Don't return any comments or explanations, just the selector.`;

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    console.log("Result text", resultText);
    let nextPageSelector = "";
    if (resultText.includes("=")) {
      const nextPageSelectorMatch = resultText.match(
        /nextPageSelector\s*=\s*["'](.*)["']/
      );

      nextPageSelector = nextPageSelectorMatch ? nextPageSelectorMatch[1] : "";
    } else {
      nextPageSelector = resultText;
    }

    console.log("Next Page Selector:", nextPageSelector);

    return nextPageSelector;
  } catch (error) {
    console.error("Error fetching next page selector:", error.message);
    // throw new Error("Failed to identify close popup selector");
  }
};
