"use client";

import { LightSwitch } from "@/components/lightSwitch";

export default function Home() {
  return (
    <div className=" flex flex-col gap-4 flex-1 items-center justify-center font-sans bg-neutral-900 px-4">
      <LightSwitch device={"Bedroom"}></LightSwitch>
      <LightSwitch device={"Lamp"}></LightSwitch>
    </div>
  );
}
