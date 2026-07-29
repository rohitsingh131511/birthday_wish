/**
 * Tiny WebAudio synth engine — every sound effect is generated at runtime,
 * so the experience stays fast (zero audio downloads) and works offline.
 */

type Ctx = AudioContext & { resume: () => Promise<void> };

const SCALE = [0, 2, 4, 7, 9, 12, 14, 16]; // major pentatonic-ish

class AudioEngine {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private musicTimer: number | null = null;
  private step = 0;
  private nextNoteTime = 0;
  muted = false;
  musicOn = false;

  private ensure(): Ctx | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC() as Ctx;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      this.master.connect(this.ctx.destination);

      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.0001;
      this.musicBus.connect(this.master);

      // shared noise buffer
      const len = this.ctx.sampleRate * 1.2;
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buf;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  unlock() {
    this.ensure();
  }

  setMuted(v: boolean) {
    this.muted = v;
    const ctx = this.ctx;
    if (ctx && this.master) {
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      this.master.gain.setTargetAtTime(v ? 0 : 0.9, ctx.currentTime, 0.08);
    }
  }

  private noise(dur: number, gain: number, type: BiquadFilterType, freq: number, q = 1, sweepTo?: number) {
    const ctx = this.ensure();
    if (!ctx || !this.noiseBuffer || !this.master) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, ctx.currentTime);
    filter.Q.value = q;
    if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start();
    src.stop(ctx.currentTime + dur + 0.05);
  }

  private tone(
    freq: number,
    dur: number,
    opts: { type?: OscillatorType; gain?: number; delay?: number; glide?: number; bus?: GainNode | null } = {},
  ) {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const { type = "sine", gain = 0.18, delay = 0, glide } = opts;
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, glide), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.05, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(opts.bus ?? this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /* ---------------- SFX ---------------- */

  pop() {
    this.noise(0.16, 0.5, "bandpass", 1400, 1.4, 380);
    this.tone(520, 0.13, { type: "triangle", gain: 0.22, glide: 130 });
    this.tone(1100, 0.09, { type: "sine", gain: 0.1, delay: 0.01, glide: 500 });
  }

  sparkle() {
    const base = 1100 + Math.random() * 400;
    [0, 0.05, 0.1, 0.16].forEach((d, i) => {
      this.tone(base * (1 + i * 0.28), 0.22, { type: "sine", gain: 0.075, delay: d });
    });
  }

  whoosh() {
    this.noise(0.75, 0.32, "lowpass", 900, 0.9, 180);
  }

  paper() {
    this.noise(0.35, 0.16, "highpass", 2200, 0.7, 5200);
  }

  firework() {
    this.noise(0.09, 0.34, "highpass", 900, 0.6);
    this.noise(0.85, 0.3, "lowpass", 2400, 0.8, 200);
    for (let i = 0; i < 12; i++) {
      window.setTimeout(() => this.noise(0.05, 0.09, "bandpass", 2400 + Math.random() * 2600, 3), 90 + i * 55 + Math.random() * 70);
    }
  }

  launch() {
    const ctx = this.ensure();
    if (!ctx) return;
    this.tone(220, 0.7, { type: "sawtooth", gain: 0.045, glide: 1500 });
    this.noise(0.7, 0.08, "bandpass", 700, 2, 2200);
  }

  chime() {
    [0, 4, 7, 12].forEach((s, i) => this.tone(523.25 * Math.pow(2, s / 12), 1.5, { type: "sine", gain: 0.11, delay: i * 0.09 }));
  }

  magic() {
    for (let i = 0; i < 7; i++) {
      this.tone(440 * Math.pow(2, SCALE[i] / 12), 0.6, { type: "triangle", gain: 0.08, delay: i * 0.06 });
    }
  }

  heartbeat() {
    this.tone(70, 0.2, { type: "sine", gain: 0.3, glide: 42 });
    this.tone(70, 0.22, { type: "sine", gain: 0.22, delay: 0.24, glide: 40 });
  }

  /* ---------------- ambient music ---------------- */

  startMusic() {
    const ctx = this.ensure();
    if (!ctx || !this.musicBus || this.musicOn) return;
    this.musicOn = true;
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.setTargetAtTime(0.5, ctx.currentTime, 1.6);
    this.nextNoteTime = ctx.currentTime + 0.1;
    const tick = () => {
      const c = this.ctx;
      if (!c || !this.musicOn) return;
      while (this.nextNoteTime < c.currentTime + 0.4) {
        this.scheduleNote(this.nextNoteTime, this.step);
        this.nextNoteTime += 0.34;
        this.step++;
      }
    };
    this.musicTimer = window.setInterval(tick, 90);
  }

  private scheduleNote(time: number, step: number) {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus) return;
    const root = 261.63; // C4
    const patt = [0, 4, 7, 11, 7, 4, 12, 7];
    const bar = Math.floor(step / 8) % 4;
    const shift = [0, -3, 5, 2][bar];
    const semis = patt[step % 8] + shift;
    const freq = root * Math.pow(2, semis / 12);

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(0.055, time + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 2600;
    osc.connect(filt).connect(g).connect(this.musicBus);
    osc.start(time);
    osc.stop(time + 1.2);

    // soft pad on bar change
    if (step % 8 === 0) {
      [0, 7, 16].forEach((s) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = (root / 2) * Math.pow(2, (s + shift) / 12);
        const pg = ctx.createGain();
        pg.gain.setValueAtTime(0.0001, time);
        pg.gain.exponentialRampToValueAtTime(0.03, time + 0.9);
        pg.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);
        o.connect(pg).connect(this.musicBus!);
        o.start(time);
        o.stop(time + 3);
      });
    }
  }

  stopMusic() {
    const ctx = this.ctx;
    this.musicOn = false;
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (ctx && this.musicBus) this.musicBus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
  }
}

export const audio = new AudioEngine();
