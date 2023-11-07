"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/utils/storeProvider";
import { useSocket } from "@/utils/socketProvider";

const GameStart = ({ params, roomdetail }: any) => {
  const [countdown, setCountdown] = useState(3);
  const [isCountdown, setIsCountdown] = useState(true);
  const [roomDetail, setRoomDetail] = useState<any>(roomdetail);
  const [role, setRole] = useState<any>(null);
  const [word, setWord] = useState<any>(null);
  const { socket, isConnected } = useSocket();
  const { name }: any = useGameStore();

  useEffect(() => {
    socket.on("getrole", (data: any) => {
      console.log(data);
      setRole(data.role);
      setWord(data.word);
    });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    socket.emit("role", { roomId: params.id });
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setIsCountdown(false);
    }
  }, [countdown]);

  return (
    <>
      {isCountdown ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-8xl text-white"> {countdown}</h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl text-black"> GO!</h1>
            {
              // @ts-ignore
              role == "insider" ? (
                <h1 className="font-bold text-2xl text-black">
                  You are a Insinder!
                </h1>
              ) : role == "master" ? (
                <h1 className="font-bold text-2xl text-black">
                  You are a Master!
                </h1>
              ) : (
                <h1 className="font-bold text-2xl text-black">
                  You are a Common!
                </h1>
              )
            }
            {
              // @ts-ignore
              role == "common" ? (
                <h1 className="font-bold text-2xl text-black">
                  Guess the word!
                </h1>
              ) : (
                <h1 className="font-bold text-2xl text-black">
                  Your word is: {word}
                </h1>
              )
            }
            <button className="btn btn-md bg-slate-800 text-white">
              Reveal Your role
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default GameStart;
