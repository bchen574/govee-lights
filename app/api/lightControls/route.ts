import { NextRequest, NextResponse } from "next/server";

const GOVEE_URL = "https://openapi.api.govee.com/router/api/v1/device/control";

async function sendCommand(sku: string, device: string, value: number) {
  const response = await fetch(GOVEE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Govee-API-Key": process.env.GOVEE_API_KEY!,
    },
    body: JSON.stringify({
      requestId: crypto.randomUUID(),
      payload: {
        sku,
        device,
        capability: {
          type: "devices.capabilities.on_off",
          instance: "powerSwitch",
          value,
        },
      },
    }),
  });
  return response.json();
}

const ALL_DEVICES = [
  { sku: "H619A", device: "14:70:D1:05:C3:46:2A:69" }, // Tv
  { sku: "H619A", device: "17:01:D4:0E:86:06:7E:3F" }, // Bedroom
  { sku: "H6008", device: "05:E7:5C:E7:53:6A:D8:DC" }, // Ceiling
  { sku: "H6008", device: "05:4A:5C:E7:53:66:42:66" }, // Mirror
  { sku: "H6008", device: "05:19:5C:E7:53:65:C0:A4" }, // Ball
  { sku: "H6008", device: "05:14:5C:E7:53:6A:BE:7C" }, // Low Lamp
];

export async function POST(req: NextRequest) {
  const { action } = await req.json();
  const value = action === "on" ? 1 : 0;

  const results = await Promise.all(
    ALL_DEVICES.map(({ sku, device }) => sendCommand(sku, device, value)),
  );

  return NextResponse.json({ results });
}
