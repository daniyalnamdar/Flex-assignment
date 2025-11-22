import { useState } from "react";
import { api } from "../api/client";
import type { Review } from "../pages/Dashboard";

export default function ReviewTable({
  reviews,
  onChange,
}: {
  reviews: Review[];
  onChange: () => Promise<void>;
}) {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleApprove(r: Review) {
    try {
      setApprovingId(r.reviewId);
      setError(null);

      await api.post(`/api/reviews/approve/${r.reviewId}`, {
        approved: !r.approved,
      });

      await onChange();
    } catch (err) {
      console.error("Approve error:", err);
      setError("Failed to save changes.");
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2 rounded-lg text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {reviews.map((r) => {
        const isApproving = approvingId === r.reviewId;

        return (
          <div
            key={r.reviewId}
            className="border border-stone-100 bg-white rounded-xl2 shadow-soft p-4 flex flex-col sm:flex-row justify-between items-start gap-4 hover:shadow-cozy transition"
          >
            <div className="flex-1 w-full">
              {/* Row 1 */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <p className="font-semibold text-slate-900">{r.guestName}</p>

                <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-slate-600 border border-stone-200 uppercase tracking-wide font-bold">
                  {r.channel}
                </span>

                <span className="text-sm text-slate-500">
                  {r.submittedAt?.slice(0, 10)}
                </span>
              </div>

              {/* Public text */}
              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{r.publicText}"
              </p>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-slate-600">
                  Rating:{" "}
                  <b
                    className={`${
                      (r.rating || 0) >= 9
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {r.rating ?? "N/A"}
                  </b>
                </span>

                {r.approved && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    ✓ Live on Website
                  </span>
                )}
              </div>
            </div>

            {/* Approve Button */}
            <button
              disabled={isApproving}
              onClick={() => toggleApprove(r)}
              className={`
                px-4 py-2 rounded-lg min-w-[120px] text-white font-medium text-sm shadow-sm
                cursor-pointer transition-all active:scale-[0.98]
                ${
                  r.approved
                    ? "bg-slate-800 hover:bg-slate-900 border border-slate-900"
                    : "bg-amber-500 hover:bg-amber-600 border border-amber-600"
                }
                ${isApproving ? "opacity-60 cursor-wait" : ""}
              `}
            >
              {isApproving
                ? "Saving..."
                : r.approved
                ? "Hide Review"
                : "Approve"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
