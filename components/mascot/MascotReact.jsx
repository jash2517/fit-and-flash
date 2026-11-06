'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as rive from "@rive-app/canvas";
import { Mascot } from "@/lib/toonify";

export const MascotView = forwardRef(function MascotView({ src, preset, loop, idle, autoBlink = true, style, className, onReady }, ref) {
  const canvas = useRef(null);
  const mascot = useRef(null);

  useEffect(() => {
    let alive = true;
    if (!canvas.current || !src) return;

    Mascot.load(canvas.current, src, { rive, idle, autoBlink }).then((m) => {
      if (!alive) return m.destroy();
      mascot.current = m;
      if (preset) m.play(preset, { loop });
      onReady && onReady(m);
    }).catch((err) => {
      console.warn("Rive mascot file not found or failed to load, falling back to interactive mascot.", err);
    });

    const ro = new ResizeObserver(() => mascot.current && mascot.current.resize());
    if (canvas.current) ro.observe(canvas.current);

    return () => {
      alive = false;
      ro.disconnect();
      mascot.current && mascot.current.destroy();
      mascot.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (mascot.current && preset) mascot.current.play(preset, { loop });
  }, [preset, loop]);

  useImperativeHandle(ref, () => ({
    play: (name, opts) => mascot.current?.play(name, opts),
    stop: () => mascot.current?.stop(),
    presets: () => mascot.current?.presets() ?? [],
  }));

  return (
    <div style={style} className={className}>
      <canvas ref={canvas} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
});

