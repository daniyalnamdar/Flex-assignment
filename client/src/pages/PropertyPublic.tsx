import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Review } from "./Dashboard";

export default function PropertyPublic() {
  const { name } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;

    setLoading(true);

    api
      .get("/api/reviews/hostaway")
      .then((res) => {
        const all = res.data.data as Review[];
        const filtered = all.filter(
          (r) =>
            r.approved &&
            r.listingName.trim().toLowerCase() === name.trim().toLowerCase()
        );

        setReviews(filtered);
      })
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-stone-200 p-4 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            {name || "Property"}
          </h1>

          <a
            href="/"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            Back to Dashboard
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Hero Placeholder */}
        <div className="h-56 rounded-2xl bg-stone-300 shadow-soft mb-6" />

        {/* Reviews Section */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-soft p-5">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Guest Reviews
          </h2>

          {loading && (
            <p className="text-sm text-slate-500">Loading reviews…</p>
          )}

          {!loading && reviews.length === 0 && (
            <p className="text-sm text-slate-500">No approved reviews yet.</p>
          )}

          <div className="flex flex-col gap-4 mt-4">
            {reviews.map((r) => (
              <div
                key={r.reviewId}
                className="bg-stone-50 border border-stone-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-slate-900">{r.guestName}</p>
                  <span className="text-sm text-slate-500">
                    {r.submittedAt?.slice(0, 10)}
                  </span>
                </div>

                <p className="mt-2 text-slate-700 leading-relaxed">
                  {r.publicText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
