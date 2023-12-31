"use client";
import GameStart from "@/components/GameStart";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Waiting({ params }: any) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const { name }: any = useGameStore();
  const lang = params.lang;
  useEffect(() => {
    socket.on("allvoted", () => {
      router.push(`/${params.lang}/room/${params.id}/result`);
    });
    socket.on("someoneleave", () => {
      alert("Someone leave the room");
      router.replace(`/${params.lang}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  return (
    <>
      <div className="loading loading-dots text-white text-2xl"></div>
      <span className="text-white text-lg">
        {" "}
        {lang == "th"
          ? "โปรดรอผู้เล่นคนอื่นทำการโหวต"
          : "Waiting for another player to vote"}
      </span>
    </>
  );
}
