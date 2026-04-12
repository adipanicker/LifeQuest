export default function XPBar({ xp, level }) {
  const xpPerLevel = 100;
  const currentLevelXP = xp % xpPerLevel;
  const xpToNext = xpPerLevel - currentLevelXP;
  const percent = (currentLevelXP / xpPerLevel) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2.5">
        <span className="bg-primary-light text-primary-dark text-xs font-medium px-3 py-1 rounded-full">
          Level {level}
        </span>
        <span className="text-sm text-gray-500">
          {currentLevelXP}/{xpPerLevel} XP
        </span>
      </div>
      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-1.5">
        {xpToNext} XP to level {level + 1} - complete {xpToNext / 10} more tasks
      </div>
    </div>
  );
}
