"use client";

import { LightSwitch } from "@/components/lightSwitch";
import { ALL_DEVICES } from "@/lib/govee/devices";
import type { Device } from "@/lib/govee/devices";

export default function Home() {
  const deviceKeys = Object.keys(ALL_DEVICES) as Device[];
  const lightSwitchMap = deviceKeys.map((deviceKey) => {
    return <LightSwitch key={deviceKey} device={deviceKey} />;
  });

  return (
    <div className="  grid grid-cols-1 gap-4 md:grid md:grid-cols-2 md:gap-4 md:h-100 items-center justify-start py-6  font-sans bg-background px-6 ">
      {lightSwitchMap}
    </div>
  );
}
