const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function fetchHostawayApi() {
  try {
    const res = await axios.get("https://api.hostaway.com/v1/reviews", {
      params: {
        accountId: process.env.HOSTAWAY_ACCOUNT || 61148,
        apiKey: process.env.HOSTAWAY_API_KEY || "",
      },
    });
    return res.data;
  } catch (err) {
    console.log("Hostaway API failed, fallback to mock:", err.message);
    return null;
  }
}

function loadMockHostawayReviews() {
  const p = path.join(__dirname, "../data/mock-hostaway-reviews.json");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

module.exports = { fetchHostawayApi, loadMockHostawayReviews };
