"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsQuestion, BsExclamationLg } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
type Role = "master" | "insider" | "common";

const CreateRoom = ({ params }: any) => {
  const lang = params.lang;
  const [numPlayers, setNumPlayers] = useState(3);
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const { name }: any = useGameStore();
  const handleIncrement = () => {
    if (numPlayers < 10) {
      setNumPlayers(numPlayers + 1);
    } else {
      setNumPlayers(10);
    }
  };

  const handleDecrement = () => {
    if (numPlayers > 3) {
      setNumPlayers(numPlayers - 1);
    } else {
      setNumPlayers(3);
    }
  };
  const handleCreateRoom = async () => {
    const random6DigitNumber = await generateRandom6DigitNumber();

    if (isConnected && random6DigitNumber != undefined) {
      await socket.emit("create", {
        roomID: random6DigitNumber.toString(),
        numPlayer: numPlayers,
        player: name,
      });
    }
    router.push(`/${params.lang}/room/` + random6DigitNumber);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <span className="text-black text-2xl">
        {lang == "th" ? "จำนวนผู้เล่น" : "How many players?"}
      </span>
      <div className="flex items-center justify-center mt-4">
        <button
          className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-l"
          onClick={handleDecrement}
        >
          -
        </button>
        <input
          type="text"
          className="w-16 text-center py-2 border border-gray-400 rounded font-semibold text-black mx-2 bg-white appearance-none"
          value={numPlayers}
          onChange={(e) => {
            if (parseInt(e.target.value) > 10) {
              setNumPlayers(10);
            } else if (parseInt(e.target.value) < 3) {
              setNumPlayers(3);
            } else setNumPlayers(parseInt(e.target.value));
          }}
        />
        <button
          className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-r"
          onClick={handleIncrement}
        >
          +
        </button>
      </div>
      <div className="mt-4 flex flex-col justify-center items-center">
        {" "}
        <span className="text-black text-2xl ">
          {lang == "th" ? "บทบาท" : "Role"}
        </span>
        <div className="flex flex-row text-white gap-1">
          <div className="flex flex-col items-center justify-center">
            <BsExclamationLg className="text-xl" />
            <AiFillEye className="text-xl" />
            <BsQuestion className="text-xl" />
          </div>
          <div className="flex flex-col  justify-start">
            <span>{lang == "th" ? "ผู้ดำเนินเกม" : "Master"}</span>
            <span>{lang == "th" ? "จอมบงการ" : "Insinder"}</span>
            <span>{lang == "th" ? "คนทั่วไป" : "Common"}</span>
          </div>
          <div className="flex flex-col items-center justify-center ml-10">
            <span>x1</span>
            {numPlayers > 2 && numPlayers <= 6 && <span>x1</span>}
            {numPlayers > 6 && <span>x2</span>}
            {numPlayers <= 6 && <span>x{numPlayers - 2}</span>}
            {numPlayers <= 10 && numPlayers > 6 && (
              <span>x{numPlayers - 3}</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 inline-flex gap-6">
        <button
          className="btn btn-md text-white tracking-widest bg-stone-900 border-0 font-medium"
          onClick={() => {
            router.push(`/${params.lang}`);
          }}
        >
          {lang == "th" ? "กลับ" : "Back"}
        </button>
        <button
          className="btn btn-md text-white tracking-widest bg-stone-900 border-0 font-medium"
          onClick={() => {
            (
              document.getElementById("confirm") as HTMLDialogElement
            )?.showModal();
          }}
        >
          {lang == "th" ? "สร้างห้อง" : "Create"}
        </button>
      </div>
      <dialog id="confirm" className="modal text-white">
        <div className="modal-box bg-stone-900 border-0">
          <p className="py-4 tracking-wide text-white">
            {lang == "th"
              ? "คุณต้องการสร้างเกมหรือไม่"
              : "Are you sure to create the game?"}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn text-white tracking-widest bg-stone-900 border-0">
                {lang == "th" ? "ยกเลิก" : "Cancel"}
              </button>
            </form>
            <div>
              <button
                className="btn text-white tracking-widest bg-stone-900 border-0"
                onClick={async () => {
                  handleCreateRoom();
                }}
              >
                {lang == "th" ? "ใช่" : "Yes"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};
function generateRandom6DigitNumber() {
  const min = 100000; // Smallest 6-digit number
  const max = 999999; // Largest 6-digit number

  // Generate a random number between min and max (inclusive)
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
}

export default CreateRoom;
