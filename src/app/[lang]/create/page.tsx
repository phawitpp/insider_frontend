"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsQuestion, BsExclamationLg } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import { useSocket } from "@/utils/socketProvider";
import { useGameStore } from "@/utils/storeProvider";
type Role = "master" | "insider" | "common";

const CreateRoom = ({ params }: any) => {
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
      <span className="text-black text-2xl">How many players?</span>
      <div className="flex items-center justify-center mt-4">
        <button
          className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-l"
          onClick={handleDecrement}
        >
          -
        </button>
        <input
          type="number"
          className="w-16 text-center py-2 border border-gray-400 rounded font-semibold text-white mx-2"
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
        <span className="text-black text-2xl">Role</span>
        <div className="w-100 flex flex-row justify-between gap-24 text-white">
          <div className="flex flex-row gap-1">
            <BsExclamationLg className="text-xl" />
            <span>Master</span>
          </div>
          <span>x1</span>
        </div>
        {numPlayers > 2 && numPlayers <= 6 && (
          <div className="w-100 flex flex-row justify-between gap-24 text-white">
            <div className="flex flex-row gap-1">
              <AiFillEye className="text-xl" />
              <span>Insider</span>
            </div>

            <span>x1</span>
          </div>
        )}
        {numPlayers > 6 && (
          <div className="w-100 flex flex-row justify-between gap-24 text-white">
            <div className="flex flex-row gap-1">
              <AiFillEye className="text-xl" />
              <span>Insider</span>
            </div>
            <span>x2</span>
          </div>
        )}
        {numPlayers <= 6 && (
          <div className="w-100 flex flex-row justify-between gap-24 text-white">
            <div className="flex flex-row gap-1">
              <BsQuestion className="text-xl" />
              <span>Common</span>
            </div>
            <span>x{numPlayers - 2}</span>
          </div>
        )}
        {numPlayers <= 10 && numPlayers > 6 && (
          <div className="w-100 flex flex-row justify-between gap-24 text-white">
            <div className="flex flex-row gap-1">
              <BsQuestion className="text-xl" />
              <span>Common</span>
            </div>
            <span>x{numPlayers - 3}</span>
          </div>
        )}
      </div>
      <div className="mt-10 inline-flex gap-6">
        <button
          className="btn btn-sm text-white tracking-widest"
          onClick={() => {
            router.push(`/${params.lang}`);
          }}
        >
          Back
        </button>
        <button
          className="btn btn-sm text-white tracking-widest"
          onClick={() => {
            (
              document.getElementById("confirm") as HTMLDialogElement
            )?.showModal();
          }}
        >
          Create
        </button>
      </div>
      <dialog id="confirm" className="modal text-white">
        <div className="modal-box">
          <p className="py-4 tracking-wide">Are you sure to create the game?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn text-white tracking-widest">Cancel</button>
            </form>
            <div>
              <button
                className="btn text-white tracking-widest"
                onClick={async () => {
                  handleCreateRoom();
                }}
              >
                Yess!
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
