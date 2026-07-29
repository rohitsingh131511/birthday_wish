import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

type Shape = "confetti" | "ribbon" | "spark" | "heart" | "petal" | "ring" | "rocket" | "star";

type P = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  g: number;
  drag: number;
  age: number;
  life: number;
  size: number;
  color: string;
  shape: Shape;
  rot: number;
  vrot: number;
  flutter: number;
  glow: boolean;
  payload?: { color: string; count: number };
};

export type BurstOpts = {
  count?: number;
  speed?: number;
  spread?: number;
  angle?: number;
  colors?: string[];
  gravity?: number;
  scalar?: number;
  life?: number;
  shapes?: Shape[];
};

const FESTIVE = ["#ff8fb1", "#ffd79a", "#b892ff", "#8ef2d8", "#ffffff", "#ff6f91", "#7cc4ff", "#ffe45e"];
const WARM = ["#ffd79a", "#ffb26b", "#ff8fb1", "#fff1cf"];

export type ParticleAPI = {
  confetti: (x: number, y: number, o?: BurstOpts) => void;
  sparkles: (x: number, y: number, count?: number, colors?: string[]) => void;
  ring: (x: number, y: number, color?: string, size?: number) => void;
  explode: (x: number, y: number, color?: string, count?: number) => void;
  rocket: (x?: number, targetY?: number, color?: string) => void;
  show: (ms: number, rate?: number) => void;
  cannons: () => void;
  hearts: (count?: number) => void;
  petals: (count?: number) => void;
  clear: () => void;
};

const Ctx = createContext<ParticleAPI | null>(null);
export const useParticles = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useParticles must be used inside <ParticleProvider>");
  return v;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

