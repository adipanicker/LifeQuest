export default function StatCard({ label, value, valueColor }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </div>
      <div
        className={`text-2xl font-medium ${valueColor || "text-gray-900 dark:text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}
