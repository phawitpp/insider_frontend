"use client";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useRouter } from "next/navigation";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
export default function GameMenu() {
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const { socket, isConnected } = useSocket();
  const handleScan = (data: string | null) => {
    if (data) {
      setRoomCode(data);
      setShowScanner(false);
    }
  };
  const router = useRouter();
  const { setName }: any = useGameStore();
  return (
    <div className="text-white flex flex-col gap-1">
      <input
        id="nickname"
        type="text"
        value={nickname}
        className="input input-md bg-slate-800 text-white"
        placeholder="Set player name"
        onChange={(e) => setNickname(e.target.value)}
      />

      <a
        className="btn text-white input-md tracking-widest bg-slate-800 border-0"
        onClick={() => {
          if (nickname.length > 0) {
            setName(nickname);
            router.push(`/${"en"}/create`);
          } else {
            (
              document.getElementById("my_modal_1") as HTMLDialogElement
            )?.showModal();
          }
        }}
      >
        Create Game
      </a>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-white">Oops!</h3>
          <p className="py-4 text-white">Press set the player name first .</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-slate-800">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="loading_modal" className="modal">
        <div className="modal-box">
          <div className="py-4">
            <span className="loading loading-spinner"></span>
          </div>
        </div>
      </dialog>
      <div className="divider">OR</div>
      <label htmlFor="room-code-input" className=" text-sm">
        Enter room code:
      </label>
      <input
        id="room-code-input"
        type="text"
        value={roomCode}
        className="input input-md bg-slate-800"
        onChange={(e) => {
          if (e.target.value.length >= 6) {
            if (nickname.length > 0) {
              setName(nickname);
              socket.emit("join", {
                roomId: e.target.value.toString(),
                player: nickname,
              });
              router.replace(`/${"en"}/room/${e.target.value}`);
            } else {
              (
                document.getElementById("my_modal_1") as HTMLDialogElement
              )?.showModal();
            }
          }
          setRoomCode(e.target.value);
        }}
      />
      <button
        onClick={() => setShowScanner(true)}
        className=" underline text-sm"
      >
        Scan QR Code
      </button>
      {showScanner && (
        <QrReader
          onResult={(result: any, error: any) => {
            console.log(result, error);
            if (!!result && roomCode.length != 6) {
              console.log(result?.text);

              setRoomCode(result?.text);
              setShowScanner(false);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          constraints={{ facingMode: "environment" }}
        />
      )}
    </div>
  );
}