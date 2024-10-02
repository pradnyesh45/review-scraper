# Backend server for review-scraper

## How to run?

- I Hope that you have installed node and cloned the repository as mentioned in projects root level readme file.
- Go to the `node-server` directory in the termianl. Inside `node-server` directory:
- Used command `npm install` to install all the dependencies.
- Create a file name `.env` and fill the information as given in `.env_example`.
- Create a free Gemini API key from https://aistudio.google.com/app/apikey, and paste it in place of `your_gemini_api_key` inside `.env` file.
- We are finished with the setup,
- to run the server type `node src/app.js`.
- Your server will be up and running on port `9000`.

## Examples

- Get API endpoint: http://localhost:9000/api/reviews?page=https://2717recovery.com/products/recovery-cream
- Output:
- `{
    "reviews_count": 5,
    "reviews": [
        {
            "title": "Good product",
            "body": "<p>I have been using it for about a couple of weeks now. So far it has helped my recovery after pickleball. Will submit another review after using it for longer period.</p>",
            "rating": 5,
            "reviewer": "Janie Ma"
        },
        {
            "title": "So far so good",
            "body": "<p>Been using the product for about a week on a hamstring/glute issue that has been an ongoing issue for several months. I have noticed some small improvements and will continue to use to hopefully speed the last of the recovery process. Product smells nice. Hoping for great results with continued use.</p>",
            "rating": 5,
            "reviewer": "Douglas Timmons"
        },
        {
            "title": "",
            "body": "<p>Best customer service team and the best product on the market</p>",
            "rating": 5,
            "reviewer": "Will"
        },
        {
            "title": "I never got my order",
            "body": "<p>I haven't recieved my order yet</p>",
            "rating": 5,
            "reviewer": "Candace Urias"
        },
        {
            "title": "Treatment of joint calcifications (shoulder)",
            "body": "<p>After 3 days of your treatment my discomfort has partially subsided! Hopefully it can continue!  It surely beats suggested surgery! So far!!</p>",
            "rating": 5,
            "reviewer": "Thomas A Pasquinelly"
        }
    ]
}`
