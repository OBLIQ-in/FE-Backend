"use client";

import { useEffect, useRef, useState } from "react";

export function useTimer() {
  const startedAt = useRef<number | null>(null);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  function elapsed() {
    return startedAt.current === null
      ? 0
      : Math.floor((performance.now() - startedAt.current) / 1000);
  }

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => setSeconds(elapsed()), 250);
    return () => window.clearInterval(interval);
  }, [running]);

  function start() {
    startedAt.current = performance.now();
    setSeconds(0);
    setRunning(true);
  }

  function stop() {
    const duration = elapsed();
    startedAt.current = null;
    setRunning(false);
    setSeconds(duration);
    return duration;
  }

  return { seconds, running, start, stop, reset: () => setSeconds(0) };
}
