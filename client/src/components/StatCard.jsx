export default function StatCard({ label, value, valueColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </div>
      <div className={`text-2xl font-medium ${valueColor || "text-gray-900"}`}>
        {value}
      </div>
    </div>
  );
}
