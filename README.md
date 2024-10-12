# The project consists of 2 parts:

1. node-server
2. react-client

# Note

- Inside each folder, I have mentioned the steps to run them in their own readme files.
- First you should start the node-server, then run the react-client.
- Project is also deployed.
- I have restricted to scrape only max of 5 pages to decrease the response time.

# Features implemented

- Used Node js for backend and React js for frontend.
- Used LLM provided by Gemini API to get the required information, not used OpenAI API as it wasn't accepting my debit card for payments.
- Used Playwright to get the html of websites.
- Handles Pagination.
- Project is deployed.
- React website is deployed using Vercel: https://review-scraper-client.vercel.app/
- NodeJS Backend is deployed using Render: https://review-scraper-backend.onrender.com/
- I have create two version V1(uses LLM to identify css selectors from html) and V2(uses LLM to give json response directly from html elements)
- More details are provided in the node-server readme.

# How to run?

- Make sure you have Node installed on your computer.
- Clone the repository into your local computer.
- Follow the steps given in readme files of node-server & react-client.
- We will run node-server on port 9000 and react-client on port 3000.
- Or you can access the deployed version from this link: https://review-scraper-client.vercel.app/
