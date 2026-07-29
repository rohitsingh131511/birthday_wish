import { useEffect, useState } from "react";
import { useParticles } from "../lib/particles";
import { audio } from "../lib/audio";
import { wishes } from "../config";
import { Button, GlassCard, SceneTitle } from "../components/ui";

function Rose({ uid, c1, c2, x, y, s, rot }: { uid: string; c1: string; c2: string; x: number; y: number; s: number; rot: number }) {
  const outer = Array.from({ length: 7 }, (_, i) => i * (360 / 7));
  const mid = Array.from({ length: 5 }, (_, i) => i * 72 + 32);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}>
      <defs>
        <radialGradient id={`r${uid}`} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".85" />
          <stop offset="35%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      {outer.map((a) => (
        <ellipse key={a} cx="0" cy="-19" rx="12.5" ry="17" fill={c2} opacity=".95" transform={`rotate(${a})`} />
      ))}
      {outer.map((a) => (
        <ellipse key={`i${a}`} cx="0" cy="-14" rx="10" ry="13.5" fill={`url(#r${uid})`} transform={`rotate(${a + 24})`} />
      ))}
      {mid.map((a) => (
        <ellipse key={`m${a}`} cx="0" cy="-8" rx="7.5" ry="10" fill={c1} opacity=".95" transform={`rotate(${a})`} />
      ))}
      <circle r="6.5" fill={c2} />
      <path d="M0 -4.6A4.6 4.6 0 1 1 -3.4 3.2" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

const ROSES = [
  { x: 160, y: 78, s: 1.15, rot: 8, c1: "#ff9ec4", c2: "#d63f6f" },
  { x: 96, y: 116, s: 0.95, rot: -14, c1: "#ffb8cf", c2: "#e05780" },
  { x: 226, y: 112, s: 0.98, rot: 18, c1: "#ff8fb1", c2: "#c62f63" },
  { x: 124, y: 166, s: 0.86, rot: -6, c1: "#ffd0e0", c2: "#e8608c" },
  { x: 200, y: 170, s: 0.9, rot: 12, c1: "#ffa9c6", c2: "#cf3d6d" },
];

export default function Roses({ onDone }: { onDone: () => void }) {
  const fx = useParticles();
  const [shown, setShown] = useState(0);
  const done = shown >= wishes.length;

  useEffect(() => {
    fx.petals(30);
    const petalTimer = window.setInterval(() => fx.petals(9), 2600);
    return () => clearInterval(petalTimer);
  }, [fx]);

  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => {
      setShown((s) => s + 1);
      audio.sparkle();
    }, shown === 0 ? 700 : 1500);
    return () => clearTimeout(t);
  }, [shown, done]);

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-20 sm:px-6">
      <SceneTitle kicker="Step three" title="A bouquet, just for you 🌹" subtitle="Every petal carries a wish written with love." />

      <div className="container-fluid mt-8 w-full max-w-6xl px-0">
        <div className="row g-4 g-lg-5 align-items-center justify-content-center">
          {/* bouquet */}
          <div className="col-11 col-sm-8 col-md-6 col-lg-5">
            <div className="relative mx-auto w-full max-w-[380px]" style={{ animation: "floatY 8s ease-in-out infinite" }}>
              <div
                aria-hidden
                className="absolute inset-x-4 top-4 h-2/3 rounded-full opacity-70 blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(255,143,177,.55), transparent 68%)" }}
              />
              <svg viewBox="0 0 320 340" className="relative w-full drop-shadow-[0_26px_44px_rgba(0,0,0,.5)]">
                <defs>
                  <linearGradient id="wrapg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity=".38" />
                    <stop offset="45%" stopColor="#ffd8e6" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#b892ff" stopOpacity=".3" />
                  </linearGradient>
                  <linearGradient id="stemg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5fbf7f" />
                    <stop offset="100%" stopColor="#2c7a4b" />
                  </linearGradient>
                </defs>

                {/* stems */}
                {ROSES.map((r, i) => (
                  <path
                    key={i}
                    d={`M${r.x} ${r.y + 14} Q ${(r.x + 160) / 2} ${r.y + 110} 160 302`}
                    fill="none"
                    stroke="url(#stemg)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ))}
                {/* leaves */}
                {[
                  { x: 112, y: 222, r: -38 },
                  { x: 208, y: 232, r: 42 },
                  { x: 150, y: 250, r: -10 },
                ].map((l, i) => (
                  <ellipse key={i} cx={l.x} cy={l.y} rx="26" ry="11" fill="#3f9d63" transform={`rotate(${l.r} ${l.x} ${l.y})`} opacity=".92" />
                ))}

                {/* wrapping paper */}
                <path d="M66 322 Q160 344 254 322 L214 186 Q160 208 106 186 Z" fill="url(#wrapg)" stroke="rgba(255,255,255,.42)" strokeWidth="1.4" />
                <path d="M106 186 Q160 208 214 186 L196 250 Q160 264 124 250 Z" fill="rgba(255,255,255,.14)" />

                {/* ribbon */}
                <rect x="98" y="252" width="124" height="15" rx="7" fill="#ffd79a" opacity=".92" />
                <path d="M160 259c-16-16-36-12-34 3 2 12 22 9 34-3Zm0 0c16-16 36-12 34 3-2 12-22 9-34-3Z" fill="#ff9ec4" />
                <circle cx="160" cy="259" r="6" fill="#fff1cf" />

                {ROSES.map((r, i) => (
                  <Rose key={i} uid={`x${i}`} {...r} />
                ))}
              </svg>
            </div>
          </div>

          {/* wishes */}
          <div className="col-12 col-md-10 col-lg-6">
            <GlassCard className="p-5 sm:p-7">
              <p className="mb-4 text-[0.62rem] font-medium uppercase tracking-[0.4em] text-amber-100/70">Birthday wishes</p>
              <ul className="space-y-3">
                {wishes.map((w, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 sm:p-3.5 ${
                      i < shown ? "reveal" : "invisible"
                    }`}
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg"
                      style={{ background: "linear-gradient(140deg,rgba(255,215,154,.35),rgba(255,143,177,.25))" }}
                    >
                      {w.icon}
                    </span>
                    <span className="pt-1 text-[0.92rem] font-light leading-relaxed text-white/85 sm:text-[1rem]">{w.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-end">
                <Button size="sm" variant={done ? "glow" : "ghost"} onClick={onDone}>
                  {done ? "Open your message →" : "Skip ahead →"}
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
