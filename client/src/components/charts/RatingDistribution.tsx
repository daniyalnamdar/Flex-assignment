import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RatingDistribution({
  data,
}: {
  data: { rating: number; count: number }[];
}) {
  if (!data.length) return null;

  return (
    <div className="bg-white rounded-xl2 shadow-soft border border-stone-100 p-4">
      <h3 className="font-semibold text-slate-800 mb-2">Rating Distribution</h3>

      {/* the wrapper FIX */}
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
