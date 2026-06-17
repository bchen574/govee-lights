"use client";
import type { Command } from "@/lib/govee/api/server/sendCommand";
import { useMutation } from "@tanstack/react-query";

export async function sendCommands(commands: Command[]) {
  const res = await fetch("/api/sendCommand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });

  if (!res.ok) {
    throw new Error("Failed to send commands");
  }

  return res.json();
}

export function useSendCommands() {
  return useMutation({
    mutationFn: sendCommands,
  });
}
