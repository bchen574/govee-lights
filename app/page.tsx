"use client";

import { LightSwitch } from "@/components/lightSwitch";
import { ALL_DEVICES } from "@/lib/govee/constants/devices";
import { Device } from "@/lib/govee/constants/devices";
import { useAllDeviceStates } from "@/lib/govee/api/client/getDeviceState";

export default function Home() {
  const { data: deviceStates } = useAllDeviceStates();

  const deviceKeys = Object.keys(ALL_DEVICES) as Device[];

  return (
    <div className="grid h-100 grid-cols-2 items-center justify-start gap-4 px-4 py-6 font-sans md:grid md:h-200 md:grid-cols-2 md:gap-4 md:px-6">
      {deviceKeys.map((deviceKey) => (
        <LightSwitch
          key={deviceKey}
          device={deviceKey}
          deviceStates={deviceStates}
        />
      ))}
    </div>
  );
}
