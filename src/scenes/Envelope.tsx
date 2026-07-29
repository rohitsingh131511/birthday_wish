import { useEffect, useRef, useState } from "react";
import { useParticles, centerOf } from "../lib/particles";
import { audio } from "../lib/audio";
import { letterLines } from "../config";
import { Button, SceneTitle } from "../components/ui";

type Phase = "closed" | "opening" | "letter";

export default function Envelope({ name, sender, onDone }: { name: string; sender: string; onDone: () => void }) {
  const fx = useParticles();
  const [phase, setPhase] = useState<Phase>("closed");
  const [hide, setHide] = useState(false);
  const [line, setLine] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const open = () => {
    if (phase !== "closed") return;
    audio.paper();
    const { x, y } = centerOf(boxRef.current);
    fx.sparkles(x, y, 30, ["#ffd79a", "#fff", "#ff8fb1"]);
    setPhase("opening");
    window.setTimeout(() => setHide(true), 700);
    window.setTimeout(() => {
      audio.chime();
      fx.hearts(10);
      fx.confetti(x, y, { count: 34, speed: 380, colors: ["#ffd79a", "#ff8fb1", "#fff"], life: 2.4 });
      setPhase("letter");
    }, 950);
  };

  useEffect(() => {
    if (phase !== "letter" || line >= letterLines.length + 1) return;
    const t = window.setTimeout(() => setLine((l) => l + 1), line === 0 ? 500 : 1250);
    return () => clearTimeout(t);
  }, [phase, line]);

  const opened = phase !== "closed";

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-20 sm:px-6">
      {phase !== "letter" && (
        <SceneTitle
          kicker="Step four"
          title={
            <>
              A Special Message For You <span className="inline-block anim-float">❤️</span>
            </>
          }
          subtitle="Break the seal — some words are too warm to keep inside."
        />
      )}

      {/* ---------- envelope ---------- */}
      {phase !== "letter" && (
        <div className="mt-10 w-[min(90vw,440px)]" style={{ perspective: "1200px" }}>
          <div
            ref={boxRef}
            role="button"
            tabIndex={0}
            onClick={open}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
            aria-label="Open the envelope"
            className={`group relative aspect-[3/2] w-full cursor-pointer transition-all duration-500 ${
              hide ? "-translate-y-6 scale-90 opacity-0" : "hover:-translate-y-1.5"
            }`}
            style={{ transformStyle: "preserve-3d", animation: opened ? "none" : "floatY 6s ease-in-out infinite" }}
          >
            <span
              aria-hidden
              className="absolute -inset-6 rounded-[40px] opacity-80 blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(255,178,205,.45), transparent 68%)" }}
            />
            {/* body */}
            <div
              className="absolute inset-0 rounded-[18px] shadow-[0_30px_60px_-18px_rgba(0,0,0,.7)]"
              style={{ background: "linear-gradient(150deg,#fff3e4,#f7d9c6 55%,#e9bda6)" }}
            />
            {/* letter peeking */}
            <div
              className="absolute inset-x-[7%] top-[8%] h-[76%] rounded-[10px] bg-[linear-gradient(160deg,#fffdf7,#fdf1e0)] shadow-lg transition-transform duration-700 ease-out"
              style={{ transform: phase === "opening" ? "translateY(-46%) scale(1.03)" : "translateY(6%)" }}
            >
              <div className="space-y-2 p-4 opacity-40">
                {[92, 80, 86, 66].map((w, i) => (
                  <span key={i} className="block h-1.5 rounded-full bg-[#c9a6b8]" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
            {/* pockets */}
            <div
              className="absolute inset-0 rounded-[18px]"
              style={{ background: "linear-gradient(120deg,#ffe9d6,#f0c9b3)", clipPath: "polygon(0 0,50% 52%,0 100%)" }}
            />
            <div
              className="absolute inset-0 rounded-[18px]"
              style={{ background: "linear-gradient(240deg,#ffe9d6,#eec3ab)", clipPath: "polygon(100% 0,50% 52%,100% 100%)" }}
            />
            <div
              className="absolute inset-0 rounded-[18px]"
              style={{ background: "linear-gradient(0deg,#f8dcc8,#ffeede)", clipPath: "polygon(0 100%,50% 50%,100% 100%)" }}
            />
            {/* flap */}
            <div
              className="absolute inset-0 origin-top rounded-[18px] transition-transform duration-[900ms] ease-[cubic-bezier(.3,.9,.3,1.1)]"
              style={{
                background: "linear-gradient(180deg,#fff5e9,#f0cdb6)",
                clipPath: "polygon(0 0,50% 60%,100% 0)",
                transform: opened ? "rotateX(-172deg)" : "rotateX(0deg)",
                zIndex: opened ? 0 : 5,
                backfaceVisibility: "hidden",
              }}
            />
            {/* wax seal */}
            <div
              className={`absolute left-1/2 top-[52%] z-10 grid h-[19%] min-h-[46px] w-[19%] min-w-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center transition-all duration-500 ${
                opened ? "scale-0 opacity-0" : "group-hover:scale-110"
              }`}
            >
              <span
                className="grid h-full w-full place-items-center rounded-full font-display text-lg text-[#4d0f22] shadow-[0_10px_24px_rgba(120,10,40,.55)]"
                style={{
                  background: "radial-gradient(circle at 34% 28%, #ff8ba7, #c2185b 55%, #7d0d33)",
                  borderRadius: "48% 52% 45% 55%/52% 46% 54% 48%",
                }}
              >
                <span className="opacity-80">{name.charAt(0).toUpperCase()}</span>
              </span>
            </div>
          </div>

          <p className="mt-7 text-center text-[0.72rem] uppercase tracking-[0.3em] text-white/45">tap the envelope</p>
        </div>
      )}

      {/* ---------- letter ---------- */}
      {phase === "letter" && (
        <div className="scene-enter w-full max-w-[720px]">
          <div
            className="relative overflow-hidden rounded-[22px] px-6 py-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)] sm:rounded-[30px] sm:px-12 sm:py-12"
            style={{
              background: "linear-gradient(160deg,#fffdf6 0%,#fdf3e6 48%,#f9e7dc 100%)",
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(196,150,170,.10) 0 1px, transparent 1px 34px), linear-gradient(160deg,#fffdf6,#faeade)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full opacity-50 blur-2xl"
              style={{ background: "radial-gradient(circle,#ffd79a,transparent 70%)" }}
            />
            <p className="font-script text-[clamp(2rem,7vw,3.2rem)] leading-none text-[#a3336b]">Dear {name},</p>

            <div className="mt-6 space-y-4">
              {letterLines.map((l, i) => (
                <p
                  key={i}
                  className={`font-display text-[clamp(0.98rem,2.7vw,1.16rem)] italic leading-[1.85] text-[#3d2436] ${
                    i < line ? "reveal" : "invisible"
                  }`}
                  style={{ animationDelay: "60ms" }}
                >
                  {l}
                </p>
              ))}
            </div>

            <div className={`mt-8 text-right ${line > letterLines.length ? "reveal" : "invisible"}`}>
              <p className="font-display text-sm tracking-wide text-[#7b5468]">With all my heart,</p>
              <p className="font-script text-[clamp(1.7rem,5.5vw,2.4rem)] leading-tight text-[#a3336b]">{sender}</p>
            </div>

            <span aria-hidden className="pointer-events-none absolute bottom-4 left-6 text-2xl opacity-30">
              🌷
            </span>
          </div>

          <div className="mt-7 flex justify-center">
            <Button size="md" onClick={onDone}>
              There's one more thing 🎁
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
