import { useEffect, useState, useMemo } from "react";
import { api } from "../api/client";

import Filters from "../components/Filters";
import ReviewTable from "../components/ReviewTable";

import CategoryRadar from "../components/charts/CategoryRadar";
import RatingTrend from "../components/charts/RatingTrend";
import RatingDistribution from "../components/charts/RatingDistribution";

import {
  getCategoryAverages,
  getTrendByDate,
  getRatingDistribution,
} from "../utils/reviewStats";

export type Review = {
  reviewId: string;
  listingName: string;
  guestName: string;
  rating: number | null;
  categories: Record<string, number>;
  channel: string;
  type: string;
  submittedAt: string;
  publicText: string;
  approved: boolean;
};

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [minRating, setMinRating] = useState(0);
  const [channel, setChannel] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clean = (v: any) =>
    v === "" || v === null || v === undefined || Number.isNaN(v)
      ? undefined
      : v;

  // ---------------------------------------------------
  // SINGLE, STABLE loadReviews (no useCallback needed)
  // ---------------------------------------------------
  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const params = {
        minRating: clean(minRating),
        channel: clean(channel),
        type: clean(type),
      };

      let merged: Review[] = [];

      // --- Hostaway First ---
      try {
        const host = await api.get("/api/reviews/hostaway", { params });
        merged = [...(host.data.data || [])];
      } catch (err) {
        console.error("Hostaway error:", err);
        setError("Failed to load Hostaway reviews");
      }

      // --- Google Reviews (optional, never breaks UI) ---
      try {
        const placeId =
          import.meta.env.VITE_GOOGLE_PLACE_ID || "ChIJiUhqCF1zpEcRv3WL1IEAlyM";

        const google = await api.get("/api/reviews/google", {
          params: { placeId },
        });

        if (google.data.status === "success") {
          let googleReviews = google.data.data;

          googleReviews = googleReviews.filter((r: Review) => {
            if (minRating && r.rating != null && r.rating < minRating)
              return false;
            if (channel && r.channel !== channel) return false;
            if (type && r.type !== type) return false;
            return true;
          });

          merged = [...merged, ...googleReviews];
        }
      } catch (err) {
        console.warn("Google fetch failed, continuing gracefully.");
      }

      setReviews(merged);
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------
  // Reload automatically when filters change
  // ---------------------------------------------------
  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line
  }, [minRating, channel, type]);

  // ---------------------------------------------------
  // Stats
  // ---------------------------------------------------
  const avgRating = useMemo(() => {
    const rated = reviews.filter((r) => r.rating != null);
    if (!rated.length) return "0.0";
    return (
      rated.reduce((a, b) => a + (b.rating || 0), 0) / rated.length
    ).toFixed(1);
  }, [reviews]);

  const pending = useMemo(
    () => reviews.filter((r) => !r.approved).length,
    [reviews]
  );

  const listings = useMemo(() => {
    const map = new Map<string, Review[]>();
    reviews.forEach((r) => {
      if (!map.has(r.listingName)) map.set(r.listingName, []);
      map.get(r.listingName)!.push(r);
    });

    return [...map.entries()];
  }, [reviews]);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      {/* HEADER */}
      <div className="sticky top-0 bg-white/75 border-b border-stone-200 backdrop-blur p-4 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-700 font-bold rounded-xl grid place-items-center shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-xl font-bold">Flex Living</h1>
              <p className="text-xs text-slate-500">Review Manager</p>
            </div>
          </div>

          <button
            onClick={loadReviews}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 active:scale-[0.97] transition"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label="Average Rating" value={avgRating} />
          <Stat label="Total Reviews" value={reviews.length} />
          <Stat label="Pending Approval" value={pending} />
        </div>

        {/* Filters */}
        <Filters
          minRating={minRating}
          setMinRating={setMinRating}
          channel={channel}
          setChannel={setChannel}
          type={type}
          setType={setType}
          loading={loading}
        />

        {error && (
          <div className="bg-rose-50 border border-rose-300 text-rose-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {listings.map(([name, items]) => (
          <section
            key={name}
            className="bg-white p-5 border border-stone-200 rounded-2xl shadow-soft space-y-6"
          >
            <header className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{name}</h2>
              <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-semibold">
                {items.length} reviews
              </span>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CategoryRadar data={getCategoryAverages(items)} />
              <RatingTrend data={getTrendByDate(items)} />
              <RatingDistribution data={getRatingDistribution(items)} />
            </div>

            <div className="pt-4 border-t border-stone-200">
              <ReviewTable reviews={items} onChange={loadReviews} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-soft hover:shadow-cozy transition">
      <p className="text-xs text-slate-500 uppercase font-semibold">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
    </div>
  );
}
