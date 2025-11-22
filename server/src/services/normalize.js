function normalizeHostawayReviews(raw, approvedIds = []) {
  const result = raw?.result ?? [];

  return result.map((r) => {
    const categories = {};
    (r.reviewCategory ?? []).forEach((c) => {
      categories[c.category] = c.rating;
    });

    let rating = r.rating;
    if (rating == null) {
      const vals = Object.values(categories);
      rating = vals.length
        ? vals.reduce((a, b) => a + b, 0) / vals.length / 2
        : null;
    }

    return {
      reviewId: String(r.id),
      listingName: r.listingName ?? "Unknown listing",
      guestName: r.guestName ?? "Anonymous",
      type: r.type ?? "guest-to-host",
      status: r.status ?? "unknown",
      channel: (r.channel ?? "hostaway").toLowerCase(),
      submittedAt: r.submittedAt,
      publicText: r.publicReview ?? "",
      rating,
      categories,
      approved: approvedIds.includes(String(r.id)),
    };
  });
}

module.exports = { normalizeHostawayReviews };
