import { useCallback, useEffect, useRef, useState } from "react";

export type MicStatus = "idle" | "requesting" | "listening" | "denied" | "unsupported";

/**
 * Listens to the microphone and fires `onBlow` when a sustained burst of
 * low-frequency "wind" energy is detected (i.e. someone blowing at the phone).
 * Gracefully degrades: caller can always fall back to tapping the candle.
 */
export function useMicBlow(onBlow: () => void) {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [level, setLevel] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const sustainRef = useRef(0);
  const firedRef = useRef(false);
  const cbRef = useRef(onBlow);
  cbRef.current = onBlow;

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (ctxRef.current && ctxRef.current.state !== "closed") void ctxRef.current.close();
    ctxRef.current = null;
    setLevel(0);
  }, []);

  const start = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      streamRef.current = stream;
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AC();
      ctxRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.72;
      source.connect(analyser);
      const bins = new Uint8Array(analyser.frequencyBinCount);
      const hzPerBin = ctx.sampleRate / analyser.fftSize;
      const lowEnd = Math.max(4, Math.round(600 / hzPerBin));
      firedRef.current = false;
      sustainRef.current = 0;
      setStatus("listening");

      let last = 0;
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop);
        analyser.getByteFrequencyData(bins);
        let low = 0;
        for (let i = 2; i < lowEnd; i++) low += bins[i];
        low /= lowEnd - 2;
        let high = 0;
        const hStart = Math.round(2500 / hzPerBin);
        for (let i = hStart; i < bins.length; i++) high += bins[i];
        high /= Math.max(1, bins.length - hStart);

        // Blowing = lots of broadband low/mid rumble, not a tonal voice
        const raw = Math.max(0, low - 12) / 90;
        const v = Math.min(1, raw * (high > 4 ? 1.15 : 0.85));
        const now = performance.now();
        if (now - last > 60) {
          last = now;
          setLevel((p) => p + (v - p) * 0.55);
        }
        if (v > 0.46) sustainRef.current += 1;
        else sustainRef.current = Math.max(0, sustainRef.current - 2);

        if (sustainRef.current > 12 && !firedRef.current) {
          firedRef.current = true;
          cbRef.current();
        }
      };
      loop();
    } catch {
      setStatus("denied");
      stop();
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { status, level, start, stop };
}
