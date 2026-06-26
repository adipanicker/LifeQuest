export default function XPBar({ xp, level }) {
  const xpPerLevel = 100;
  const currentLevelXP = xp % xpPerLevel;
  const xpToNext = xpPerLevel - currentLevelXP;
  const percent = (currentLevelXP / xpPerLevel) * 100;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2.5">
        <span className="bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary text-xs font-medium px-3 py-1 rounded-full">
          Level {level}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentLevelXP}/{xpPerLevel} XP
        </span>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
        {xpToNext} XP to level {level + 1} — complete {xpToNext / 10} more tasks
      </div>
    </div>
  );
}
