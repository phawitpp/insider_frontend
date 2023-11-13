"use client";
import GameStart from "@/components/GameStart";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function GameRoom({ params }: any) {
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const { name }: any = useGameStore();
  const [roomDetail, setRoomDetail] = useState<any>(null);
  const lang = params.lang;
  useEffect(() => {
    socket.on("notfound", () => {
      alert("Room not found");
      router.push(`/${params.lang}`);
    });
    socket.on("newjoin", async (data: any) => {
      setRoomDetail(data);
    });
    socket.on("full", () => {
      alert("Room is full");
      router.push(`/${params.lang}`);
    });
    socket.on("start", async (data: any) => {
      await setRoomDetail(data);
    });
  }, [socket]);

  const handleLeave = () => {
    socket.emit("leave", { roomId: params.id });
    router.push(`/${params.lang}`);
  };
  return roomDetail ? (
    roomDetail.status == "waiting" ? (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl md:text-4xl font-bold text-black tracking-wider">
          {lang == "th" ? "กำลังรอผู้เล่น..." : "Waiting for player..."}
        </h1>

        <div className="flex flex-col md:flex-row">
          <QRCode
            value={params.id}
            size={128}
            style={{
              margin: "20px",
              border: "1px solid #000000",
            }}
          />
          <div className="flex flex-col justify-center items-center py-4">
            <span className="text-xl text-black font-bold tracking-widest">
              {lang == "th" ? "รหัสห้อง " : "Room code "}
            </span>
            <span className="text-2xl font-bold text-white tracking-wider">
              {params.id}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-black tracking-wider">
          {lang == "th" ? "ผู้เล่น" : "Player"}
        </h3>
        {
          // @ts-ignore
          roomDetail?.player?.map((player: any) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <>
                {player.name == name ? (
                  roomDetail.host.name == name ? (
                    <div className="flex flex-row justify-center items-center\">
                      <span className="text-xl text-black">
                        {lang == "th"
                          ? name + "(คุณ)(เจ้าของ)"
                          : name + "(You)(Host)"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-center items-center\">
                      <span className="text-xl text-black">
                        {lang == "th" ? name + "(คุณ)" : name + "(You)"}
                      </span>
                    </div>
                  )
                ) : roomDetail.host.name == player.name ? (
                  <div className="flex flex-row justify-center items-center">
                    <span className="text-xl text-white">
                      {lang == "th"
                        ? player.name + "(เจ้าของ)"
                        : player.name + "(Host)"}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-row justify-center items-center">
                    <span className="text-xl text-white">{player.name}</span>
                  </div>
                )}
              </>
            );
          })
        }
        <div className="flex gap-10 py-8">
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box bg-stone-900 border-0">
              <h3 className="font-bold text-lg text-white">
                {lang == "th" ? "อุ๊ป!" : "Oops!"}
              </h3>
              <p className="py-4 text-white">
                {lang == "th"
                  ? "ต้องให้ผู้เล่นครบก่อนถึงจะเริ่มได้"
                  : "ํYou need more player to start."}
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn bg-slate-800 text-white">
                    {lang == "th" ? "ปิด" : "Close"}
                  </button>
                </form>
              </div>
            </div>
          </dialog>
          <button
            className={
              lang == "th"
                ? "btn btn-md w-24 bg-slate-800 text-white tracking-widest border-0"
                : "btn bg-slate-800 text-white tracking-widest border-0 font-medium"
            }
            onClick={() => {
              handleLeave();
            }}
          >
            {lang == "th" ? "ออก" : "Leave"}
          </button>
          {roomDetail?.host.name == name ? (
            <button
              className={
                lang == "th"
                  ? "btn btn-md w-24 bg-slate-800 text-white tracking-widest border-0"
                  : "btn bg-slate-800 text-white tracking-widest border-0 font-medium"
              }
              onClick={() => {
                if (roomDetail.player.length < roomDetail.numberplayer) {
                  (
                    document.getElementById("my_modal_1") as HTMLDialogElement
                  )?.showModal();
                } else socket.emit("start", { roomId: params.id });
              }}
            >
              {lang == "th" ? "เริ่ม" : "Start"}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    ) : (
      <>
        <GameStart params={params} roomdetail={roomDetail} />
      </>
    )
  ) : (
    <div className="flex flex-col justify-center items-center">
      <div className="loading loading-spinner loading-lg text-white"></div>
    </div>
  );
}
