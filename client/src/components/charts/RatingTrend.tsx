import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RatingTrend({
  data,
}: {
  data: { day: string; avg: number; count: number }[];
}) {
  if (!data.length) return null;

  return (
    <div className="bg-white rounded-xl2 shadow-soft border border-stone-100 p-4">
      <h3 className="font-semibold text-slate-800 mb-2">Rating Trend</h3>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="avg" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
