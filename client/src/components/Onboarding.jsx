import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const steps = [
  {
    emoji: "⚔️",
    title: "Welcome to LifeQuest",
    sub: "Your life is now a game. Complete quests, earn XP, level up. Don't let your streak die.",
    preview: ({ user }) => (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-center">
            <div className="text-base font-medium text-primary">1</div>
            <div className="text-xs text-gray-400 mt-0.5">Level</div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-center">
            <div className="text-base font-medium text-gray-900 dark:text-white">
              0
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Total XP</div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-center">
            <div className="text-base font-medium text-streak">0 🔥</div>
            <div className="text-xs text-gray-400 mt-0.5">Streak</div>
          </div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1">
          <div className="bg-primary h-1.5 rounded-full w-0" />
        </div>
        <div className="text-xs text-gray-400">
          0/100 XP — complete quests to level up
        </div>
      </div>
    ),
  },
  {
    emoji: "🎯",
    title: "Set goals. Level up in real life.",
    sub: "Head to Goals and create up to 3 active goals. Not just in-game — these are real things you want to achieve.",
    preview: () => (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary px-2 py-0.5 rounded-full">
            active
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Solve 30 DSA problems in 30 days
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary px-2 py-0.5 rounded-full">
            active
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Be more active on LinkedIn
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600">
          <span className="text-xs">+</span>
          <span className="text-xs">Add a new goal...</span>
        </div>
      </div>
    ),
  },
  {
    emoji: "✨",
    title: "Link quests to goals. AI does the rest.",
    sub: "Link your daily quests to a goal and AI suggests tasks every morning at 6AM. Goal-linked tasks earn +20 XP instead of +10.",
    preview: () => (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-primary shrink-0" />
          <span className="flex-1 text-xs text-gray-400 line-through">
            Solve 2 LeetCode problems
          </span>
          <span className="text-xs bg-streak-light text-streak-dark px-2 py-0.5 rounded-full">
            +20 XP
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded border-2 border-gray-300 dark:border-gray-600 shrink-0" />
          <span className="flex-1 text-xs text-gray-700 dark:text-gray-300">
            Post on LinkedIn today
          </span>
          <span className="text-xs bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary px-2 py-0.5 rounded-full">
            🎯 LinkedIn
          </span>
        </div>
        <div className="flex items-center gap-2 bg-primary-light dark:bg-primary/10 rounded-lg px-2 py-1.5">
          <span className="text-xs">⚡</span>
          <span className="flex-1 text-xs text-primary-dark dark:text-primary">
            AI: "Review a system design concept today"
          </span>
          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
            + Add
          </span>
        </div>
      </div>
    ),
  },
  {
    emoji: "📖",
    title: "History is your trophy room.",
    sub: "Every quest you complete gets logged. Log everything — even stuff you already did today. The more you document, the richer your story.",
    preview: () => (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
          Apr 23, 2026 — perfect day ✨
        </div>
        <div className="space-y-2">
          {[
            "Go gym in morning first time!",
            "Solved 2 LC problems",
            "Eat healthy today",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-1 border-b border-gray-100 dark:border-gray-700 last:border-none"
            >
              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <span className="flex-1 text-xs text-gray-600 dark:text-gray-400">
                {item}
              </span>
              <span className="text-xs bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary px-2 py-0.5 rounded-full">
                +{i === 0 ? 10 : 20} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    emoji: "🌙",
    title: "Your avatar. Your settings.",
    sub: "Tap your avatar in the top-right anytime to toggle dark mode or log out.",
    preview: () => (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3">
        <div className="flex items-center justify-end gap-2 mb-2">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg px-2 py-1">
            <span className="text-xs text-primary font-medium">Today</span>
            <span className="text-xs text-gray-400 px-1">History</span>
            <span className="text-xs text-gray-400 px-1">Goals</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center text-xs font-medium text-primary-dark dark:text-primary">
            J
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 space-y-1">
          <div className="text-xs font-medium text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-gray-700">
            Aditya
          </div>
          <div className="flex items-center justify-between py-1 text-xs text-gray-600 dark:text-gray-400">
            <span>Dark mode</span>
            <span>🌙</span>
          </div>
          <div className="flex items-center justify-between py-1 text-xs text-red-400">
            <span>Logout</span>
            <span>→</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    emoji: "🏆",
    title: "That's it. Now go grind.",
    sub: "Set your goals. Complete your quests. Don't break the streak. Your future self will thank you.",
    preview: () => (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-center">
        <div className="text-xl font-medium text-primary mb-1">
          Level 1 → ???
        </div>
        <div className="text-xs text-gray-400 mb-3">
          Every quest gets you closer.
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          <span className="text-xs bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary px-2 py-0.5 rounded-full">
            XP earned
          </span>
          <span className="text-xs bg-streak-light text-streak-dark px-2 py-0.5 rounded-full">
            streak alive
          </span>
          <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">
            goals crushed
          </span>
        </div>
      </div>
    ),
  },
];

export default function Onboarding({ onComplete }) {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const handleFinish = async () => {
    setFinishing(true);
    try {
      await api.patch("/auth/onboarding");
      setUser((prev) => ({ ...prev, Onboarding_complete: true }));

      // Play finish sound
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + start + duration,
        );
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      // Victory arpeggio — C, E, G, C
      playNote(523, 0, 0.15);
      playNote(659, 0.12, 0.15);
      playNote(784, 0.24, 0.15);
      playNote(1046, 0.36, 0.4);

      onComplete();
    } catch (err) {
      console.error(err);
      onComplete();
    } finally {
      setFinishing(false);
    }
  };

  const Step = steps[step];
  const Preview = Step.preview;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm overflow-hidden">
        {/* Progress bar */}
        <div className="flex gap-1 p-4 pb-0">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="text-3xl mb-2">{Step.emoji}</div>
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-1">
            {Step.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {Step.sub}
          </p>
          <Preview user={user} />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-3 flex items-center justify-between">
          <button
            onClick={handleFinish}
            className="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={isLast ? handleFinish : () => setStep((s) => s + 1)}
              disabled={finishing}
              className="text-xs bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
            >
              {isLast ? (finishing ? "Starting..." : "Let's go! ⚔️") : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
