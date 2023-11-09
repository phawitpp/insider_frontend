"use client";
import GameStart from "@/components/GameStart";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Waiting({ params }: any) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const { name }: any = useGameStore();

  useEffect(() => {
    socket.on("allvoted", () => {
      router.push(`/${params.lang}/room/${params.id}/result`);
    });
  }, [socket]);
  return <></>;
}
