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
      console.log(data);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("getresult", { roomId: params.id });
  }, []);

  return (
    <>
      {result.result.role == "insider" ? (
        <>
          <h1 className=" text-6xl text-black mt-2">Insider Win</h1>
        </>
      ) : result.result.role == "common" ? (
        <>
          <h1 className=" text-6xl text-black mt-2">Common Win</h1>
        </>
      ) : (
        <></>
      )}
      <div className="mt-4 p-10 flex flex-col justify-start gap-5 text-white">
        <div className="flex flex-col">
          <div className="flex flex-row gap-1 text-black">
            <BsExclamationLg className="text-2xl" />
            <span className="text-2xl">Master</span>
          </div>
          {result?.player
            ?.filter((player: any) => player.role == "master")
            .map((player: any) => {
              return (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-white text-xl">{player.name}</span>
                    <span className="text-white text-xl">
                      {"Voted: " + player.voting}
                    </span>
                  </div>
                </>
              );
            })}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-row gap-1 text-black">
            <AiFillEye className="text-2xl" />
            <span className="text-2xl">Insider</span>
          </div>
          {result?.player
            ?.filter((player: any) => player.role == "insider")
            .map((player: any) => {
              return (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-white text-xl">{player.name}</span>
                    <span className="text-white text-xl">
                      {"Voted: " + player.voting}
                    </span>
                  </div>
                </>
              );
            })}
        </div>
        <div className="flex flex-col ">
          <div className="flex flex-row gap-1 text-black">
            <BsQuestion className="text-2xl" />
            <span className="text-2xl">Common</span>
          </div>
          {result?.player
            ?.filter((player: any) => player.role == "common")
            .map((player: any) => {
              return (
                <>
                  <div className="flex flex-row justify-between items-center">
                    <span className="text-white text-xl">{player.name}</span>
                    <span className="text-white text-xl">
                      {"Voted: " + player.voting}
                    </span>
                  </div>
                </>
              );
            })}
        </div>
      </div>
      <button
        className="btn bg-stone-900 text-white border-0"
        onClick={() => {
          router.push(`/${params.lang}`);
        }}
      >
        Back to home
      </button>
    </>
  );
}
