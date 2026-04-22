import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import GoalCard from "../components/GoalCard";

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", deadline: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/goals")
      .then((res) => setGoals(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeGoals = goals.filter((g) => !g.is_completed);
  const completedGoals = goals.filter((g) => g.is_completed);
  const atLimit = activeGoals.length >= 3;

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/goals", form);
      setGoals([res.data, ...goals]);
      setForm({ title: "", deadline: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await api.patch(`/goals/${id}/complete`);
      setGoals(
        goals.map((g) => (g.id === id ? { ...g, is_completed: true } : g)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/goals/${id}`);
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Your Goals</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {atLimit
                ? "Max 3 active goals - complete one to add more."
                : `${activeGoals.length}/3 active goals`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={atLimit}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              atLimit
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            + New Goal
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-light border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-lg">⚡</span>
          <p className="text-sm text-primary-dark">
            Todos linked to a goal award <strong>+20 XP</strong> instead of +10.
            Link your tasks to goals to level up faster.
          </p>
        </div>

        {/* Add Goal Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-medium text-gray-900">New Goal</h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Learn DSA in 30 days"
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Deadline <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Goal"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Goals */}
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Loading goals...
          </p>
        ) : activeGoals.length === 0 && !showForm ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-2xl mb-2">🎯</p>
            <p className="text-sm font-medium text-gray-700">
              No active goals yet
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Set a goal and link your todos to it for bonus XP.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Completed goals
            </p>
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
