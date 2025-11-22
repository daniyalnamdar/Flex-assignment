const express = require("express");
const fs = require("fs");
const path = require("path");

const {
  fetchHostawayApi,
  loadMockHostawayReviews,
} = require("../services/hostaway");

const { fetchGoogleReviews } = require("../services/google");
const { normalizeHostawayReviews } = require("../services/normalize");

const router = express.Router();

/* ---------------------------------------------------------
   Helpers: read/write approved IDs
----------------------------------------------------------*/
function readApprovedIds() {
  const p = path.join(__dirname, "../data/approved.json");
  if (!fs.existsSync(p)) return [];
  try {
    const json = JSON.parse(fs.readFileSync(p, "utf8"));
    return json.approvedReviewIds ?? [];
  } catch {
    return [];
  }
}

function writeApprovedIds(ids) {
  const p = path.join(__dirname, "../data/approved.json");
  fs.writeFileSync(p, JSON.stringify({ approvedReviewIds: ids }, null, 2));
}

/* ---------------------------------------------------------
   GET /api/reviews/hostaway
----------------------------------------------------------*/
router.get("/hostaway", async (req, res) => {
  let raw = await fetchHostawayApi();

  // Always fallback to mock if real Hostaway returns empty
  if (!raw || !raw.result || raw.result.length === 0) {
    raw = loadMockHostawayReviews();
  }

  const approvedIds = readApprovedIds();
  let normalized = normalizeHostawayReviews(raw, approvedIds);

  // Backend filtering applied (important)
  const { minRating, channel, type } = req.query;

  if (minRating) {
    const min = Number(minRating);
    normalized = normalized.filter((r) => r.rating != null && r.rating >= min);
  }

  if (channel) {
    normalized = normalized.filter(
      (r) => r.channel?.toLowerCase() === channel.toLowerCase()
    );
  }

  if (type) {
    normalized = normalized.filter((r) => r.type === type);
  }

  return res.json({
    status: "success",
    count: normalized.length,
    data: normalized,
    source: raw && Array.isArray(raw.result) ? "hostaway" : "mock", // FIXED
  });
});

/* ---------------------------------------------------------
   POST /api/reviews/approve/:id
----------------------------------------------------------*/
router.post("/approve/:id", (req, res) => {
  const id = String(req.params.id);
  const { approved } = req.body;

  const ids = new Set(readApprovedIds());

  if (approved) ids.add(id);
  else ids.delete(id);

  writeApprovedIds([...ids]);

  return res.json({
    status: "success",
    reviewId: id,
    approved,
  });
});

/* ---------------------------------------------------------
   GET /api/reviews/google
----------------------------------------------------------*/
router.get("/google", async (req, res) => {
  const { placeId } = req.query;

  let data;
  try {
    data = await fetchGoogleReviews(placeId);
  } catch (err) {
    return res.json({
      status: "failed",
      google_integration: false,
      reason: err.message,
    });
  }

  if (!data.ok) {
    return res.json({
      status: "failed",
      google_integration: false,
      reason: data.reason,
    });
  }

  const normalized = (data.reviews || []).map((r, idx) => ({
    reviewId: `google-${idx}-${r.time}`,
    listingName: data.placeName || "Google Place",
    guestName: r.author_name || "Google User",
    type: "guest-to-host",
    status: "published",
    channel: "google",
    submittedAt: new Date((r.time || 0) * 1000).toISOString().slice(0, 10),
    publicText: r.text || "",
    rating: r.rating || null,
    categories: {},
    approved: false,
  }));

  return res.json({
    status: "success",
    count: normalized.length,
    data: normalized,
  });
});

module.exports = router;
