"use client";

import { useEffect, useState } from "react";

function getRemaining(target: string) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState(getRemaining(endsAt));

  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(getRemaining(endsAt)), 1000);
    return () => window.clearInterval(interval);
  }, [endsAt]);

  return <span>{remaining}</span>;
}
