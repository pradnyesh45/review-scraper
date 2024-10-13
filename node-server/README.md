# Backend server for review-scraper

## How to run?

- I Hope that you have installed node and cloned the repository as mentioned in projects root level readme file.
- Go to the `node-server` directory in the termianl. Inside `node-server` directory:
- Use command `npm install` to install all the dependencies.
- Create a file name `.env` and fill the information as given in `.env_example`.
- Create a free Gemini API key from https://aistudio.google.com/app/apikey, and paste it in place of `your_gemini_api_key` inside `.env` file.
- We are finished with the setup,
- to run the server type `node src/app.js`.
- Your server will be up and running on port `9000`.
- Alternatively, you can access the backend api through: https://review-scraper-backend.onrender.com/

## What are V1 and V2 versions?

### V1 Version

- Uses LLM to identify the CSS selectors, then uses these CSS selectors to identify the required texts like reviewer, title, rating, etc.
- Diagram: https://drive.google.com/file/d/12y5vK0lrdH4cpCVPxo0P2PIbuJW-Hz4k/view?usp=sharing

### V2 Version

- Used LLM to give the json response from the html provided in the prompt.
- Diagram: https://drive.google.com/file/d/1RU26CxCyMDOtwNa7I_ZXydo0SZ9ASYVF/view?usp=sharing

## V1 vs V2. Which are the differences.

- V2 is comparitively more better for generic websites as it just requires the right html elements and LLM will do the job of providing the required json output.
- V2 was comparitively easier to implement and was my initial approach until I read the assignment document again and decided to pivot.
- In V2, Gemini API might sometimes block the prompt request due to SAFETY concerns while I haven't encountered any such issue with V1 yet.
- In terms of using the api's, one just need to change V1 to V2 and vise-verca in the api url like this,
- http://localhost:9000/api/reviewsV1?page=url
- http://localhost:9000/api/reviewsV2?page=url

## Examples

- Localhost V1 version, Notice the API endpoint reveiwsV1(localhost)
- Output: ![Backend Localhost V1 Version](./images/localhost%20reviews%20V1.png)

- Localhost V2 version, Notice the API endpoint reveiwsV2(localhost)
- Here, [GoogleGenerativeAI Error]: Candidate was blocked due to SAFETY. Hence, only 10 are showing currently(happens sometimes)
- Output: ![Backend Localhost V2 Version](./images/localhost%20reviews%20V2.png)

- Deployed backend V1 version, Notice the version V1 and url(deployed backend)
- Output: ![Backend Deployed V1 Version](./images/hosted%20reviews%20V1.png)

## Issues(Important)

- On 13th oct, I am not able to make requests on backend hosted on render. Its giving timeout on page.goto, but yesterday(12th oct) it was woring fine. Even though its working in the local setup.
- Output: ![Render browser issue](./images/Render%20playwright%20issue.png)

- Sometimes, it gives 502 Bad Request. I think it is because I am on a free tier. It might improve if I shift to a paid instance.
- Output: ![Render 502 Bad Request](./images/Render%20502%20bad%20request.png)
