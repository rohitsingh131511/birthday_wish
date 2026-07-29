import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { audio } from "../lib/audio";

/* ------------------------------------------------------------------ */
/* Glass card                                                          */
/* ------------------------------------------------------------------ */
export function GlassCard({
  children,
  className,
  edge = true,
  ...rest
}: { children: ReactNode; className?: string; edge?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "glass relative overflow-hidden rounded-[26px] sm:rounded-[32px]",
        edge && "glass-edge",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons with ripple micro-interaction                               */
/* ------------------------------------------------------------------ */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "glow" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export function Button({ children, className, variant = "glow", size = "md", icon, onClick, ...rest }: BtnProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const sizes = {
    sm: "px-4 py-2 text-[0.82rem]",
    md: "px-6 py-3 text-[0.92rem]",
    lg: "px-7 py-3.5 text-[1rem] sm:px-9 sm:py-4 sm:text-[1.08rem]",
  }[size];

  return (
    <button
      ref={ref}
      {...rest}
      onClick={(e) => {
        const el = ref.current;
        if (el) {
          const r = el.getBoundingClientRect();
          const span = document.createElement("span");
          span.style.cssText = `position:absolute;left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:999px;background:rgba(255,255,255,.55);transform:scale(0);opacity:.9;pointer-events:none;transition:transform .6s ease-out,opacity .7s ease-out`;
          el.appendChild(span);
          requestAnimationFrame(() => {
            span.style.transform = `scale(${(Math.max(r.width, r.height) / 8) * 2.4})`;
            span.style.opacity = "0";
          });
          setTimeout(() => span.remove(), 750);
        }
        audio.unlock();
        onClick?.(e);
      }}
      className={cn(
        "relative inline-flex select-none items-center justify-center gap-2 font-medium",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        variant === "glow" ? "btn-glow" : "btn-ghost",
        sizes,
        className,
      )}
    >
      {icon}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */
export function SceneTitle({
  kicker,
  title,
  subtitle,
  className,
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      {kicker && (
        <p
          className="reveal mb-3 text-[0.62rem] font-medium uppercase tracking-[0.42em] text-amber-100/70 sm:text-[0.7rem]"
          style={{ animationDelay: "60ms" }}
        >
          {kicker}
        </p>
      )}
      <h2
        className="reveal font-display text-[clamp(1.65rem,5.2vw,3.1rem)] font-semibold leading-[1.12] text-white glow-soft"
        style={{ animationDelay: "140ms" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="reveal mx-auto mt-3 max-w-[52ch] text-[clamp(0.9rem,2.4vw,1.05rem)] font-light leading-relaxed text-white/70"
          style={{ animationDelay: "260ms" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small glass pill                                                    */
/* ------------------------------------------------------------------ */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "glass-soft inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.72rem] font-medium tracking-wide text-white/80 sm:text-[0.8rem]",
        className,
      )}
    >
      {children}
    </span>
  );
}
