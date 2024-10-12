// import React, { useState } from "react";
// import ReviewForm from "./ReviewForm";

// const ReviewDisplay = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchReviews = async (productUrl) => {
//     setLoading(true);
//     setError(null);

//     try {
//       console.log("productUrl", productUrl);
//       let rootUrl = null;
//       if (process.env.NODE_ENV === "production") {
//         rootUrl =
//           "https://review-scraper-backend.onrender.com/api/reviews?page";
//       } else {
//         rootUrl = "http://localhost:9000/api/reviews?page";
//       }
//       const response = await fetch(
//         `${rootUrl}=${encodeURIComponent(productUrl)}`
//       );
//       console.log("response", response);
//       const data = await response.json();
//       console.log(data);

//       if (response.ok) {
//         setReviews(data.reviews);
//       } else {
//         setError(data.message || "Error fetching reviews.");
//       }
//     } catch (err) {
//       setError("Failed to fetch reviews. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <ReviewForm onSubmit={fetchReviews} />
//       {loading && <p>Loading reviews...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {!loading && !error && reviews.length > 0 && (
//         <div>
//           <h3>Reviews ({reviews.length})</h3>
//           <ul>
//             {reviews.map((review, index) => (
//               <li key={index}>
//                 <h4>{review.title || "No Title"}</h4>
//                 <p>
//                   <strong>Reviewer:</strong> {review.reviewer || "Anonymous"}
//                 </p>
//                 <p>
//                   <strong>Rating:</strong> {review.rating || "No Rating"}
//                 </p>
//                 <p>{review.body || "No Content"}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewDisplay;

import React, { useState } from "react";
import ReviewForm from "./ReviewForm";

const ReviewDisplay = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiVersion, setApiVersion] = useState("v1"); // Track API version

  const fetchReviews = async (productUrl) => {
    setLoading(true);
    setError(null);

    try {
      console.log("productUrl", productUrl);
      let rootUrl = null;

      // Choose the root URL based on environment and API version
      if (process.env.NODE_ENV === "production") {
        rootUrl =
          apiVersion === "v1"
            ? "https://review-scraper-backend.onrender.com/api/reviewsV1?page"
            : "https://review-scraper-backend.onrender.com/api/reviewsV2?page";
      } else {
        rootUrl =
          apiVersion === "v1"
            ? "http://localhost:9000/api/reviewsV1?page"
            : "http://localhost:9000/api/reviewsV2?page";
      }

      const response = await fetch(
        `${rootUrl}=${encodeURIComponent(productUrl)}`
      );
      console.log("response", response);
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setReviews(data.reviews);
      } else {
        setError(data.message || "Error fetching reviews.");
      }
    } catch (err) {
      setError("Failed to fetch reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Select API Version</h2>
      {/* Dropdown to select API version */}
      <select
        value={apiVersion}
        onChange={(e) => setApiVersion(e.target.value)}
      >
        <option value="v1">Version 1</option>
        <option value="v2">Version 2</option>
      </select>

      <ReviewForm onSubmit={fetchReviews} />

      {loading && <p>Loading reviews...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && reviews.length > 0 && (
        <div>
          <h3>Reviews ({reviews.length})</h3>
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <h4>{review.title || "No Title"}</h4>
                <p>
                  <strong>Reviewer:</strong> {review.reviewer || "Anonymous"}
                </p>
                <p>
                  <strong>Rating:</strong> {review.rating || "No Rating"}
                </p>
                <p>{review.body || "No Content"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;
