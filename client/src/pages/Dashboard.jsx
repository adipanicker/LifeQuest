import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import XPBar from "../components/XPBar";
import TodoItem from "../components/TodoItem";

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    document.title = "Today's Quests | LifeQuest";

    return () => {
      document.title = "LifeQuest";
    };
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Converts any date to local date string for comparison
  const toLocalDateStr = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA"); // returns YYYY-MM-DD in local timezone
  };

  const todayLocal = toLocalDateStr(new Date());

  const today = new Date().toDateString();

  const todaysActive = todos.filter(
    (t) => toLocalDateStr(t.created_at) === todayLocal && !t.is_completed,
  );

  const todayDone = todos.filter(
    (t) => toLocalDateStr(t.created_at) === todayLocal && t.is_completed,
  );

  useEffect(() => {
    api
      .get("/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api
      .get("/goals")
      .then((res) => setGoals(res.data.filter((g) => !g.is_completed)))
      .catch((err) => console.error(err));
  }, []);

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await api.post("/todos", { title: newTodo.trim() });

      setTodos([res.data, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await api.patch(`/todos/${id}/complete`);
      setTodos(
        todos.map((t) =>
          t.id === id
            ? { ...t, is_completed: true, completed_at: new Date() }
            : t,
        ),
      );
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLink = async (todoId, goalId) => {
    try {
      const res = await api.patch(`/todos/${todoId}/link`, { goal_id: goalId });
      setTodos(todos.map((t) => (t.id === todoId ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Greeting */}
        <div className="mb-5">
          <h1 className="text-xl font-medium text-gray-900">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {todaysActive.length === 0
              ? "All quests complete! You legend. 🏆"
              : `You have ${todaysActive.length} quests remaining today.`}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <StatCard
            label="level"
            value={user?.level}
            valueColor="text-primary"
          />
          <StatCard label="Total XP" value={user?.xp} />
          <StatCard
            label="Streak"
            value={`${user?.streak} 🔥`}
            valueColor="text-streak"
          />
          <StatCard label="Done today" value={todayDone.length} />
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <XPBar xp={user?.xp || 0} level={user?.level || 1} />
        </div>

        {/* Streak Banner */}
        {user?.streak > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-sm font-medium text-orange-700">
                {user.streak} day streak — keep it going!
              </p>
              <p className="text-xs text-orange-500 mt-0.5">
                Complete at least 1 task today to keep it alive.
              </p>
            </div>
          </div>
        )}

        {/* Todo Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">
            Today's quests
          </h2>
          {/* Add Todo */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new quest..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleAdd}
              className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              + Add
            </button>
          </div>
          {/* Todo List */}
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Loading quests...
            </p>
          ) : todaysActive.length === 0 && todayDone.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No quests yet. Add one above! ⚔️
            </p>
          ) : (
            <>
              {todaysActive.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  goals={goals}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onLink={handleLink}
                />
              ))}

              {todayDone.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Completed
                  </p>
                  {todayDone.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      goals={goals}
                      onComplete={handleComplete}
                      onDelete={handleDelete}
                      onLink={handleLink}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
