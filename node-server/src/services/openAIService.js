// src/services/openAIService.js
const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Gemini API
// const geminiApi = axios.create({
//   baseURL: "https://api.gemini.com/v1", // Update this to the actual base URL of Gemini API
//   headers: {
//     Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
//     "Content-Type": "application/json",
//   },
// });

// const getHtmlOfReviews = (html) => {
//   const $ = cheerio.load(html);
//   const reviews = [];

//   // Find potential review containers using class names or ids that contain 'review'
//   $('[class*="review"], [class*="reviews"]').each((i, elem) => {
//     reviews.push($(elem).html());
//   });

//   return reviews.length ? reviews.join("\n") : null;
// };

exports.getSeeAllReviewsSelector = async (html) => {
  try {
    const prompt = `Here is an HTML snippet:\n${html}\nIdentify the CSS selector for the "See All Reviews" button.
    I want to put it in a variable like seeAllReviewsSelector in JavaScript.`;

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
    I want to put it in a variable like closePopupSelector in JavaScript. It should Ideally be a button element.`;

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
    // Send a prompt to Gemini API to extract the final outcome for reviews

    // const reviews = getHtmlOfReviews(html);
    // // console.log("Reviews", reviews);

    // if (!reviews) {
    //   throw new Error("No relevant 'review' elements found in the HTML.");
    // }
    // const prompt = `From the given html, return a list which
    // contains {title: $titleText, body: bodyText, rating: ratingNumber, reviewer: reviewerText}.
    // Just Return a json format like {[{review1}, {review2}]}.
    // Just strintly json output, consider it as function which
    // returns json and nothing else.
    // Do not explain/add anything extra.
    // Do not return anything else but valid JSON.
    // Html:\n${reviews}`;
    //   const prompt = `
    //   Extract the relevant CSS selectors for pagination from the following HTML:
    //   ${html}

    //   return selectors for review titles, bodies, ratings, and reviewers.
    //   If the context is "pagination", return the selector for the "Next" button.
    // `;

    const prompt = `Here is an HTML snippet:\n${html}\nIdentify the CSS selectors for reviews, titles, body, rating, reviewer, next page, overalay and close button of overlay. 
    I want to put them in variables like reviewSelector, titleSelector, bodySelector, ratingSelector, reviewerSelector, nextPageSelector, overlaySelector, closeOverlaySelector in JavaScript.`;

    // console.log("Prompt", prompt);

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    // console.log("Result text", resultText);
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

    // if (true) {
    //   const newPrompt = `Just return a valid CSS selector which I can put in const nextPageSelector in javascript for HTML: ${html}`;
    //   const newResult = await model.generateContent(newPrompt);
    //   const newResultText = await newResult.response.text();

    //   console.log("New result text:", newResultText); // Log the full result

    //   // Extract the part that contains the actual CSS selector
    //   const selectorMatch = newResultText.match(/'(.*)'/); // Extract the content between single quotes

    //   let nextPageSelector = "";
    //   if (selectorMatch && selectorMatch[1]) {
    //     nextPageSelector = selectorMatch[1]; // Assign the extracted CSS selector
    //   }

    //   // Log the extracted CSS selector
    //   console.log("Assigned nextPageSelector:", nextPageSelector);
    // }

    // const cleanedResult = resultText.match(/\[.*\]/s); // This will extract anything between `[` and `]`
    // console.log("cleanedResult", cleanedResult);

    // if (!cleanedResult) {
    //   throw new Error("Invalid JSON structure received.");
    // }
    // const jsonString = cleanedResult[0];

    // console.log("jsonString: ", jsonString);

    // const resultJson = JSON.parse(jsonString);
    // console.log("resultJson", jsonString);
    // return resultJson;
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
