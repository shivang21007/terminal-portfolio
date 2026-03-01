"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { USER, HOSTNAME } from "@/lib/constants";
import { executeCommand } from "./CommandParser";
import BootSequence from "./BootSequence";
import WelcomeMessage, { AsciiArt } from "./WelcomeMessage";
import { files } from "@/lib/constants";

type HistoryItem = {
  id: number;
  command: string;
  output: ReactNode;
};

function isAboutCommand(input: string): boolean {
  const trimmed = input.trim().toLowerCase();
  return trimmed === "about" || trimmed === "cat about.txt";
}

function AboutOutput() {
  return (
    <div className="mt-1">
      <AsciiArt />
      <div className="mt-2 whitespace-pre-wrap text-green-400">
        {files["about.txt"]}
      </div>
    </div>
  );
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isCleared]);

  const handleCommand = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setHistory(prev => [
        ...prev,
        { id: Date.now(), command: input, output: "" }
      ]);
      setInput("");
      return;
    }

    if (trimmedInput.toLowerCase() === "clear") {
      setHistory([]);
      setIsCleared(true);
      setCommandHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setInput("");
      return;
    }

    const output: ReactNode = isAboutCommand(trimmedInput)
      ? <AboutOutput />
      : executeCommand(trimmedInput);

    setHistory(prev => [
      ...prev,
      { id: Date.now(), command: input, output }
    ]);

    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex]);
        }
      }
    }
  };

  if (!booted) {
    return <BootSequence onDone={() => setBooted(true)} />;
  }

  const Prompt = () => (
    <span className="mr-2 shrink-0">
      <span className="text-yellow-400">{USER}</span>
      <span className="text-white">@</span>
      <span className="text-green-400">{HOSTNAME}</span>
      <span className="text-white">:~$</span>
    </span>
  );

  return (
    <div
      className="p-5 pr-8 text-base h-screen overflow-y-auto overflow-x-hidden bg-[#0d1117] text-gray-300"
      onClick={() => inputRef.current?.focus()}
    >
      {!isCleared && <WelcomeMessage />}

      {history.map((item) => (
        <div key={item.id} className="mb-2">
          <div className="flex">
            <Prompt />
            <span className="text-white">{item.command}</span>
          </div>
          {item.output && (
            typeof item.output === "string"
              ? <div className="whitespace-pre-wrap mt-1 text-green-400">{item.output}</div>
              : item.output
          )}
        </div>
      ))}

      <div className="flex">
        <Prompt />
        <input
          ref={inputRef}
          className="bg-transparent outline-none flex-1 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
