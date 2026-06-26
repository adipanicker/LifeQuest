import { useState } from "react";

export default function TodoItem({
  todo,
  goals = [],
  onComplete,
  onDelete,
  onLink,
}) {
  const [showGoalPicker, setShowGoalPicker] = useState(false);
  const linkedGoal = goals.find((g) => g.id === todo.goal_id);

  const handleGoalSelect = (goalId) => {
    onLink(todo.id, goalId);
    setShowGoalPicker(false);
  };
  const handleUnlink = () => {
    onLink(todo.id, null);
    setShowGoalPicker(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-none">
        {/* Checkbox */}
        <button
          onClick={() => !todo.is_completed && onComplete(todo.id)}
          className={`w-5 h-5 rounded shrink-0 flex items-center justify-center transition-colors ${
            todo.is_completed
              ? "bg-primary cursor-default"
              : "border-2 border-gray-300 dark:border-gray-600 hover:border-primary cursor-pointer"
          }`}
        >
          {todo.is_completed && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2.5 2.5L8 3"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Title */}
        <span
          className={`flex-1 text-sm ${
            todo.is_completed
              ? "line-through text-gray-400 dark:text-gray-600"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {todo.title}
        </span>

        {/* Goal tag */}
        {!todo.is_completed && (
          <>
            {linkedGoal ? (
              <button
                onClick={() => setShowGoalPicker(!showGoalPicker)}
                className="flex items-center gap-1 text-xs bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary px-2 py-0.5 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                🎯{" "}
                {linkedGoal.title.length > 12
                  ? linkedGoal.title.slice(0, 12) + "..."
                  : linkedGoal.title}
              </button>
            ) : (
              <button
                onClick={() => setShowGoalPicker(!showGoalPicker)}
                className="text-xs text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 px-2 py-0.5 rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                + Goal
              </button>
            )}
          </>
        )}

        {/* XP Pill */}
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            todo.goal_id
              ? "bg-orange-50 dark:bg-orange-900/20 text-streak"
              : "bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary"
          } ${todo.is_completed ? "opacity-100" : "opacity-40"}`}
        >
          +{todo.xp_reward} XP
        </span>

        {/* Delete */}
        <button
          onClick={() => onDelete(todo.id)}
          className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors text-lg leading-none px-1"
        >
          ×
        </button>
      </div>

      {/* Goal Picker Dropdown */}
      {showGoalPicker && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowGoalPicker(false)}
            aria-hidden="true"
          />
          <div className="absolute right-6 top-10 z-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-2 min-w-48">
            <p className="text-xs text-gray-400 px-2 py-1 uppercase tracking-wide">
              Link to goal
            </p>
            {goals.length === 0 ? (
              <p className="text-xs text-gray-400 px-2 py-2">
                No active goals yet
              </p>
            ) : (
              goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                    todo.goal_id === goal.id
                      ? "bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary font-medium"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  🎯 {goal.title}
                </button>
              ))
            )}
            {todo.goal_id && (
              <>
                <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                <button
                  onClick={handleUnlink}
                  className="w-full text-left text-sm px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Remove link
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
