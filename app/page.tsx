"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

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
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 flex-col gap-3 w-full justify-center items-center">
        <h1>Light Switch</h1>
        <Switch onClick={switchOnOff} />
      </main>
    </div>
  );
}
