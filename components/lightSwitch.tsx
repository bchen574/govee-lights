"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useSendCommands } from "@/lib/govee/api/client/sendCommand";
import { AllDeviceStates } from "@/lib/govee/api/client/getDeviceState";
import { Device } from "@/lib/govee/constants/devices";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const apiLightState = powerSwitchCapability?.state?.value;

  const lightState = optimisticState ?? apiLightState;

  const brightness =
    optimisticBrightness ??
    (brightnessCapability?.state?.value as number | undefined);

  const cardStyling = "flex h-full border-border rounded-md";

  if (!data) {
    return (
      <Card className={cardStyling}>
        <div className="flex w-full flex-row">
          <div className="flex flex-1 flex-row items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-12" />
          </div>

          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="h-full max-h-20 w-full">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cardStyling}>
      <CardHeader className="flex">
        <CardTitle className="text-md flex flex-1 items-center">
          {device}
          <p className="text-muted-foreground ml-1">
            {brightness !== undefined && ` · ${brightness}%`}
          </p>
        </CardTitle>
        <Switch
          checked={lightState === 1}
          onCheckedChange={() => {
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
            setTimeout(() => {
              setOptimisticState(undefined);
            }, 10000);
          }}
        />
      </CardHeader>
      <CardContent className="h-20">
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
              setTimeout(() => {
                setOptimisticBrightness(undefined);
              }, 10000);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
