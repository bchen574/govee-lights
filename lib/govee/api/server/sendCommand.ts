const GOVEE_URL = "https://openapi.api.govee.com/router/api/v1/device/control";

import type { Device } from "../../constants/devices";
import { ALL_DEVICES } from "../../constants/devices";
import { DEVICE_CAPABILITIES } from "../../constants/capabilities";
import { DeviceCapability } from "../../constants/capabilities";

export type Command = {
  device: Device;
  capability: DeviceCapability;
  value: string | number;
};

type GoveeControlRequest = {
  requestId: string;
  payload: {
    sku: string;
    device: string;
    capability: {
      type: string;
      instance: string;
      value?: string | number;
    };
  };
};

export default async function sendCommand(command: Command) {
  //api auth
  const apiKey = process.env.GOVEE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GOVEE_API_KEY");
  }

  const { device, capability, value } = command;

  const deviceId = ALL_DEVICES[device].device;
  const sku = ALL_DEVICES[device].sku;
  const capabilityType = DEVICE_CAPABILITIES[sku][capability].type;
  const capabilityInstance = DEVICE_CAPABILITIES[sku][capability].instance;

  const requestBody: GoveeControlRequest = {
    requestId: crypto.randomUUID(),
    payload: {
      sku,
      device: deviceId,
      capability: {
        type: capabilityType,
        instance: capabilityInstance,
        value,
      },
    },
  };

  //fetch request
  const response = await fetch(GOVEE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Govee-API-Key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
