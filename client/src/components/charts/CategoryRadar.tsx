import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function CategoryRadar({
  data,
}: {
  data: { category: string; rating: number }[];
}) {
  if (!data.length) return null;

  return (
    <div className="bg-white rounded-xl2 shadow-soft border border-stone-100 p-4">
      <h3 className="font-semibold text-slate-800 mb-2">
        Category Performance
      </h3>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis domain={[0, 10]} />
            <Tooltip />
            <Radar dataKey="rating" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
