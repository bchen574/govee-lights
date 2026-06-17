import { NextRequest, NextResponse } from "next/server";
import sendCommand from "@/lib/govee/api/server/sendCommand";
import type { Command } from "@/lib/govee/api/server/sendCommand";

export async function POST(req: NextRequest) {
  const commands: Command[] = await req.json();

  const results = await Promise.all(
    commands.map((command) => sendCommand(command)),
  );

  return NextResponse.json({ results });
}
