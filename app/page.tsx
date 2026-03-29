"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  // drives the UI — re-renders when changed
  const [isOn, setIsOn] = useState(false);
  const [count, setCount] = useState(60 * 60);
  const minutes = Math.floor(count / 60);
  const seconds = count % 60;

  // live version of count that the interval can actually read
  const countRef = useRef(count);

  // keeps the ref in sync every time count updates
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // light is on — start ticking
  useEffect(() => {
    if (!isOn) return; // just bail, no setState here

    const interval = setInterval(() => {
      // read live value from ref, not stale count from closure
      if (countRef.current <= 0) {
        clearInterval(interval);
        setIsOn(false);
        return;
      }
      // functional form so React does the math against its own store
      setCount((prev) => prev - 1);
    }, 1000);

    // cleanup — runs when isOn changes or component unmounts
    return () => clearInterval(interval);
  }, [isOn]);

  // reset count and toggle — functional prev so toggle is never stale
  function switchOnOff() {
    setIsOn((prev) => {
      if (prev) setCount(60 * 60);
      // reset when turning off
      return !prev;
    });
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-neutral-900">
      <main className="flex flex-1 flex-col gap-17 w-full justify-center items-center">
        <h1 className="text-2xl text-white font-medium">
          {isOn ? "Lights On" : "Lights Off"}
        </h1>
        {/* only show timer while light is on and counting down */}
        {isOn && count > 0 && (
          <motion.h1
            key="countdown"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed top-10 text-white text-base px-6 py-4 bg-neutral-800/20 border border-neutral-800 rounded-full"
          >
            Light will turn off in {minutes}m {String(seconds).padStart(2, "0")}
            s
          </motion.h1>
        )}
        <Button
          className={`rounded-full h-50 w-50 active:scale-110 ${
            isOn
              ? "bg-amber-800 border-amber-500 shadow-[0_0_40px_15px] shadow-amber-500/20"
              : "bg-neutral-800 shadow-lg"
          }`}
          onClick={switchOnOff}
        >
          <Power className="size-20 text-gray-300" />
        </Button>
      </main>
    </div>
  );
}
