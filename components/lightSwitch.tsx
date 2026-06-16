"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useSendCommands } from "@/lib/govee/sendCommand";
import { AllDeviceStates } from "@/lib/govee/getDeviceState";
import { Device } from "@/lib/govee/devices";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type LightSwitchProps = {
  device: Device;
  deviceStates?: AllDeviceStates;
};

export function LightSwitch({ device, deviceStates }: LightSwitchProps) {
  const { mutate: sendCommand } = useSendCommands();
  const queryClient = useQueryClient();

  const data = deviceStates?.[device];

  const powerSwitchCapability = data?.payload.capabilities.find(
    (capability) => capability.instance === "powerSwitch",
  );

  const brightnessCapability = data?.payload.capabilities.find(
    (capability) => capability.instance === "brightness",
  );

  const [optimisticState, setOptimisticState] = useState<number>();
  const [optimisticBrightness, setOptimisticBrightness] = useState<number>();

  const lightState = optimisticState ?? powerSwitchCapability?.state?.value;

  const brightness =
    optimisticBrightness ??
    (brightnessCapability?.state?.value as number | undefined);

  if (!data) {
    return (
      <div className="flex flex-col gap-8 px-6 py-6 h-full rounded-xl justify-between items-center bg-card/100 border border-border/30 w-full min-h-12">
        <div className="flex flex-row w-full">
          <div className="flex-1 flex flex-row gap-2 items-center">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>

          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-6 py-6 h-full rounded-xl justify-between items-center bg-card/100 border border-border/30 w-full">
      <div className="flex flex-row w-full">
        <div className="flex-1 flex flex-row gap-2 items-center">
          <div className="text-foreground font-heading font-normal text-gray-200 text-lg">
            {device}
          </div>

          {brightness !== undefined && (
            <p className="text-neutral-300">· {brightness}%</p>
          )}
        </div>

        <Button
          className={cn(
            "rounded-md bg-neutral-300",
            lightState === 1 ? "" : "bg-background",
          )}
          variant={lightState === 1 ? "default" : "outline"}
          size="icon-xs"
          onClick={() => {
            const nextState = lightState === 1 ? 0 : 1;

            setOptimisticState(nextState);

            sendCommand(
              [
                {
                  device,
                  capability: "powerSwitch",
                  value: nextState,
                },
              ],
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["deviceStates"],
                  });
                },
              },
            );
          }}
        />
      </div>

      {brightness !== undefined && (
        <Slider
          value={[brightness]}
          disabled={lightState !== 1}
          max={100}
          step={5}
          onValueChange={(value) => {
            setOptimisticBrightness(value[0]);
          }}
          onValueCommit={(value) => {
            sendCommand(
              [
                {
                  device,
                  capability: "brightness",
                  value: value[0],
                },
              ],
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["deviceStates"],
                  });
                },
              },
            );
          }}
        />
      )}
    </div>
  );
}
