export default function TodoItem({ todo, onComplete, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-none">
      {/* Checkbox */}
      <button
        onClick={() => !todo.is_completed && onComplete(todo.id)}
        className={`w-5 h-5 rounded shrink-0 flex items-center justify-center transition-colors
                ${
                  todo.is_completed
                    ? "bg-primary cursor-default"
                    : "border-2 border-gray-300 hover:border-primary cursor-pointer"
                } `}
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

      {/*Title*/}
      <span
        className={`flex-1 text-sm ${
          todo.is_completed ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {todo.title}
      </span>

      {/*XP Pill */}
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full bg-primary-light text-primary-dark
        ${todo.is_completed ? "opacity-100" : "opacity-40"}`}
      >
        +{todo.xp_reward} XP
      </span>

      {/* DELETE */}
      <button
        onClick={() => onDelete(todo.id)}
        className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none px-1"
      >
        x
      </button>
    </div>
  );
}
