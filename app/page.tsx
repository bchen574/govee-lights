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
    <div className=" flex flex-col gap-4 flex-1 items-center justify-center font-sans bg-background px-4">
      {lightSwitchMap}
    </div>
  );
}
