import { useMemo } from "react";

/** Ambient cinematic backdrop: aurora blobs, twinkling stars, drifting bokeh. */
export default function Background() {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.4,
        delay: Math.random() * 6,
        dur: 2.6 + Math.random() * 4.5,
      })),
    [],
  );

  const bokeh = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: Math.random() * 100,
        top: 20 + Math.random() * 90,
        size: 40 + Math.random() * 130,
        delay: Math.random() * 12,
        dur: 16 + Math.random() * 18,
        hue: ["255,143,177", "255,215,154", "184,146,255", "142,242,216"][i % 4],
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* aurora blobs */}
      <div
        className="absolute -left-[18vw] -top-[16vh] h-[62vh] w-[62vh] rounded-full opacity-60 blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(255,143,177,.55), transparent 68%)", animation: "floatY 14s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-[14vw] top-[6vh] h-[56vh] w-[56vh] rounded-full opacity-55 blur-[100px]"
        style={{ background: "radial-gradient(circle, rgba(148,132,255,.55), transparent 68%)", animation: "floatY 18s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute bottom-[-22vh] left-[22vw] h-[64vh] w-[64vh] rounded-full opacity-45 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(255,215,154,.45), transparent 70%)", animation: "floatY 21s ease-in-out infinite" }}
      />

      {/* stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: "0 0 8px rgba(255,255,255,.85)",
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* drifting bokeh */}
      {bokeh.map((b, i) => (
        <span
          key={`b${i}`}
          className="absolute rounded-full"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 32% 30%, rgba(${b.hue},.28), rgba(${b.hue},.05) 62%, transparent 72%)`,
            filter: "blur(2px)",
            animation: `bokehRise ${b.dur}s linear ${b.delay}s infinite`,
          }}
        />
      ))}

      {/* vignette + grain */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 40%, rgba(4,1,12,.72) 100%)" }} />
      <style>{`@keyframes bokehRise{0%{transform:translate3d(0,0,0) scale(.85);opacity:0}12%{opacity:.85}100%{transform:translate3d(6vw,-115vh,0) scale(1.25);opacity:0}}`}</style>
    </div>
  );
}
