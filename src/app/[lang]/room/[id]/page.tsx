"use client";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameRoom({ params }: any) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const { name }: any = useGameStore();
  const [roomDetail, setRoomDetail] = useState<any>({});

  useEffect(() => {
    socket.on("newjoin", (data: any) => {
      setRoomDetail(data);
    });
  }, []);

  const handleLeave = () => {
    socket.emit("leave", { roomId: params.id });
    router.push(`/${params.lang}`);
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-black tracking-wider">
        Game Room
      </h1>
      <div>{params.id}</div>
      <h3 className="text-xl font-bold text-black tracking-wider">Player</h3>
      {
        // @ts-ignore
        roomDetail?.player?.map((player: any) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div>{player.name}</div>
          );
        })
      }
      <div className="flex gap-10">
        <button
          className="btn text-white tracking-widest"
          onClick={() => {
            handleLeave();
          }}
        >
          Cancel
        </button>
        <button className="btn text-white tracking-widest">Start</button>
      </div>
    </div>
  );
}
