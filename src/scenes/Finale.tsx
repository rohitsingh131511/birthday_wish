import { useEffect, useState } from "react";
import { useParticles } from "../lib/particles";
import { audio } from "../lib/audio";
import { memories } from "../config";
import { Button, GlassCard, Pill } from "../components/ui";

export default function Finale({ name, sender, onReplay }: { name: string; sender: string; onReplay: () => void }) {
  const fx = useParticles();
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    audio.chime();
    fx.show(6000, 620);
    fx.cannons();
    fx.hearts(20);
    const hearts = window.setInterval(() => fx.hearts(6), 2600);
    const bursts = window.setInterval(() => {
      fx.rocket();
      audio.firework();
    }, 5200);
    return () => {
      clearInterval(hearts);
      clearInterval(bursts);
    };
  }, [fx]);

  const shower = () => {
    audio.heartbeat();
    fx.hearts(26);
    fx.cannons();
  };

  return (
    <div className="flex min-h-[100svh] w-full flex-col items-center justify-center px-4 py-24 sm:px-6">
      <div className="reveal">
        <Pill className="mb-6">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-pink-300" />
          Your surprise is unwrapped
        </Pill>
      </div>

      <h2 className="text-center font-display leading-[1.05]">
        <span className="reveal block text-[clamp(1.5rem,5.4vw,2.6rem)] font-medium text-white/95 glow-soft" style={{ animationDelay: "80ms" }}>
          Happy Birthday
        </span>
        <span
          className="reveal mt-1 block font-script text-[clamp(3rem,13vw,7rem)] leading-[1] text-aurora"
          style={{ animationDelay: "200ms", paddingBottom: "0.1em" }}
        >
          {name} ❤️
        </span>
      </h2>

      <p
        className="reveal mx-auto mt-3 max-w-[54ch] text-center text-[clamp(0.94rem,2.5vw,1.1rem)] font-light leading-relaxed text-white/70"
        style={{ animationDelay: "320ms" }}
      >
        Here's to the memories we've collected — and to all the beautiful ones still waiting to happen.
      </p>

      {/* ---------- gallery ---------- */}
      <div className="container-fluid mt-10 w-full max-w-6xl px-0">
        <div className="row g-3 g-md-4">
          {memories.map((m, i) => (
            <div key={m.src} className="col-6 col-md-4">
              <button
                onClick={() => {
                  audio.sparkle();
                  setLightbox(i);
                }}
                className="reveal group relative block w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 sm:rounded-3xl"
                style={{ animationDelay: `${380 + i * 110}ms` }}
              >
                <span className="block aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={m.src}
                    alt={m.caption}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                </span>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12061f]/85 via-transparent to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-left">
                  <span className="font-display text-[0.78rem] text-white/90 sm:text-[0.92rem]">{m.caption}</span>
                  <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">🔍</span>
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-3xl"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(255,215,154,.65), 0 0 40px rgba(255,143,177,.35)" }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- final message ---------- */}
      <GlassCard className="reveal mt-10 w-full max-w-3xl p-6 text-center sm:p-10" style={{ animationDelay: "300ms" }}>
        <span className="text-3xl">🎂</span>
        <p className="mt-4 font-display text-[clamp(1.05rem,3vw,1.4rem)] italic leading-[1.8] text-white/90">
          “You make ordinary days feel like celebrations. Today the whole world gets to celebrate you — and I get the joy of
          watching you shine.”
        </p>
        <p className="mt-5 font-script text-[clamp(1.5rem,4.6vw,2.1rem)] text-gold">— {sender}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="md" onClick={shower}>
            Send more love 💖
          </Button>
          <Button size="md" variant="ghost" onClick={onReplay}>
            Replay the magic ↺
          </Button>
        </div>
      </GlassCard>

      <p className="mt-10 text-center text-[0.68rem] uppercase tracking-[0.34em] text-white/35">made with love, confetti & code</p>

      {/* ---------- lightbox ---------- */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#08040f]/85 p-4 backdrop-blur-xl"
          onClick={() => setLightbox(null)}
          style={{ animation: "riseFade .4s ease both" }}
        >
          <div className="glass glass-edge relative max-h-[88svh] w-full max-w-3xl overflow-hidden rounded-3xl p-2">
            <img src={memories[lightbox].src} alt={memories[lightbox].caption} className="max-h-[74svh] w-full rounded-2xl object-contain" />
            <div className="flex items-center justify-between px-3 py-3">
              <span className="font-display text-sm text-white/85">{memories[lightbox].caption}</span>
              <span className="text-xs uppercase tracking-[0.25em] text-white/45">tap anywhere to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
