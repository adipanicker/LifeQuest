import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const today = new Date().toDateString();

// Converts any date to local date string for comparison
const toLocalDateStr = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-CA"); // returns YYYY-MM-DD in local timezone
};

const todayLocal = toLocalDateStr(new Date());

const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  const todayStr = toLocalDateStr(new Date());
  const dateLocalStr = toLocalDateStr(dateStr);

  const diffDays = Math.floor(
    (new Date(todayStr) - new Date(dateLocalStr)) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStreakMessage = (streak) => {
  if (streak >= 30) return { emoji: "👑", text: `${streak} day legend streak` };
  if (streak >= 14)
    return { emoji: "🔥", text: `${streak} day streak — unstoppable` };
  if (streak >= 7)
    return { emoji: "⚡", text: `${streak} day streak — on fire` };
  if (streak >= 3)
    return { emoji: "✨", text: `${streak} day streak — building momentum` };
  return { emoji: "🌱", text: `${streak} day streak — just getting started` };
};

export default function History() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Quests History | LifeQuest";

    return () => {
      document.title = "LifeQuest";
    };
  }, []);

  useEffect(() => {
    api
      .get("/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const archive = todos.filter(
    (t) => toLocalDateStr(t.created_at) !== todayLocal,
  );

  const grouped = archive.reduce((groups, todo) => {
    const label = formatDateLabel(todo.created_at);
    if (!groups[label]) groups[label] = [];
    groups[label].push(todo);
    return groups;
  }, {});

  const sortedGroups = Object.entries(grouped)
    .filter(([_, items]) => items.length > 0)
    .sort((a, b) => {
      const dateA = new Date(a[1][0].created_at);
      const dateB = new Date(b[1][0].created_at);
      return dateB - dateA;
    });

  const totalCompleted = todos.filter((t) => t.is_completed).length;
  const totalXPEarned = todos.filter((t) => t.is_completed).length * 10;

  //   const handleResurrect = async (id) => {
  //   try {
  //     const res = await api.patch(`/todos/${id}/resurrect`)
  //     setTodos(todos.map(t => t.id === id ? res.data : t))
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const streakMsg = getStreakMessage(user?.streak || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Hero stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{streakMsg.emoji}</span>
            <div>
              <p className="text-base font-medium text-gray-900">
                {streakMsg.text}
              </p>
              <p className="text-sm text-gray-500">
                Here's everything you've conquered so far.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-medium text-primary">
                {totalCompleted}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">quests done</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-medium text-gray-900">
                {totalXPEarned}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">XP earned</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-xl font-medium text-streak">
                {user?.streak || 0} 🔥
              </div>
              <div className="text-xs text-gray-400 mt-0.5">day streak</div>
            </div>
          </div>
        </div>

        {/* Level progress card */}
        <div className="bg-primary-light border border-green-200 rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="text-3xl">⚔️</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-primary-dark">
              You're level {user?.level} — top{" "}
              {Math.max(1, 100 - (user?.level || 1) * 5)}% of questers
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              Every completed quest got you here. Keep going.
            </p>
          </div>
        </div>

        {/* Archive List */}
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Loading your history...
          </p>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-2xl mb-2">🌱</p>
            <p className="text-sm font-medium text-gray-700">No history yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Complete quests today and they'll appear here tomorrow.
            </p>
          </div>
        ) : (
          sortedGroups.map(([dateLabel, items]) => (
            <div
              key={dateLabel}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              {/* Date header with completion rate*/}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">{dateLabel}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {items.filter((t) => t.is_completed).length}/{items.length}{" "}
                    done
                  </span>
                  {items.every((t) => t.is_completed) && (
                    <span className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full font-medium">
                      perfect day ✨
                    </span>
                  )}
                </div>
              </div>
              {/* Items */}
              {items.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-none"
                >
                  {/* Status Dot */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      todo.is_completed ? "bg-primary" : "bg-gray-300"
                    }`}
                  />

                  {/* title */}
                  <span
                    className={`flex-1 text-sm ${
                      todo.is_completed ? "text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {todo.title}
                  </span>

                  {/* XP badge for completed */}
                  {todo.is_completed && (
                    <span className="text-xs font-medium text-primary-dark bg-primary-light px-2 py-0.5 rounded-full">
                      +{todo.xp_reward} XP
                    </span>
                  )}

                  {/* +Today button — shown for ALL archive items */}
                  <button
                    // onClick={() => handleResurrect(todo.id)}
                    className="text-xs text-primary border border-primary-light bg-primary-light px-2.5 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                  >
                    + Today
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
