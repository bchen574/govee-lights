"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { useSendCommands } from "@/lib/govee/sendCommand";
import { useDeviceState } from "@/lib/govee/getDeviceState";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const { mutate: sendCommand } = useSendCommands();
  const { data } = useDeviceState("bedroom");

  const queryClient = useQueryClient();

  const powerSwitch = data?.payload?.capabilities?.find(
    (capability) => capability.instance === "powerSwitch",
  );

  const bedroomLightState = powerSwitch?.state?.value;

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-neutral-900">
      <main className="flex flex-1 flex-col gap-17 w-full justify-center items-center">
        <Button
          className={cn(
            bedroomLightState === 1
              ? "rounded-full h-50 w-50"
              : "bg-background-muted",
          )}
          onClick={() => {
            sendCommand(
              [
                {
                  device: "bedroom",
                  capability: "powerSwitch",
                  value: bedroomLightState === 1 ? 0 : 1,
                },
              ],
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["deviceState", "bedroom"],
                  });
                },
              },
            );
          }}
        >
          <Power className="size-20 text-gray-300" />
        </Button>
      </main>
    </div>
  );
}
