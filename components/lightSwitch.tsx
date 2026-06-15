"use client";

import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { useSendCommands } from "@/lib/govee/sendCommand";
import { useDeviceState } from "@/lib/govee/getDeviceState";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Device } from "@/lib/govee/devices";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function LightSwitch({ device }: { device: Device }) {
  const { mutate: sendCommand } = useSendCommands();
  const { data } = useDeviceState(device);

  const queryClient = useQueryClient();

  const powerSwitchCapability = data?.payload?.capabilities?.find(
    (capability) => capability.instance === "powerSwitch",
  );
  const brightnessCapability = data?.payload?.capabilities?.find(
    (capability) => capability.instance === "brightness",
  );

  const [optimisticState, setOptimisticState] = useState<number | undefined>();
  const [optimisticBrightness, setOptimisticBrightness] = useState<
    number | undefined
  >();
  const lightState = optimisticState ?? powerSwitchCapability?.state?.value;

  const brightness =
    optimisticBrightness ??
    (brightnessCapability?.state?.value as number | undefined);

  return (
    <div className="flex  flex-col gap-8 px-5 py-4 rounded-lg justify-center items-center bg-card/100 border border-border/30 w-full  md:w-[400px]  ">
      <div className="flex flex-row w-full">
        <div className="flex-1 flex flex-row gap-2 items-center">
          <h1 className="text-foreground font-heading font-normal text-gray-200  text-lg ">
            {" "}
            {device}
          </h1>
          <p className="text-neutral-300"> · {brightness}%</p>
        </div>
        <Button
          className={cn(
            "rounded-md bg-neutral-300 ",
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
                  value: lightState === 1 ? 0 : 1,
                },
              ],
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["deviceState", device],
                  });
                },
              },
            );
          }}
        ></Button>
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
                    queryKey: ["deviceState", device],
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
