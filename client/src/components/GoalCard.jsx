export default function GoalCard({ goal, onComplete, onDelete }) {
  const total = parseInt(goal.total_todos);
  const completed = parseInt(goal.completed_todos);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const xpEarned = completed * 20;
  const remaining = total - completed;

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const getDeadlineBadge = () => {
    if (daysLeft === null) return null;
    if (daysLeft < 0)
      return {
        text: `${Math.abs(daysLeft)} days overdue`,
        style: "bg-red-50 text-red-600",
      };
    if (daysLeft === 0)
      return { text: "Due today", style: "bg-red-50 text-red-600" };
    if (daysLeft <= 3)
      return {
        text: `${daysLeft} days left`,
        style: "bg-orange-50 text-streak",
      };
    return {
      text: `${daysLeft} days left`,
      style: "bg-gray-100 text-gray-500",
    };
  };

  const deadlineBadge = getDeadlineBadge();

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden ${
        goal.is_completed ? "border-gray-100 opacity-70" : "border-gray-200"
      }`}
    >
      {/* Top section */}
      <div className="p-4">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-2">
          {goal.is_completed ? (
            <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
              completed ✨
            </span>
          ) : (
            <span className="text-xs font-medium bg-primary-light text-primary-dark px-2.5 py-0.5 rounded-full">
              active
            </span>
          )}
          {deadlineBadge && (
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${deadlineBadge.style}`}
            >
              {deadlineBadge.text}
            </span>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3
              className={`text-base font-medium ${
                goal.is_completed
                  ? "line-through text-gray-400"
                  : "text-gray-900"
              }`}
            >
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                {goal.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!goal.is_completed && (
              <button
                onClick={() => onComplete(goal.id)}
                className="text-xs font-medium text-primary bg-primary-light px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Mark done
              </button>
            )}
            <button
              onClick={() => onDelete(goal.id)}
              className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400">
              {completed} / {total} linked tasks done
            </span>
            <span
              className={`text-xs font-medium ${
                percent === 100 ? "text-primary" : "text-gray-500"
              }`}
            >
              {percent}%
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 border-t border-gray-100">
        <div className="px-4 py-3">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Done
          </p>
          <p className="text-lg font-medium text-primary">{completed}</p>
          <p className="text-xs text-gray-400">of {total} linked</p>
        </div>
        <div className="px-4 py-3 border-l border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            XP earned
          </p>
          <p className="text-lg font-medium text-gray-900">{xpEarned}</p>
          <p className="text-xs text-gray-400">from this goal</p>
        </div>
        <div className="px-4 py-3 border-l border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Remaining
          </p>
          <p
            className={`text-lg font-medium ${
              remaining === 0 ? "text-primary" : "text-streak"
            }`}
          >
            {remaining}
          </p>
          <p className="text-xs text-gray-400">
            {remaining === 0 ? "all done!" : "tasks left"}
          </p>
        </div>
      </div>
    </div>
  );
}
