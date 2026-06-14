import { NextRequest, NextResponse } from "next/server";
const GOVEE_URL = "https://openapi.api.govee.com/router/api/v1/device/state";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const { sku, device } = data;
  const apiKey = process.env.GOVEE_API_KEY;

  if (!apiKey) {
    throw new Error("Api key is missing.");
  }

  try {
    const res = await fetch(GOVEE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Govee-API-Key": apiKey,
      },
      body: JSON.stringify({
        requestId: crypto.randomUUID(),
        payload: {
          sku: sku,
          device: device,
        },
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to get device state.");
    }

    const result = await res.json();
    return NextResponse.json(result, {
      status: res.status,
    });
  } catch (error) {
    console.log(error);
  }
}