export function ParticleProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parts = useRef<P[]>([]);
  const timers = useRef<number[]>([]);
  const size = useRef({ w: 0, h: 0 });

  const push = (p: Partial<P>) => {
    const arr = parts.current;
    if (arr.length > 1500) arr.splice(0, arr.length - 1500);
    arr.push({
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      vx: 0,
      vy: 0,
      g: 900,
      drag: 0.86,
      age: 0,
      life: 2,
      size: 8,
      color: "#fff",
      shape: "confetti",
      rot: Math.random() * Math.PI * 2,
      vrot: rand(-8, 8),
      flutter: Math.random() * Math.PI * 2,
      glow: false,
      ...p,
    } as P);
  };

  const api = useMemo<ParticleAPI>(() => {
    const explode = (x: number, y: number, color?: string, count = 64) => {
      const hue = color ?? pick(FESTIVE);
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + rand(-0.08, 0.08);
        const sp = rand(150, 460) * (Math.random() < 0.25 ? 0.55 : 1);
        push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          g: 190,
          drag: 0.9,
          life: rand(1.1, 2.1),
          size: rand(1.6, 3.4),
          color: Math.random() < 0.22 ? "#ffffff" : hue,
          shape: "spark",
          glow: true,
        });
      }
      push({ x, y, px: x, py: y, vx: 0, vy: 0, g: 0, life: 0.55, size: 6, color: hue, shape: "ring", glow: true });
    };

    const confetti = (x: number, y: number, o: BurstOpts = {}) => {
      const {
        count = 46,
        speed = 460,
        spread = Math.PI * 2,
        angle = -Math.PI / 2,
        colors = FESTIVE,
        gravity = 900,
        scalar = 1,
        life = 2.6,
        shapes = ["confetti", "ribbon", "star"],
      } = o;
      for (let i = 0; i < count; i++) {
        const a = angle + rand(-spread / 2, spread / 2);
        const sp = speed * rand(0.35, 1);
        push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          g: gravity,
          drag: 0.9,
          life: life * rand(0.75, 1.25),
          size: rand(6, 13) * scalar,
          color: pick(colors),
          shape: pick(shapes),
          vrot: rand(-12, 12),
        });
      }
    };

    const sparkles = (x: number, y: number, count = 22, colors = WARM) => {
      for (let i = 0; i < count; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(40, 240);
        push({
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 40,
          g: 120,
          drag: 0.9,
          life: rand(0.7, 1.6),
          size: rand(1.4, 3),
          color: pick(colors),
          shape: "spark",
          glow: true,
        });
      }
    };

    const ring = (x: number, y: number, color = "#ffd79a", s = 6) =>
      push({ x, y, px: x, py: y, vx: 0, vy: 0, g: 0, life: 0.7, size: s, color, shape: "ring", glow: true });

    const rocket = (x?: number, targetY?: number, color?: string) => {
      const w = size.current.w || window.innerWidth;
      const h = size.current.h || window.innerHeight;
      const sx = x ?? rand(w * 0.14, w * 0.86);
      const ty = targetY ?? rand(h * 0.12, h * 0.42);
      const dist = h - ty;
      push({
        x: sx,
        y: h + 10,
        px: sx,
        py: h + 10,
        vx: rand(-40, 40),
        vy: -Math.sqrt(2 * 260 * dist) * 0.92,
        g: 260,
        drag: 1,
        life: 3,
        size: 2.6,
        color: color ?? pick(FESTIVE),
        shape: "rocket",
        glow: true,
        payload: { color: color ?? pick(FESTIVE), count: (rand(56, 92) | 0) },
      });
    };

    const show = (ms: number, rate = 520) => {
      const end = performance.now() + ms;
      const tick = () => {
        if (performance.now() > end) return;
        rocket();
        timers.current.push(window.setTimeout(tick, rate * rand(0.6, 1.5)));
      };
      tick();
    };

    const cannons = () => {
      const w = size.current.w || window.innerWidth;
      const h = size.current.h || window.innerHeight;
      confetti(0, h * 0.9, { angle: -Math.PI / 3.4, spread: 0.9, count: 60, speed: 1100, life: 3.4 });
      confetti(w, h * 0.9, { angle: -Math.PI + Math.PI / 3.4, spread: 0.9, count: 60, speed: 1100, life: 3.4 });
    };

    const hearts = (count = 18) => {
      const w = size.current.w || window.innerWidth;
      const h = size.current.h || window.innerHeight;
      for (let i = 0; i < count; i++) {
        const x = rand(w * 0.05, w * 0.95);
        push({
          x,
          y: h + rand(10, 220),
          px: x,
          py: h,
          vx: rand(-18, 18),
          vy: rand(-120, -58),
          g: -6,
          drag: 1,
          life: rand(4.5, 8),
          size: rand(11, 26),
          color: pick(["#ff8fb1", "#ff6f91", "#ffb3c9", "#ffd79a", "#ffffff"]),
          shape: "heart",
          flutter: rand(0, 6.28),
        });
      }
    };

    const petals = (count = 26) => {
      const w = size.current.w || window.innerWidth;
      for (let i = 0; i < count; i++) {
        const x = rand(0, w);
        push({
          x,
          y: rand(-260, -20),
          px: x,
          py: -40,
          vx: rand(-26, 26),
          vy: rand(46, 96),
          g: 5,
          drag: 1,
          life: rand(7, 12),
          size: rand(9, 18),
          color: pick(["#ff9ec4", "#ff7fa5", "#ffc2d6", "#e05780", "#ffd8e4"]),
          shape: "petal",
          flutter: rand(0, 6.28),
          vrot: rand(-2.4, 2.4),
        });
      }
    };

    return {
      confetti,
      sparkles,
      ring,
      explode,
      rocket,
      show,
      cannons,
      hearts,
      petals,
      clear: () => {
        parts.current = [];
        timers.current.forEach(clearTimeout);
        timers.current = [];
      },
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      size.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    const heartPath = (c: CanvasRenderingContext2D, s: number) => {
      c.beginPath();
      c.moveTo(0, s * 0.32);
      c.bezierCurveTo(-s * 0.55, -s * 0.18, -s * 0.28, -s * 0.72, 0, -s * 0.34);
      c.bezierCurveTo(s * 0.28, -s * 0.72, s * 0.55, -s * 0.18, 0, s * 0.32);
      c.closePath();
    };

    const starPath = (c: CanvasRenderingContext2D, s: number) => {
      c.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s : s * 0.45;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const fn = i === 0 ? "moveTo" : "lineTo";
        c[fn](Math.cos(a) * r, Math.sin(a) * r);
      }
      c.closePath();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.034, (now - last) / 1000);
      last = now;
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);
      const arr = parts.current;

      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.px = p.x;
        p.py = p.y;
        p.age += dt;
        p.vy += p.g * dt;
        if (p.drag !== 1) {
          const d = Math.pow(p.drag, dt * 60);
          p.vx *= d;
          p.vy *= d;
        }
        p.flutter += dt * 6;
        if (p.shape === "heart" || p.shape === "petal") p.x += Math.sin(p.flutter * 0.6) * 22 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;

        if (p.shape === "rocket" && (p.vy > -30 || p.age > 2.4)) {
          const pay = p.payload!;
          api.explode(p.x, p.y, pay.color, pay.count);
          arr.splice(i, 1);
          continue;
        }
        if (p.age > p.life || p.y > h + 220 || p.x < -260 || p.x > w + 260) {
          arr.splice(i, 1);
          continue;
        }

        const t = p.age / p.life;
        const alpha = p.shape === "ring" ? 1 - t : t > 0.72 ? 1 - (t - 0.72) / 0.28 : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.globalCompositeOperation = p.glow ? "lighter" : "source-over";

        if (p.shape === "spark" || p.shape === "rocket") {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (p.shape === "rocket" ? 1.4 : 1.1), 0, 6.2832);
          ctx.fill();
        } else if (p.shape === "ring") {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, 7 * (1 - t));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + t * 130, 0, 6.2832);
          ctx.stroke();
        } else {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          if (p.shape === "heart") {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 16;
            ctx.fillStyle = p.color;
            ctx.rotate(Math.sin(p.flutter * 0.4) * 0.25 - p.rot);
            heartPath(ctx, p.size);
            ctx.fill();
          } else if (p.shape === "petal") {
            ctx.scale(1, 0.55 + Math.abs(Math.cos(p.flutter * 0.5)) * 0.6);
            const grd = ctx.createLinearGradient(-p.size, 0, p.size, 0);
            grd.addColorStop(0, p.color);
            grd.addColorStop(1, "rgba(255,255,255,0.55)");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, 6.2832);
            ctx.fill();
          } else if (p.shape === "star") {
            ctx.fillStyle = p.color;
            starPath(ctx, p.size * 0.62);
            ctx.fill();
          } else if (p.shape === "ribbon") {
            ctx.fillStyle = p.color;
            const sq = Math.cos(p.flutter) * 0.9;
            ctx.scale(1, Math.max(0.12, Math.abs(sq)));
            ctx.fillRect(-p.size * 0.28, -p.size * 0.9, p.size * 0.56, p.size * 1.8);
          } else {
            ctx.fillStyle = p.color;
            const sq = Math.cos(p.flutter);
            ctx.scale(1, Math.max(0.15, Math.abs(sq)));
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.72);
          }
        }
        ctx.restore();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      timers.current.forEach(clearTimeout);
    };
  }, [api]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50"
        style={{ width: "100%", height: "100%" }}
      />
    </Ctx.Provider>
  );
}

/** Helper: get the centre of an element in viewport coordinates. */
export const centerOf = (el: Element | null) => {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};
