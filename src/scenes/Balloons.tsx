import { useEffect, useRef, useState } from "react";
import { useParticles } from "../lib/particles";
import { audio } from "../lib/audio";
import { Button, SceneTitle } from "../components/ui";

const BALLOONS = [
  { id: 0, c1: "#ffb3c9", c2: "#ff5f8f", label: "pink" },
  { id: 1, c1: "#ffe6a8", c2: "#f5a623", label: "gold" },
  { id: 2, c1: "#d6c4ff", c2: "#8b5cf6", label: "violet" },
  { id: 3, c1: "#b6f5e4", c2: "#22c2a0", label: "mint" },
];

type Shard = { id: number; tx: number; ty: number; tr: number; c: string };

export default function Balloons({ onDone }: { onDone: () => void }) {
  const fx = useParticles();
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false]);
  const [shards, setShards] = useState<Record<number, Shard[]>>({});
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = popped.filter(Boolean).length;
  const all = count === BALLOONS.length;

  const pop = (i: number) => {
    if (popped[i]) return;
    const el = refs.current[i];
    const r = el?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const y = r ? r.top + r.height * 0.4 : window.innerHeight / 2;
    const b = BALLOONS[i];

    audio.pop();
    setTimeout(() => audio.sparkle(), 60);
    fx.confetti(x, y, { count: 54, speed: 620, colors: [b.c1, b.c2, "#ffffff", "#ffd79a", "#ff8fb1"], life: 2.8 });
    fx.sparkles(x, y, 26, [b.c1, "#ffffff", b.c2]);
    fx.ring(x, y, b.c1, 8);

    setShards((s) => ({
      ...s,
      [i]: Array.from({ length: 10 }, (_, k) => ({
        id: k,
        tx: (Math.random() - 0.5) * 220,
        ty: (Math.random() - 0.35) * 220,
        tr: (Math.random() - 0.5) * 720,
        c: k % 2 ? b.c1 : b.c2,
      })),
    }));
    setPopped((p) => p.map((v, k) => (k === i ? true : v)));
  };

  useEffect(() => {
    if (!all) return;
    audio.chime();
    fx.cannons();
    const t1 = window.setTimeout(() => fx.rocket(), 400);
    const t2 = window.setTimeout(onDone, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [all, fx, onDone]);

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-20 sm:px-6">
      <SceneTitle
        kicker="Step one"
        title={
          <>
            Pop all the balloons <span className="inline-block anim-float">🎈</span>
          </>
        }
        subtitle="Tap each floating balloon and watch the confetti fly."
      />

      {/* progress */}
      <div className="reveal mt-7 flex w-full max-w-xs items-center gap-3" style={{ animationDelay: "340ms" }}>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${(count / BALLOONS.length) * 100}%`,
              background: "linear-gradient(90deg,#ffd79a,#ff8fb1,#b892ff)",
              boxShadow: "0 0 18px rgba(255,143,177,.7)",
            }}
          />
        </div>
        <span className="font-display text-sm tabular-nums text-white/75">
          {count}/{BALLOONS.length}
        </span>
      </div>

      {/* balloon grid — bootstrap fluid columns */}
      <div className="container-fluid mt-6 max-w-4xl px-0 sm:mt-10">
        <div className="row g-2 g-sm-3 g-md-4 justify-content-center">
          {BALLOONS.map((b, i) => (
            <div key={b.id} className="col-6 col-md-3 d-flex justify-content-center">
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                onClick={() => pop(i)}
                disabled={popped[i]}
                aria-label={`Pop the ${b.label} balloon`}
                className="group relative block w-full max-w-[150px] cursor-pointer border-0 bg-transparent p-0 outline-none disabled:cursor-default"
                style={{ animation: `floatY ${5.2 + i * 0.7}s ease-in-out ${i * 0.45}s infinite` }}
              >
                <span
                  className={`relative block origin-top transition-all duration-300 ${
                    popped[i] ? "scale-125 opacity-0" : "group-hover:scale-[1.06] group-active:scale-95"
                  }`}
                  style={{ animation: popped[i] ? "none" : `swayRot ${4 + i * 0.6}s ease-in-out ${i * 0.3}s infinite` }}
                >
                  <svg viewBox="0 0 100 168" className="w-full drop-shadow-[0_18px_34px_rgba(0,0,0,.45)]">
                    <defs>
                      <radialGradient id={`bg${b.id}`} cx="34%" cy="26%" r="78%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                        <stop offset="26%" stopColor={b.c1} />
                        <stop offset="78%" stopColor={b.c2} />
                        <stop offset="100%" stopColor="#3a0c26" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M50 4C76 4 92 28 92 54c0 30-24 54-42 66C32 108 8 84 8 54 8 28 24 4 50 4Z"
                      fill={`url(#bg${b.id})`}
                    />
                    <ellipse cx="34" cy="34" rx="11" ry="16" fill="#fff" opacity=".55" transform="rotate(-22 34 34)" />
                    <ellipse cx="66" cy="82" rx="6" ry="12" fill="#fff" opacity=".18" />
                    <path d="M44 118h12l-6 10z" fill={b.c2} />
                    <path
                      d="M50 128c7 8-7 14 0 22s-6 12 0 18"
                      fill="none"
                      stroke="rgba(255,255,255,.55)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                {/* burst shards */}
                {shards[i]?.map((s) => (
                  <span
                    key={s.id}
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[38%] block h-3 w-2 rounded-[40%]"
                    style={
                      {
                        background: s.c,
                        "--tx": `${s.tx}px`,
                        "--ty": `${s.ty}px`,
                        "--tr": `${s.tr}deg`,
                        animation: "popShard .85s cubic-bezier(.2,.7,.3,1) forwards",
                      } as React.CSSProperties
                    }
                  />
                ))}

                {popped[i] && (
                  <span className="reveal absolute inset-x-0 top-[34%] text-center font-script text-2xl text-amber-100/90">
                    pop!
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 h-14">
        {all && (
          <div className="reveal flex flex-col items-center gap-3">
            <p className="font-script text-[clamp(1.5rem,4.6vw,2.2rem)] text-aurora">Beautifully done!</p>
            <Button size="sm" variant="ghost" onClick={onDone}>
              Continue →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
