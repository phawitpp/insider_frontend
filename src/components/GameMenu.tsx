"use client";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useRouter } from "next/navigation";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
import { getDictionary } from "@/dictionaries/dictionary";
const GameMenu = ({ lang }: any) => {
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const { socket, isConnected } = useSocket();
  const router = useRouter();
  const { setName }: any = useGameStore();

  return (
    <div className="text-white flex flex-col gap-1">
      <input
        id="nickname"
        type="text"
        value={nickname}
        className="input input-md bg-slate-800 text-white"
        placeholder={lang == "th" ? "ตั้งชื่อผู้เล่น" : "Set player name"}
        onChange={(e) => setNickname(e.target.value)}
      />

      <a
        className="btn text-white input-md tracking-widest bg-slate-800 border-0 font-medium"
        onClick={() => {
          if (nickname.length > 0) {
            setName(nickname);
            router.push(`/${lang}/create`);
          } else {
            (
              document.getElementById("my_modal_1") as HTMLDialogElement
            )?.showModal();
          }
        }}
      >
        {lang == "th" ? "สร้างห้อง" : "Create Room"}
      </a>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-slate-800">
          <h3 className="font-bold text-lg text-white tracking-widest">
            {lang == "th" ? "อุ๊ป!" : "Oops!"}
          </h3>
          <p className="py-4 text-white tracking-widest">
            {lang == "th"
              ? "โปรดตั้งชื่อก่อน"
              : "Press set the player name first ."}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-slate-800 text-white font-medium">
                {lang == "th" ? "ปิด" : "Close"}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="loading_modal" className="modal">
        <div className="modal-box bg-slate-800">
          <div className="py-4">
            <span className="loading loading-spinner"></span>
          </div>
        </div>
      </dialog>
      <div className="divider">{lang == "th" ? "หรือ" : "OR"}</div>
      <label htmlFor="room-code-input" className=" text-sm">
        {lang == "th" ? "โปรดใส่เลขห้อง: " : "Enter room code:"}
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
              router.replace(`/${lang}/room/${e.target.value}`);
            } else {
              (
                document.getElementById("my_modal_1") as HTMLDialogElement
              )?.showModal();
            }
          }
          setRoomCode(e.target.value);
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Enter") {
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
        }}
      />
      <button
        onClick={() => setShowScanner(true)}
        className=" underline text-sm"
      >
        {lang == "th" ? "แสกน QR Code" : "Scan QR Code"}
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
};
export default GameMenu;
