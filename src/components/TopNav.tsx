import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./ui";

export type Step = { key: string; label: string; icon: string };

export default function TopNav({
  steps,
  current,
  unlocked,
  onJump,
  muted,
  onToggleMute,
  name,
  sender,
  onSave,
}: {
  steps: Step[];
  current: number;
  unlocked: number;
  onJump: (i: number) => void;
  muted: boolean;
  onToggleMute: () => void;
  name: string;
  sender: string;
  onSave: (name: string, sender: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [n, setN] = useState(name);
  const [s, setS] = useState(sender);

  useEffect(() => {
    setN(name);
    setS(sender);
  }, [name, sender]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
        <nav className="glass pointer-events-auto flex w-full max-w-3xl items-center gap-2 rounded-full px-2.5 py-2 sm:gap-3 sm:px-4">
          <span className="flex items-center gap-2 pl-1 pr-1">
            <span className="grid h-7 w-7 place-items-center rounded-full text-sm" style={{ background: "linear-gradient(140deg,#ffd79a,#ff8fb1)" }}>
              🎂
            </span>
            <span className="hidden font-display text-sm tracking-wide text-white/90 sm:inline">Celebration</span>
          </span>

          {/* step dots */}
          <ol className="mx-auto flex items-center gap-1 sm:gap-1.5">
            {steps.map((st, i) => {
              const active = i === current;
              const done = i < unlocked;
              return (
                <li key={st.key}>
                  <button
                    onClick={() => i <= unlocked && onJump(i)}
                    disabled={i > unlocked}
                    title={st.label}
                    aria-label={st.label}
                    aria-current={active ? "step" : undefined}
                    className={cn(
                      "group relative grid h-8 w-8 place-items-center rounded-full transition-all duration-300 sm:h-9 sm:w-9",
                      active ? "scale-110 bg-white/18" : done ? "bg-white/8 hover:bg-white/14" : "opacity-35",
                      i <= unlocked ? "cursor-pointer" : "cursor-not-allowed",
                    )}
                  >
                    <span className="text-[0.85rem] sm:text-[0.95rem]">{st.icon}</span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full ring-1 ring-amber-200/70"
                        style={{ boxShadow: "0 0 18px rgba(255,215,154,.55)" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <button
            onClick={onToggleMute}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-sm transition hover:bg-white/16 active:scale-90"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={() => setOpen(true)}
            aria-label="Personalize this surprise"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-sm transition hover:bg-white/16 active:scale-90"
          >
            ✨
          </button>
        </nav>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#07040f]/80 p-4 backdrop-blur-xl"
          onClick={() => setOpen(false)}
          style={{ animation: "riseFade .35s ease both" }}
        >
          <div className="glass glass-edge w-full max-w-md rounded-3xl p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-[0.62rem] uppercase tracking-[0.4em] text-amber-100/70">Personalize</p>
            <h3 className="mt-2 font-display text-2xl text-white">Make it theirs ✨</h3>
            <p className="mt-1 text-sm font-light text-white/60">Change who this surprise is for — everything updates instantly.</p>

            <label className="mt-6 block text-xs uppercase tracking-[0.2em] text-white/55">Birthday person</label>
            <input
              value={n}
              maxLength={24}
              onChange={(e) => setN(e.target.value)}
              placeholder="Their name"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-amber-200/60 focus:bg-white/12"
            />

            <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-white/55">Signed by</label>
            <input
              value={s}
              maxLength={24}
              onChange={(e) => setS(e.target.value)}
              placeholder="Your name"
              className="mt-2 w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-amber-200/60 focus:bg-white/12"
            />

            <div className="mt-7 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSave(n.trim() || name, s.trim() || sender);
                  setOpen(false);
                }}
              >
                Save ✨
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
