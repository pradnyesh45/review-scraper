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

const getHtmlOfReviews = (html) => {
  const $ = cheerio.load(html);
  const reviews = [];

  // Find potential review containers using class names or ids that contain 'review'
  $('[class*="review"], [class*="reviews"]').each((i, elem) => {
    reviews.push($(elem).html());
  });

  return reviews.length ? reviews.join("\n") : null;
};

exports.getCSSSelectors = async (html) => {
  try {
    // Send a prompt to Gemini API to extract the final outcome for reviews

    const reviews = getHtmlOfReviews(html);
    // console.log("Reviews", reviews);

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

    console.log("Prompt", prompt);

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();

    const cleanedResult = resultText.match(/\[.*\]/s); // This will extract anything between `[` and `]`

    if (!cleanedResult) {
      throw new Error("Invalid JSON structure received.");
    }
    const jsonString = cleanedResult[0];

    console.log("jsonString: ", jsonString);

    const resultJson = JSON.parse(resultText);
    return resultJson;
  } catch (error) {
    console.error("Error fetching result in Json format:", error.message);
    throw new Error("Failed to identify CSS selectors");
  }
};
