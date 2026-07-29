import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleProvider } from "./lib/particles";
import { audio } from "./lib/audio";
import { defaultName, defaultSender, memories } from "./config";
import Background from "./components/Background";
import TopNav, { type Step } from "./components/TopNav";
import Landing from "./scenes/Landing";
import Balloons from "./scenes/Balloons";
import Cake from "./scenes/Cake";
import Roses from "./scenes/Roses";
import Envelope from "./scenes/Envelope";
import Gift from "./scenes/Gift";
import Finale from "./scenes/Finale";

const STEPS: Step[] = [
  { key: "landing", label: "Welcome", icon: "🏡" },
  { key: "balloons", label: "Pop the balloons", icon: "🎈" },
  { key: "cake", label: "Blow the candle", icon: "🎂" },
  { key: "roses", label: "Roses & wishes", icon: "🌹" },
  { key: "letter", label: "Your letter", icon: "💌" },
  { key: "gift", label: "The gift", icon: "🎁" },
  { key: "finale", label: "Grand finale", icon: "🎊" },
];

function Experience() {
  const [idx, setIdx] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [flash, setFlash] = useState(0);
  const [muted, setMuted] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem("bd-name") || defaultName);
  const [sender, setSender] = useState(() => localStorage.getItem("bd-sender") || defaultSender);

  const idxRef = useRef(0);
  idxRef.current = idx;
  const busy = useRef(false);

  const go = useCallback((target: number) => {
    if (busy.current || target === idxRef.current) return;
    busy.current = true;
    setLeaving(true);
    audio.whoosh();
    window.setTimeout(() => {
      setIdx(target);
      idxRef.current = target;
      setUnlocked((u) => Math.max(u, target));
      setFlash((f) => f + 1);
      setLeaving(false);
      window.scrollTo({ top: 0, behavior: "auto" });
      busy.current = false;
    }, 540);
  }, []);

  const next = useCallback(() => go(Math.min(idxRef.current + 1, STEPS.length - 1)), [go]);

  // preload gallery once the guest is a few steps in
  useEffect(() => {
    if (idx < 3) return;
    memories.forEach((m) => {
      const img = new Image();
      img.src = m.src;
    });
  }, [idx]);

  useEffect(() => {
    if (idx === STEPS.length - 1) setUnlocked(STEPS.length - 1);
  }, [idx]);

  const toggleMute = () => {
    setMuted((m) => {
      const v = !m;
      audio.setMuted(v);
      if (!v) audio.unlock();
      return v;
    });
  };

  const save = (n: string, s: string) => {
    setName(n);
    setSender(s);
    localStorage.setItem("bd-name", n);
    localStorage.setItem("bd-sender", s);
    audio.sparkle();
  };

  const scene = (() => {
    switch (STEPS[idx].key) {
      case "landing":
        return <Landing name={name} onStart={next} />;
      case "balloons":
        return <Balloons onDone={next} />;
      case "cake":
        return <Cake onDone={next} />;
      case "roses":
        return <Roses onDone={next} />;
      case "letter":
        return <Envelope name={name} sender={sender} onDone={next} />;
      case "gift":
        return <Gift onDone={next} />;
      default:
        return <Finale name={name} sender={sender} onReplay={() => go(0)} />;
    }
  })();

  return (
    <>
      <TopNav
        steps={STEPS}
        current={idx}
        unlocked={unlocked}
        onJump={go}
        muted={muted}
        onToggleMute={toggleMute}
        name={name}
        sender={sender}
        onSave={save}
      />

      <main className="relative z-10 w-full">
        <div key={idx} className={leaving ? "scene-exit" : "scene-enter"}>
          {scene}
        </div>
      </main>

      {/* cinematic flash between scenes */}
      {flash > 0 && (
        <div
          key={`flash-${flash}`}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[55]"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,240,205,.6), rgba(255,163,205,.22) 42%, transparent 72%)",
            animation: "flashOut .95s ease-out forwards",
          }}
        />
      )}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  return (
    <ParticleProvider>
      <Background />
      <Experience />
    </ParticleProvider>
  );
}
