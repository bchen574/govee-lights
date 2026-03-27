"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

export default function Home() {
  const [isOn, setIsOn] = useState(false);

  const switchOnOff = () => {
    const action = isOn ? "off" : "on";

    fetch("/api/lightControls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsOn(!isOn);
      });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-gray-900 ">
      <main className="flex flex-1 flex-col gap-17 w-full justify-center items-center">
        <h1 className="text-2xl text-white font-medium ">
          Click turn on all lights.
        </h1>

        <Button
          className={`rounded-full h-50 w-50 active:scale-110 ${isOn ? "bg-amber-800 border-amber-500 shadow-[0_0_40px_15px] shadow-amber-500/20" : " bg-gray-500 shadow-lg"}`}
          onClick={switchOnOff}
        >
          <Power className="size-20 text-gray-300"></Power>
        </Button>
      </main>
    </div>
  );
}
