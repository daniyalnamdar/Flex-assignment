const axios = require("axios");

async function fetchGoogleReviews(placeId) {
  const key = process.env.GOOGLE_PLACES_KEY;

  if (!key) {
    return { ok: false, reason: "GOOGLE_PLACES_KEY missing" };
  }

  if (!placeId) {
    return { ok: false, reason: "placeId missing" };
  }

  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: "reviews,name,rating",
          key,
        },
      }
    );

    const place = res.data?.result;

    return {
      ok: true,
      placeName: place?.name,
      rating: place?.rating,
      reviews: place?.reviews || [],
    };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

module.exports = { fetchGoogleReviews };
