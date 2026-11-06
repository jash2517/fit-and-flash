// Toonify web runtime: play a Toonify .riv mascot's moves by name.

export class Mascot {
  static load(canvas, src, options) {
    return new Promise((resolve, reject) => {
      const m = new Mascot(canvas, src, options, () => resolve(m), reject);
    });
  }

  constructor(canvas, src, options, onReady, onError) {
    if (!options || !options.rive) throw new Error("Mascot: pass { rive } (import * as rive from '@rive-app/canvas').");
    const R = options.rive;
    if (options.wasmUrl) R.RuntimeLoader.setWasmUrl(options.wasmUrl);
    this.idle = options.idle === undefined ? "idle" : options.idle;
    this.autoBlink = options.autoBlink !== false;
    this.loops = new Set(options.loops || []);
    this.listeners = {};
    this.current = null;
    this.resolvers = new Map();
    this.names = [];
    const source = typeof src === "string" ? { src } : { buffer: src instanceof Uint8Array ? src.slice().buffer : src };
    this.r = new R.Rive({
      ...source,
      canvas,
      autoplay: false,
      layout: new R.Layout({ fit: R.Fit.Contain, alignment: R.Alignment.Center }),
      onLoad: () => {
        this.r.resizeDrawingSurfaceToCanvas();
        this.names = this.r.animationNames;
        if (this.idle && this.names.includes(this.idle)) this._start(this.idle);
        this._scheduleBlink();
        onReady && onReady();
      },
      onLoadError: (e) => onError && onError(e),
      onStop: (e) => this._onStop(e && e.data),
    });
  }

  presets() {
    return [...this.names];
  }

  play(name, opts = {}) {
    if (!this.names.includes(name)) {
      return Promise.reject(new Error(`Mascot: unknown move "${name}". Available: ${this.names.join(", ")}`));
    }
    this.current = null;
    this._release();
    if (name === this.idle) {
      this._stopAllExcept([this.idle, "blink"]);
      if (!this.r.playingAnimationNames.includes(this.idle)) this._start(this.idle);
      this.current = null;
      this._emit("start", name, !!opts._auto);
      return Promise.resolve();
    }
    const loop = opts.loop === undefined ? this.loops.has(name) : !!opts.loop;
    if (!loop && typeof opts.hold === "number") return this._playAndHold(name, Math.max(0, opts.hold), !!opts._auto);
    this._stopAllExcept([this.idle, "blink"]);
    if (loop && this.idle) this.r.stop(this.idle);
    else if (this.idle && !this.r.playingAnimationNames.includes(this.idle)) this._start(this.idle);
    this.current = { name, loop, then: opts.then === undefined ? this.idle : opts.then };
    this._start(name);
    this._emit("start", name, !!opts._auto);
    if (loop) return Promise.resolve();
    return new Promise((resolve) => this.resolvers.set(name, resolve));
  }

  stop() {
    this.current = null;
    this._release();
    this.r.stop();
  }

  _playAndHold(name, at, auto) {
    this._stopAllExcept([this.idle, "blink"]);
    if (this.idle && !this.r.playingAnimationNames.includes(this.idle)) this._start(this.idle);
    this.current = { name, loop: false, then: null, hold: at };
    this._start(name);
    this._emit("start", name, auto);
    return new Promise((resolve) => {
      this._holdTimer = setTimeout(() => {
        if (!this.current || this.current.name !== name) return resolve();
        this.r.scrub(name, at);
        this.r.pause(name);
        if (this.idle) this.r.stop(this.idle);
        this._held = name;
        this.current = null;
        this._emit("hold", name);
        resolve();
      }, at * 1000);
    });
  }

  _release() {
    clearTimeout(this._holdTimer);
    if (this._held) {
      this.r.stop(this._held);
      this._held = null;
    }
  }

  on(event, cb) {
    (this.listeners[event] ||= []).push(cb);
    return () => (this.listeners[event] = this.listeners[event].filter((f) => f !== cb));
  }

  resize() {
    this.r.resizeDrawingSurfaceToCanvas();
  }

  destroy() {
    clearTimeout(this._blinkTimer);
    this.r.cleanup();
    this.listeners = {};
  }

  _start(name) {
    this.r.stop(name);
    this.r.play(name);
  }

  _stopAllExcept(keep) {
    for (const n of this.r.playingAnimationNames) if (!keep.includes(n)) this.r.stop(n);
  }

  _emit(event, a, b) {
    for (const cb of this.listeners[event] || []) cb(a, b);
  }

  _onStop(names) {
    for (const name of names || []) {
      const resolve = this.resolvers.get(name);
      if (resolve) {
        this.resolvers.delete(name);
        resolve();
      }
      const cur = this.current;
      if (name === "blink" || !cur || cur.name !== name) continue;
      if (cur.hold !== undefined) continue;
      if (cur.loop) {
        if (!this.r.playingAnimationNames.includes(name)) this.r.play(name);
        continue;
      }
      this.current = null;
      this._emit("complete", name);
      if (cur.then && cur.then !== this.idle && this.names.includes(cur.then)) this.play(cur.then, { _auto: true });
      else if (this.idle) this.play(this.idle, { _auto: true });
    }
  }

  _scheduleBlink() {
    if (!this.autoBlink || !this.names.includes("blink")) return;
    this._blinkTimer = setTimeout(() => {
      if (!this.r.playingAnimationNames.includes("blink") && this.current?.name !== "blink") this._start("blink");
      this._scheduleBlink();
    }, 2500 + Math.random() * 3500);
  }
}

