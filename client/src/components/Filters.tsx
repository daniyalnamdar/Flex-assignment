type Props = {
  minRating: number;
  setMinRating: (v: number) => void;
  channel: string;
  setChannel: (v: string) => void;
  type: string;
  setType: (v: string) => void;
  loading?: boolean;
};

export default function Filters({
  minRating,
  setMinRating,
  channel,
  setChannel,
  type,
  setType,
  loading,
}: Props) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-soft flex flex-wrap gap-4">
      {/* Min Rating */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-600 mb-1">
          Min Rating
        </label>
        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          disabled={loading}
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
        />
      </div>

      {/* Channel */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-600 mb-1">
          Channel
        </label>
        <select
          disabled={loading}
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
        >
          <option value="">All</option>
          <option value="airbnb">Airbnb</option>
          <option value="booking">Booking.com</option>
          <option value="hostaway">Hostaway</option>
          <option value="google">Google</option>
        </select>
      </div>

      {/* Type */}
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-slate-600 mb-1">
          Type
        </label>
        <select
          disabled={loading}
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
        >
          <option value="">All</option>
          <option value="guest-to-host">Guest → Host</option>
          <option value="host-to-guest">Host → Guest</option>
        </select>
      </div>
    </div>
  );
}
