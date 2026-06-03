import { useState } from "react";
import api from "../api/axios";
import { useEffect } from "react";

export default function AISuggestions({ onAccepted }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/suggestions");
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      const res = await api.post("/suggestions/trigger");
      if (res.status === 429) {
        // show limit message
        setLimitReached(true);
        return;
      }
      await fetchSuggestions();
    } catch (err) {
      if (err.response?.status === 429) {
        setLimitReached(true);
      }
      console.error(err);
    } finally {
      setTriggering(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await api.post(`/suggestions/${id}/accept`);
      setSuggestions(
        suggestions.map((s) => (s.id === id ? { ...s, is_added: true } : s)),
      );
      onAccepted(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.delete(`/suggestions/${id}`);
      setSuggestions(suggestions.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">✨</span>
          <h2 className="text-base font-medium text-gray-900">
            AI Daily Quests
          </h2>
          <span className="text-xs bg-primary-light text-primary-dark px-2 py-0.5 rounded-full font-medium">
            +25 XP
          </span>
        </div>
        <button
          onClick={handleTrigger}
          disabled={triggering}
          className="text-xs text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
        >
          {triggering ? "Generating..." : "↻ Refresh"}
        </button>
      </div>

      {/* Empty State */}
      {suggestions.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-400 mb-3">
            No AI quests yet. Generate some based on your goals!
          </p>
          {limitReached ? (
            <span className="text-xs text-streak">
              Max 2 generations per day 🌙
            </span>
          ) : (
            <button
              onClick={handleTrigger}
              disabled={triggering}
              className="text-xs text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
            >
              {triggering ? "Generating..." : "↻ Refresh"}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                s.is_added
                  ? "bg-primary-light border-green-200"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              {/* AI badge */}
              <span className="text-sm shrink-0">⚡</span>

              {/* Title */}
              <span
                className={`flex-1 text-sm ${
                  s.is_added
                    ? "text-primary-dark line-through"
                    : "text-gray-700"
                }`}
              >
                {s.title}
              </span>
              {/* Goal tag */}
              {s.goal_title && (
                <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full hidden sm:block">
                  🎯{" "}
                  {s.goal_title.length > 15
                    ? s.goal_title.slice(0, 15) + "..."
                    : s.goal_title}
                </span>
              )}

              {/* Actions */}
              {s.is_added ? (
                <span className="text-xs text-primary-dark font-medium shrink-0">
                  Added ✓
                </span>
              ) : (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleAccept(s.id)}
                    className="text-xs bg-primary text-white px-2.5 py-1 rounded-full hover:bg-primary-dark transition-colors"
                  >
                    + Add
                  </button>
                  <button
                    onClick={() => handleDismiss(s.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none px-1"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        AI quests are generated daily based on your active goals. New quests
        every morning at 6AM.
      </p>
    </div>
  );
}
