export default function GoalCard({ goal, onComplete, onDelete }) {
  const total = parseInt(goal.total_todos);
  const completed = parseInt(goal.completed_todos);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const daysLeft = goal.deadline
    ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const getDeadlineColor = () => {
    if (daysLeft === null) return "text-gray-400";
    if (daysLeft < 0) return "text-red-500";
    if (daysLeft <= 3) return "text-orange-500";
    return "text-blue-400";
  };

  const getDeadlineText = () => {
    if (daysLeft === null) return "No deadline";
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return "Due today";
    if (daysLeft === 1) return "1 day left";
    return `${daysLeft} days left`;
  };

  return (
    <div
      className={`bg-white border rounded-xl p-4 ${
        goal.is_completed
          ? "border-primary-light opacity-75"
          : "border-gray-200"
      }`}
    >
      {/* {Header} */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {goal.is_completed && (
            <span className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full font-medium">
              completed ✨
            </span>
          )}
          <h3
            className={`text-sm font-medium ${
              goal.is_completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {goal.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!goal.is_completed && (
            <button
              onClick={() => onComplete(goal.id)}
              className="text-xs text-primary border border-primary-light bg-primary-light px-2.5 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              Mark done
            </button>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
          >
            x
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-400">
            {completed} / {total} linked tasks done.
          </span>
          <span className="text-xs font-medium text-primary">{percent}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs ${getDeadlineColor()}`}>
          📅 {getDeadlineText()}
        </span>
        {total > 0 && (
          <span className="text-xs text-gray-400">+20 XP per linked task</span>
        )}
      </div>
    </div>
  );
}
