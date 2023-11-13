"use client";
import GameStart from "@/components/GameStart";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { BsExclamationLg, BsQuestion } from "react-icons/bs";

export default function Waiting({ params }: any) {
  const { socket, isConnected } = useSocket();
  const [result, setResult] = useState<any>({
    result: {
      name: "",
      role: "",
    },
    player: [],
  });
  const router = useRouter();
  const { name }: any = useGameStore();

  useEffect(() => {
    socket.on("allvoted", () => {
      router.push(`/${params.lang}/room/${params.id}/result`);
    });
    socket.on("result", (data: any) => {
      setResult(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("getresult", { roomId: params.id });
  }, []);

  return (
    <>
      <div className="flex flex-col items-center">
        {result.result.role == "insider" ? (
          <>
            <h1 className=" text-5xl text-black mt-2">Common Win</h1>
          </>
        ) : result.result.role == "common" ? (
          <>
            <h1 className=" text-5xl text-black mt-2">Insider Win</h1>
          </>
        ) : (
          <>
            <h1 className=" text-5xl text-black mt-2">Tie</h1>
          </>
        )}
        <span className=" text-2xl text-black mt-2">
          The word is{" "}
          {result.player.length > 0 &&
            result.player?.filter((player: any) => player.role == "master")[0]
              .word}
        </span>
        <div className="mt-4 p-10 flex flex-col justify-start gap-5 text-white">
          <div className="flex flex-col items-center">
            <div className="flex flex-row  text-black justify-center items-center">
              <AiFillEye className="text-2xl" />
              <span className="text-2xl">Insider </span>
            </div>
            {result.player.length > 0 &&
              result?.player
                ?.filter((player: any) => player.role == "insider")
                .map((player: any) => {
                  return (
                    <>
                      <span className="text-white text-5xl">{player.name}</span>
                    </>
                  );
                })}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="btn bg-stone-900 text-white border-0 font-medium tracking-widest"
          onClick={() => {
            const player = result.player.filter(
              (player: any) => player.id == socket.id
            )[0];
            socket.emit("playagain", { roomId: params.id, player: player });
            router.push(`/${params.lang}/room/${params.id}/`);
          }}
        >
          Play Again
        </button>
        <button
          className="btn bg-gray-700 text-white border-0 font-medium tracking-widest"
          onClick={() => {
            router.push(`/${params.lang}`);
          }}
        >
          Back to home
        </button>
      </div>
    </>
  );
}
