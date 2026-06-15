"use client";

import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { useSendCommands } from "@/lib/govee/sendCommand";
import { useDeviceState } from "@/lib/govee/getDeviceState";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Device } from "@/lib/govee/devices";
import { useState } from "react";

export function LightSwitch({ device }: { device: Device }) {
  const { mutate: sendCommand } = useSendCommands();
  const { data } = useDeviceState(device);

  const queryClient = useQueryClient();

  const powerSwitch = data?.payload?.capabilities?.find(
    (capability) => capability.instance === "powerSwitch",
  );
  const [optimisticState, setOptimisticState] = useState<number | undefined>();

  const lightState = optimisticState ?? powerSwitch?.state?.value;

  return (
    <div className="flex  flex-row gap-8 px-5 py-4 rounded-lg justify-center items-center bg-card/50 w-full  md:w-[400px]  ">
      <h1 className="text-foreground font-heading font-medium  text-lg flex-1">
        {" "}
        {device}
      </h1>
      <Button
        className={cn(
          "rounded-md  ",
          lightState === 1
            ? "shadow-[-1px_-1px_12px_1px_rgba(249,_115,_22,_0.3)]"
            : "bg-background",
        )}
        variant={lightState === 1 ? "default" : "outline"}
        size="icon-sm"
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
  );
}
