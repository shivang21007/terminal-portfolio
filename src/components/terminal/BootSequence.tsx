"use client";
import { useEffect, useState } from "react";

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const logs = [
    "Booting ShivangOS v3.0...",
    "[ OK ] Loading kernel modules",
    "[ OK ] Mounting virtual filesystem",
    "[ OK ] Initializing namespaces",
    "[ OK ] Starting container runtime",
    "System ready."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < logs.length) {
      const timer = setTimeout(() => setIndex(index + 1), 500);
      return () => clearTimeout(timer);
    } else {
      onDone();
    }
  }, [index]);

  return (
    <div className="p-3 sm:p-5 text-xs sm:text-sm md:text-base min-h-dvh h-dvh overflow-x-hidden bg-[#0d1117] text-gray-300">
      {logs.slice(0, index).map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}