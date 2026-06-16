"use client";

import { ALL_DEVICES, type Device } from "./devices";
import { useQuery } from "@tanstack/react-query";

type CapabilityResponse = {
  type: string;
  instance: string;
  state: {
    value: unknown;
  };
};

export type DeviceStateResponse = {
  requestId: string;
  msg: string;
  code: number;
  payload: {
    sku: string;
    device: string;
    capabilities: CapabilityResponse[];
  };
};

export type AllDeviceStates = Partial<Record<Device, DeviceStateResponse>>;

async function getDeviceState(deviceKey: Device): Promise<DeviceStateResponse> {
  const sku = ALL_DEVICES[deviceKey].sku;
  const device = ALL_DEVICES[deviceKey].device;

  const res = await fetch("/api/getDeviceState", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sku, device }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

async function getAllDeviceStates(): Promise<AllDeviceStates> {
  const entries = await Promise.all(
    (Object.keys(ALL_DEVICES) as Device[]).map(async (deviceKey) => [
      deviceKey,
      await getDeviceState(deviceKey),
    ]),
  );

  return Object.fromEntries(entries);
}

export function useAllDeviceStates() {
  return useQuery({
    queryKey: ["deviceStates"],
    queryFn: getAllDeviceStates,
    refetchInterval: 1000,
  });
}
