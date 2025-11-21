import { useState, useEffect } from "react";
import {
  Star,
  CheckCircle,
  XCircle,
  LayoutDashboard,
  Globe,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Environment configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'public'
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'high', 'low'
  const [loading, setLoading] = useState(true);

  // Fetch data on load
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/hostaway`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Approval Toggle [cite: 17]
  const toggleApproval = async (id, currentStatus) => {
    // Optimistic update for UI speed
    const updatedReviews = reviews.map((r) =>
      r.id === id ? { ...r, isApproved: !currentStatus } : r
    );
    setReviews(updatedReviews);

    try {
      await fetch(`${API_URL}/api/reviews/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: !currentStatus }),
      });
    } catch (err) {
      console.error("Update failed", err);
      fetchReviews(); // Revert on error
    }
  };

  // Filter Logic
  const displayedReviews = reviews.filter((r) => {
    if (view === "public" && !r.isApproved) return false; // [cite: 22]
    if (filter === "high" && r.rating < 9) return false;
    if (filter === "low" && r.rating >= 9) return false;
    return true;
  });

  // Calculate Stats for Dashboard [cite: 14]
  const avgRating = (
    reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header & Navigation */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-flex-dark">
            Flex Living Reviews
          </h1>
          <p className="text-gray-500">Property Performance & Guest Feedback</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setView("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              view === "dashboard" ? "bg-black text-white" : "bg-white border"
            }`}
          >
            <LayoutDashboard size={18} /> Manager Dashboard
          </button>
          <button
            onClick={() => setView("public")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              view === "public" ? "bg-black text-white" : "bg-white border"
            }`}
          >
            <Globe size={18} /> Public Page
          </button>
        </div>
      </header>

      {/* --- MANAGER DASHBOARD VIEW [cite: 11] --- */}
      {view === "dashboard" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-gray-500 text-sm">Average Rating</h3>
              <p className="text-4xl font-bold mt-2">
                {isNaN(avgRating) ? "-" : avgRating}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-gray-500 text-sm">Total Reviews</h3>
              <p className="text-4xl font-bold mt-2">{reviews.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-gray-500 text-sm">Pending Approval</h3>
              <p className="text-4xl font-bold mt-2 text-orange-500">
                {reviews.filter((r) => !r.isApproved).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg border">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-transparent outline-none"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="high">High (9-10)</option>
              <option value="low">Low (Below 9)</option>
            </select>
          </div>

          {/* Review List Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium">Listing</th>
                  <th className="p-4 font-medium">Guest</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Public Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="p-4 text-sm font-medium">
                      {review.listingName}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {review.guestName}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          review.rating >= 9
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {review.rating}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          toggleApproval(review.id, review.isApproved)
                        }
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          review.isApproved
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Hidden"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- PUBLIC DISPLAY PAGE [cite: 19] --- */}
      {view === "public" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReviews.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-12">
              No reviews are currently public.
            </div>
          ) : (
            displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl border shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                      {review.guestName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{review.guestName}</h4>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} fill="black" stroke="none" />
                    <span className="font-bold">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
                <p className="mt-4 text-xs text-gray-400 uppercase tracking-wider">
                  {review.listingName}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
