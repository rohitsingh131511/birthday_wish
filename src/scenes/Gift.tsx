import { useRef, useState } from "react";
import { centerOf, useParticles } from "../lib/particles";
import { audio } from "../lib/audio";
import { Button, SceneTitle } from "../components/ui";

export default function Gift({ onDone }: { onDone: () => void }) {
  const fx = useParticles();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    audio.launch();
    const { x, y } = centerOf(ref.current);
    fx.sparkles(x, y, 34, ["#ffd79a", "#fff", "#b892ff"]);
    window.setTimeout(() => {
      audio.firework();
      audio.magic();
      fx.confetti(x, y - 20, { count: 90, speed: 900, life: 3.4 });
      fx.explode(x, y - 40, "#ffd79a", 80);
      fx.cannons();
      fx.hearts(14);
    }, 380);
    window.setTimeout(onDone, 2100);
  };

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-20 sm:px-6">
      <SceneTitle
        kicker="Step five"
        title={
          <>
            Tap to Open Your Surprise <span className="inline-block anim-float">🎁</span>
          </>
        }
        subtitle="Something glowing is waiting inside this little box."
      />

      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label="Open the gift box"
        onClick={handleOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
        className={`relative mt-12 aspect-square w-[min(74vw,320px)] cursor-pointer transition-transform duration-500 ${
          open ? "" : "hover:-translate-y-2 active:scale-95"
        }`}
        style={{ animation: open ? "none" : "floatY 5.5s ease-in-out infinite" }}
      >
        {/* aura */}
        <span
          aria-hidden
          className="absolute -inset-8 rounded-full blur-3xl transition-opacity duration-700"
          style={{
            background: "radial-gradient(circle, rgba(255,215,154,.55), rgba(184,146,255,.25) 45%, transparent 70%)",
            opacity: open ? 1 : 0.7,
            animation: "haloPulse 3s ease-in-out infinite",
          }}
        />

        {/* light beam */}
        {open && (
          <span
            aria-hidden
            className="absolute bottom-[46%] left-1/2 block h-[120%] w-[46%] origin-bottom"
            style={{
              background: "linear-gradient(to top, rgba(255,240,200,.95), rgba(255,200,240,.35) 45%, transparent 85%)",
              filter: "blur(10px)",
              clipPath: "polygon(38% 100%, 62% 100%, 100% 0, 0 0)",
              animation: "beamGrow 1.8s ease-out forwards",
            }}
          />
        )}

        {/* orbiting sparkles */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-100"
            style={{
              left: `${50 + 46 * Math.cos((i / 6) * 6.283)}%`,
              top: `${52 + 42 * Math.sin((i / 6) * 6.283)}%`,
              boxShadow: "0 0 12px #ffd79a",
              animation: `twinkle ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}

        {/* box base */}
        <div
          className="absolute inset-x-[6%] bottom-[4%] h-[58%] overflow-hidden rounded-[14px] shadow-[0_30px_60px_-18px_rgba(0,0,0,.75)]"
          style={{ background: "linear-gradient(150deg,#ff9ec4 0%,#e0518a 48%,#8b2c67 100%)" }}
        >
          <span className="absolute inset-y-0 left-1/2 w-[18%] -translate-x-1/2" style={{ background: "linear-gradient(180deg,#ffe9b8,#f2b95c)" }} />
          <span className="absolute inset-0" style={{ background: "linear-gradient(105deg,rgba(255,255,255,.35),transparent 42%)" }} />
          {open && (
            <span
              className="absolute inset-x-0 top-0 h-3"
              style={{ background: "linear-gradient(180deg,rgba(255,245,210,.95),transparent)", filter: "blur(3px)" }}
            />
          )}
        </div>

        {/* lid */}
        <div
          className="absolute left-[0%] top-[26%] h-[20%] w-full transition-all duration-[1100ms] ease-[cubic-bezier(.2,.8,.3,1)]"
          style={{ transform: open ? "translate(6%, -175%) rotate(-26deg)" : "none", opacity: open ? 0 : 1 }}
        >
          <div
            className="relative h-full w-full rounded-[12px] shadow-[0_16px_34px_-10px_rgba(0,0,0,.6)]"
            style={{ background: "linear-gradient(150deg,#ffb3d1 0%,#e75f9b 55%,#a03574 100%)" }}
          >
            <span className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2" style={{ background: "linear-gradient(180deg,#ffe9b8,#f2b95c)" }} />
            {/* bow */}
            <span
              className="absolute -top-[62%] left-1/2 h-[72%] w-[34%] -translate-x-[104%] rounded-[60%_40%_60%_40%] border-2 border-amber-200/60"
              style={{ background: "linear-gradient(140deg,#ffe9b8,#f0a93f)", transform: "translateX(-104%) rotate(-22deg)" }}
            />
            <span
              className="absolute -top-[62%] left-1/2 h-[72%] w-[34%] rounded-[40%_60%_40%_60%] border-2 border-amber-200/60"
              style={{ background: "linear-gradient(220deg,#ffe9b8,#f0a93f)", transform: "translateX(4%) rotate(22deg)" }}
            />
            <span
              className="absolute -top-[16%] left-1/2 h-[34%] w-[16%] -translate-x-1/2 rounded-full"
              style={{ background: "radial-gradient(circle at 34% 30%,#fff6dc,#eaa93c)" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 h-12">
        {!open ? (
          <p className="reveal text-[0.72rem] uppercase tracking-[0.3em] text-white/45">tap the box</p>
        ) : (
          <Button size="sm" variant="ghost" onClick={onDone}>
            Reveal →
          </Button>
        )}
      </div>
    </div>
  );
}
