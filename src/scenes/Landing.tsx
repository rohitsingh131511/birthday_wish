import { useParticles } from "../lib/particles";
import { audio } from "../lib/audio";
import { Button, Pill } from "../components/ui";

const deco = [
  { left: "6%", top: "18%", c: "#ff8fb1", s: 58, d: 0 },
  { left: "84%", top: "14%", c: "#ffd79a", s: 46, d: 1.4 },
  { left: "13%", top: "68%", c: "#b892ff", s: 40, d: 2.6 },
  { left: "88%", top: "62%", c: "#8ef2d8", s: 52, d: 0.8 },
];

export default function Landing({ name, onStart }: { name: string; onStart: () => void }) {
  const fx = useParticles();

  const start = () => {
    audio.unlock();
    audio.chime();
    audio.startMusic();
    fx.cannons();
    setTimeout(() => fx.rocket(), 200);
    onStart();
  };

  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
      {/* decorative floating balloons */}
      {deco.map((b, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute hidden opacity-70 sm:block"
          style={{ left: b.left, top: b.top, animation: `floatY ${7 + i}s ease-in-out ${b.d}s infinite` }}
        >
          <span
            className="block rounded-[50%_50%_48%_48%/58%_58%_42%_42%]"
            style={{
              width: b.s,
              height: b.s * 1.24,
              background: `radial-gradient(circle at 32% 26%, #fff9, ${b.c} 46%, rgba(0,0,0,.35))`,
              boxShadow: `0 18px 50px -12px ${b.c}88`,
            }}
          />
        </span>
      ))}

      <div className="reveal" style={{ animationDelay: "40ms" }}>
        <Pill className="mb-7">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-200" />
          A magical surprise awaits
        </Pill>
      </div>

      <h1 className="relative z-10 font-display leading-[1.05]">
        <span
          className="reveal block text-[clamp(1.9rem,7.4vw,4.2rem)] font-medium tracking-tight text-white/95 glow-soft"
          style={{ animationDelay: "160ms" }}
        >
          Happy Birthday,
        </span>
        <span
          className="reveal mt-1 block font-script text-[clamp(3.4rem,15vw,8.5rem)] leading-[1] text-aurora"
          style={{ animationDelay: "300ms", paddingBottom: "0.12em" }}
        >
          {name}
          <span
            className="ml-2 inline-block align-middle font-sans text-[clamp(1.4rem,4.6vw,2.6rem)]"
            style={{ animation: "floatY 3.4s ease-in-out infinite" }}
          >
            🎉
          </span>
        </span>
      </h1>

      <p
        className="reveal mx-auto mt-4 max-w-[46ch] text-[clamp(0.95rem,2.6vw,1.15rem)] font-light leading-relaxed text-white/70"
        style={{ animationDelay: "430ms" }}
      >
        Balloons to pop, a candle to blow, roses, a letter and a gift — an entire little world built just for you. 🎉
      </p>

      <div className="reveal relative mt-10 sm:mt-12" style={{ animationDelay: "560ms" }}>
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-pink-200/40"
          style={{ animation: "ringPulse 2.6s ease-out infinite" }}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-amber-200/40"
          style={{ animation: "ringPulse 2.6s ease-out .9s infinite" }}
        />
        <Button size="lg" onClick={start} className="relative">
          Start Celebration ✨
        </Button>
      </div>

      <p className="reveal mt-8 text-[0.72rem] tracking-[0.24em] text-white/40 uppercase" style={{ animationDelay: "700ms" }}>
        Best experienced with sound on 🔊
      </p>
    </div>
  );
}
