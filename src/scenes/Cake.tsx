import { useCallback, useEffect, useRef, useState } from "react";
import { useParticles } from "../lib/particles";
import { audio } from "../lib/audio";
import { useMicBlow } from "../lib/useMicBlow";
import { Button, SceneTitle } from "../components/ui";

const COLORS = ["#ff8fb1", "#ffd79a", "#8ef2d8", "#b892ff", "#7cc4ff"];
const SPRINKLES = [
  ...Array.from({ length: 12 }, (_, i) => ({ x: 54 + i * 18, y: 198 + ((i * 37) % 32), i })),
  ...Array.from({ length: 9 }, (_, i) => ({ x: 86 + i * 18, y: 142 + ((i * 29) % 26), i: i + 12 })),
  ...Array.from({ length: 6 }, (_, i) => ({ x: 116 + i * 16, y: 96 + ((i * 23) % 16), i: i + 21 })),
].map((s) => ({ ...s, r: (s.i * 47) % 180, c: COLORS[s.i % 5] }));

export default function Cake({ onDone }: { onDone: () => void }) {
  const fx = useParticles();
  const [out, setOut] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const cakeRef = useRef<HTMLDivElement>(null);

  const extinguish = useCallback(() => {
    setOut((prev) => {
      if (prev) return prev;
      audio.whoosh();
      const r = cakeRef.current?.getBoundingClientRect();
      const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
      const y = r ? r.top + r.height * 0.12 : window.innerHeight / 3;
      window.setTimeout(() => {
        audio.magic();
        fx.sparkles(x, y, 40, ["#ffd79a", "#fff", "#ffb26b"]);
        fx.cannons();
        fx.show(4600, 460);
        fx.hearts(10);
      }, 420);
      window.setTimeout(() => setShowNext(true), 1500);
      return true;
    });
  }, [fx]);

  const mic = useMicBlow(extinguish);

  useEffect(() => {
    if (out) mic.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [out]);

  useEffect(() => () => mic.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const listening = mic.status === "listening" && !out;

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-20 sm:px-6">
      <SceneTitle
        kicker="Step two"
        title={
          <>
            Make a wish and blow the candle <span className="inline-block anim-float">🕯️</span>
          </>
        }
        subtitle={
          out
            ? "Your wish has been sent to the stars — they're already working on it."
            : "Use your microphone and gently blow… or simply tap the candle."
        }
      />

      {/* ---------------- cake ---------------- */}
      <div
        ref={cakeRef}
        className="relative mt-8 w-[min(88vw,400px)] select-none sm:mt-10"
        style={{ animation: "floatY 7s ease-in-out infinite" }}
      >
        {/* warm candle light */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-14%] h-[62%] w-[120%] -translate-x-1/2 rounded-full transition-opacity duration-1000"
          style={{
            background: "radial-gradient(circle, rgba(255,196,120,.42), rgba(255,150,90,.12) 45%, transparent 70%)",
            filter: "blur(18px)",
            opacity: out ? 0 : 1,
          }}
        />

        {/* flame */}
        {!out && (
          <button
            onClick={extinguish}
            aria-label="Tap to blow out the candle"
            className="absolute left-1/2 top-0 z-20 h-[13%] w-16 -translate-x-1/2 cursor-pointer border-0 bg-transparent p-0"
          >
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 block h-16 w-16 rounded-full"
              style={{
                marginBottom: -22,
                background: "radial-gradient(circle, rgba(255,214,140,.75), rgba(255,140,60,.25) 45%, transparent 70%)",
                filter: "blur(6px)",
                animation: "haloPulse 1.6s ease-in-out infinite",
              }}
            />
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 block"
              style={{ animation: "flameFlicker .38s ease-in-out infinite", transformOrigin: "50% 100%" }}
            >
              <svg width="26" height="38" viewBox="0 0 24 34">
                <defs>
                  <radialGradient id="fl-o" cx="50%" cy="72%" r="62%">
                    <stop offset="0%" stopColor="#fff3c4" />
                    <stop offset="45%" stopColor="#ffb347" />
                    <stop offset="100%" stopColor="#ff5e3a" stopOpacity=".85" />
                  </radialGradient>
                </defs>
                <path d="M12 0c4 9 10 12 10 20a10 10 0 0 1-20 0C2 12 8 9 12 0Z" fill="url(#fl-o)" />
                <path d="M12 11c2 5 5 6.5 5 11a5 5 0 0 1-10 0c0-4.5 3-6 5-11Z" fill="#fff6d8" opacity=".92" />
              </svg>
            </span>
          </button>
        )}

        {/* smoke after blow-out */}
        {out &&
          [0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="absolute left-1/2 top-[10%] block h-6 w-6 rounded-full bg-white/35 blur-md"
              style={{ ["--sx" as string]: `${(i - 1) * 26}px`, animation: `smokeRise ${2.6 + i * 0.5}s ease-out ${i * 0.25}s infinite` }}
            />
          ))}

        <svg viewBox="0 0 320 268" className="w-full drop-shadow-[0_30px_50px_rgba(0,0,0,.55)]">
          <defs>
            <linearGradient id="tier" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe9f2" />
              <stop offset="55%" stopColor="#ffc3d8" />
              <stop offset="100%" stopColor="#e58aa9" />
            </linearGradient>
            <linearGradient id="tier2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff6e6" />
              <stop offset="60%" stopColor="#ffdcae" />
              <stop offset="100%" stopColor="#e0a86b" />
            </linearGradient>
            <linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fffdf9" />
              <stop offset="100%" stopColor="#ffe8f0" />
            </linearGradient>
            <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c9b6e8" />
              <stop offset="50%" stopColor="#f4ecff" />
              <stop offset="100%" stopColor="#b9a4dd" />
            </linearGradient>
            <linearGradient id="candle" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#ffd3e0" />
              <stop offset="100%" stopColor="#f291b0" />
            </linearGradient>
          </defs>

          {/* plate */}
          <ellipse cx="160" cy="250" rx="150" ry="15" fill="url(#plate)" opacity=".95" />
          <ellipse cx="160" cy="245" rx="126" ry="11" fill="#ffffff" opacity=".22" />

          {/* bottom tier */}
          <rect x="40" y="176" width="240" height="66" rx="12" fill="url(#tier)" />
          <path
            d="M40 190c0-8 5-14 12-14h216c7 0 12 6 12 14v6c-11 10-22 0-33 9s-22-1-33 8-22-1-33 8-22-1-33-8-22 1-33-8-22 1-33-9v-6Z"
            fill="url(#frost)"
          />
          {/* middle tier */}
          <rect x="70" y="120" width="180" height="60" rx="11" fill="url(#tier2)" />
          <path
            d="M70 132c0-7 5-12 11-12h158c6 0 11 5 11 12v6c-10 9-20 0-30 8s-20-1-29 7-20-1-30 7-20-1-30-7-20 1-30-8v-13Z"
            fill="url(#frost)"
          />
          {/* top tier */}
          <rect x="102" y="74" width="116" height="50" rx="10" fill="url(#tier)" />
          <path
            d="M102 84c0-6 4-10 10-10h96c6 0 10 4 10 10v5c-8 8-16 0-24 7s-16-1-24 6-16-1-24-6-16 1-24-7v-5Z"
            fill="url(#frost)"
          />

          {SPRINKLES.map((s, i) => (
            <rect key={i} x={s.x} y={s.y} width="3.4" height="7" rx="1.7" fill={s.c} transform={`rotate(${s.r} ${s.x} ${s.y})`} opacity=".9" />
          ))}

          {/* candle */}
          <rect x="152" y="30" width="16" height="48" rx="7" fill="url(#candle)" />
          <path d="M152 44h16M152 58h16M152 70h16" stroke="#ff7aa2" strokeWidth="3" strokeLinecap="round" opacity=".55" />
          <rect x="158.6" y="24" width="2.8" height="9" rx="1.4" fill="#5b3b2e" />
        </svg>
      </div>

      {/* ---------------- controls ---------------- */}
      <div className="mt-7 flex w-full max-w-md flex-col items-center gap-4">
        {!out && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="md"
                variant={listening ? "ghost" : "glow"}
                onClick={() => (listening ? mic.stop() : mic.start())}
                disabled={mic.status === "requesting"}
              >
                {mic.status === "requesting" ? "Asking permission…" : listening ? "Listening… blow now 🌬️" : "Blow with microphone 🎤"}
              </Button>
              <Button size="md" variant="ghost" onClick={extinguish}>
                Tap the candle 🕯️
              </Button>
            </div>

            {listening && (
              <div className="glass-soft w-full rounded-full p-1.5">
                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-[width] duration-100"
                    style={{
                      width: `${Math.min(100, mic.level * 130)}%`,
                      background: "linear-gradient(90deg,#8ef2d8,#ffd79a,#ff8fb1)",
                      boxShadow: "0 0 16px rgba(255,215,154,.75)",
                    }}
                  />
                  <span className="absolute left-[46%] top-0 h-full w-px bg-white/60" />
                </div>
              </div>
            )}

            {(mic.status === "denied" || mic.status === "unsupported") && (
              <p className="text-center text-xs text-amber-100/70">
                Microphone unavailable — no problem, just tap the candle to blow it out. ✨
              </p>
            )}
          </>
        )}

        {out && (
          <div className="reveal flex flex-col items-center gap-4 text-center">
            <p className="font-script text-[clamp(1.7rem,5.4vw,2.6rem)] text-aurora">Your wish is on its way…</p>
            {showNext && (
              <Button size="md" onClick={onDone}>
                See what's next →
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
