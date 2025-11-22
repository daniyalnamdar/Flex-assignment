import type { Review } from "../pages/Dashboard";

export function getCategoryAverages(reviews: Review[]) {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  reviews.forEach((r) => {
    Object.entries(r.categories || {}).forEach(([cat, val]) => {
      sums[cat] = (sums[cat] || 0) + val;
      counts[cat] = (counts[cat] || 0) + 1;
    });
  });

  return Object.keys(sums).map((cat) => ({
    category: cat.replaceAll("_", " "),
    rating: +(sums[cat] / counts[cat]).toFixed(2),
  }));
}

export function getTrendByDate(reviews: Review[]) {
  const map = new Map<string, number[]>();

  reviews.forEach((r) => {
    if (r.rating == null) return;
    const day = r.submittedAt?.slice(0, 10);
    if (!day) return;
    map.set(day, [...(map.get(day) || []), r.rating]);
  });

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, arr]) => ({
      day,
      avg: +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2),
      count: arr.length,
    }));
}

export function getRatingDistribution(reviews: Review[]) {
  const buckets = Array.from({ length: 11 }, (_, i) => ({
    rating: i,
    count: 0,
  }));

  reviews.forEach((r) => {
    if (r.rating == null) return;
    const rounded = Math.round(r.rating);
    const idx = Math.min(10, Math.max(0, rounded));
    buckets[idx].count += 1;
  });

  return buckets;
}
