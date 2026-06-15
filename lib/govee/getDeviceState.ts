"use client";
import type { Device } from "./devices";
import { ALL_DEVICES } from "./devices";
import { useQuery } from "@tanstack/react-query";
import type { DeviceCapability } from "./capabilities";

type CapabilityResponse = {
  type: string;
  instance: string;
  state: {
    value: unknown;
  };
};

type DeviceStateResponse = {
  requestId: string;
  msg: string;
  code: number;
  payload: {
    sku: string;
    device: string;
    capabilities: CapabilityResponse[];
  };
};

async function getDeviceState(deviceKey: Device): Promise<DeviceStateResponse> {
  const sku = ALL_DEVICES[deviceKey].sku;
  const device = ALL_DEVICES[deviceKey].device;

  const res = await fetch("/api/getDeviceState", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sku: sku, device: device }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export function useDeviceState(deviceKey: Device) {
  return useQuery({
    queryKey: ["deviceState", deviceKey],
    queryFn: () => getDeviceState(deviceKey),
    refetchInterval: 1000,
  });
}
