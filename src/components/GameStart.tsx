"use client";
import { useState, useEffect } from "react";
import { useGameStore } from "@/utils/storeProvider";
import { useSocket } from "@/utils/socketProvider";
import { BsQuestion, BsExclamationLg } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import { useRouter } from "next/navigation";
const GameStart = ({ params, roomdetail }: any) => {
  const [countdown, setCountdown] = useState(3);
  const [isCountdown, setIsCountdown] = useState(true);
  const [gameCountdown, setGameCountdown] = useState(300);
  const [isStartCountdown, setIsStartCountdown] = useState(false);
  const [discussCountdown, setDiscussCountdown] = useState(120);
  const [isDiscussCountdown, setIsDiscussCountdown] = useState(false);
  const [votePlayer, setVotePlayer] = useState<any>(null);
  const [role, setRole] = useState<any>(null);
  const [master, setMaster] = useState<any>(null);
  const [word, setWord] = useState<any>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { socket, isConnected } = useSocket();
  const { name }: any = useGameStore();
  const router = useRouter();
  const lang = params.lang;
  useEffect(() => {
    socket.on("getrole", (data: any) => {
      setRole(data.player.role);
      setWord(data.player.word);
      setMaster(data.master.name);
    });
    socket.on("starttimer", () => {
      setIsStartCountdown(true);
    });
    socket.on("stoptimer", () => {
      setIsStartCountdown(false);
    });
    socket.on("gameover", () => {
      setIsStartCountdown(false);
      setIsGameOver(true);
    });
    socket.on("startdiscussion", () => {
      setIsDiscussCountdown(true);
    });
    socket.on("stopdiscussion", () => {
      setIsDiscussCountdown(false);
    });
    socket.on("voting", () => {
      setIsVoting(true);
    });
    socket.on("allvoted", () => {
      router.replace(`/${params.lang}/room/${params.id}/result`);
    });
    socket.on("someoneleave", () => {
      alert("Someone leave the room");
      router.replace(`/${params.lang}`);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    socket.emit("role", { roomId: params.id });
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setIsCountdown(false);
    }
  }, [countdown]);
  //game countdown 5 mins
  useEffect(() => {
    if (gameCountdown >= 0 && isStartCountdown) {
      const intervalId = setInterval(() => {
        setGameCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }

    if (gameCountdown == 0) {
      socket.emit("gameover", { roomId: params.id });
      setIsStartCountdown(false);
      setIsGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameCountdown, isStartCountdown]);

  //discussion countdown 2 mins
  useEffect(() => {
    if (discussCountdown >= 0 && isDiscussCountdown) {
      const intervalId = setInterval(() => {
        setDiscussCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }

    if (discussCountdown == 0) {
      socket.emit("voting", { roomId: params.id });
      setIsDiscussCountdown(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussCountdown, isDiscussCountdown]);
  const minutes = Math.floor(gameCountdown / 60);
  const seconds = gameCountdown % 60;
  const discussMinutes = Math.floor(discussCountdown / 60);
  const discussSeconds = discussCountdown % 60;
  return (
    <>
      {isCountdown ? (
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-bold text-8xl text-white"> {countdown}</h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center">
            {!isGameOver ? (
              //Guessing
              <>
                <div className="flex flex-col lg:flex-row">
                  {
                    // @ts-ignore
                    role == "insider" ? (
                      <div className="card  shadow-xl bg-stone-900 text-white">
                        <figure>
                          <AiFillEye className="text-8xl my-10" />
                        </figure>
                        <div className="card-body">
                          <h1 className="card-title text-center text-2xl justify-center">
                            {lang == "th"
                              ? "คุณคือจอมบงการ"
                              : "You are a insider"}
                          </h1>
                          <p className=" justify-center card-body items-center">
                            {lang == "th" ? "คำที่ต้องทายคือ " : "The word is "}
                            {"" + word + ""}
                          </p>
                        </div>
                      </div>
                    ) : role == "master" ? (
                      <div className="card shadow-xl bg-stone-900 text-white">
                        <figure>
                          <BsExclamationLg className="text-9xl my-6" />
                        </figure>
                        <div className="card-body">
                          <h1 className="card-title text-center text-2xl justify-center">
                            {lang == "th"
                              ? "คุณคือผู้ดำเนินเกม"
                              : "You are a Master"}
                          </h1>
                          <p className=" justify-center card-body items-center">
                            {lang == "th" ? "คำที่ต้องทายคือ " : "The word is "}{" "}
                            {"" + word + ""}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="card  shadow-xl bg-stone-900 text-white">
                        <figure>
                          <BsQuestion className="text-9xl my-6" />
                        </figure>
                        <div className="card-body">
                          <h1 className="card-title text-center text-2xl justify-center">
                            {lang == "th"
                              ? "คุณคือคนทั่วไป"
                              : "You are a common"}
                          </h1>
                          <p className=" justify-center card-body items-center">
                            {lang == "th" ? "ทายคำกันเลย!" : "Guess the word!"}{" "}
                          </p>
                        </div>
                      </div>
                    )
                  }
                  <div className=" items-center justify-center flex flex-col p-4 gap-3">
                    <div></div>
                    <div className=" divider text-black">
                      {" "}
                      {lang == "th" ? "เหลือเวลา" : "Time Left"}
                    </div>
                    <span className="font-bold text-5xl text-white text-shadow-sm">
                      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}{" "}
                      {lang == "th" ? "นาที" : "Mins"}
                    </span>
                    {role == "master" ? (
                      <>
                        {isStartCountdown ? (
                          <div className="flex flex-col gap-2">
                            <button
                              className="btn bg-stone-900  text-white tracking-widest border-0 font-normal shadow-md"
                              onClick={() => {
                                socket.emit("stoptimer", { roomId: params.id });
                              }}
                            >
                              {lang == "th" ? "หยุดเวลา" : "Stop Timer"}
                            </button>
                            <button
                              className="btn border-0 bg-gray-700 text-white tracking-widest bottom-0 font-normal shadow-md hover:bg-gray-800"
                              onClick={() => {
                                socket.emit("gameover", { roomId: params.id });
                              }}
                            >
                              {lang == "th"
                                ? "คำถูกทายแล้ว"
                                : "Word is guessed"}
                            </button>
                          </div>
                        ) : (
                          <div className="flex mt-4">
                            <button
                              className="btn bg-stone-900  text-white tracking-widest border-0 font-normal shadow-md"
                              onClick={() => {
                                socket.emit("starttimer", {
                                  roomId: params.id,
                                });
                              }}
                            >
                              {lang == "th" ? "เริ่มจับเวลา" : "Start Timer"}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {
                  //discussion
                  !isVoting ? (
                    <>
                      <h1 className=" text-white text-3xl">
                        {lang == "th" ? "ช่วงออกความเห็น" : "Discussion"}
                      </h1>
                      <div></div>
                      <div className=" divider text-black">
                        {" "}
                        {lang == "th" ? "เหลือเวลา" : "Time Left"}
                      </div>
                      <span className="font-bold text-5xl text-white text-shadow-sm">
                        {discussMinutes}:
                        {discussSeconds < 10
                          ? `0${discussSeconds}`
                          : discussSeconds}
                        {lang == "th" ? " นาที" : " Mins"}
                      </span>
                      <div className="flex flex-col gap-2 mt-4">
                        {isDiscussCountdown ? (
                          <>
                            {role == "master" ? (
                              <>
                                <button
                                  className="btn bg-stone-900  text-white tracking-widest border-0 font-normal shadow-md"
                                  onClick={() => {
                                    socket.emit("stopdiscussion", {
                                      roomId: params.id,
                                    });
                                  }}
                                >
                                  {lang == "th"
                                    ? "หยุดการเจรจา"
                                    : "Stop Discussion"}
                                </button>
                                <button
                                  className="btn border-0 bg-gray-700 text-white tracking-widest font-normal shadow-md"
                                  onClick={() => {
                                    socket.emit("voting", {
                                      roomId: params.id,
                                    });
                                  }}
                                >
                                  {lang == "th" ? "ข้ามไปโหวต" : "Skip to vote"}
                                </button>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <>
                            {
                              // @ts-ignore
                              role == "master" ? (
                                <button
                                  className="btn bg-stone-900  text-white tracking-widest border-0 font-normal shadow-md"
                                  onClick={() => {
                                    socket.emit("startdiscussion", {
                                      roomId: params.id,
                                    });
                                  }}
                                >
                                  {lang == "th"
                                    ? "เริ่มเจรจา"
                                    : "Start Discussion"}
                                </button>
                              ) : (
                                <></>
                              )
                            }
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    //voting
                    <>
                      <div className="flex flex-col justify-between gap-10">
                        <h1 className=" text-white text-5xl">
                          {lang == "th" ? "โหวตผู้เล่น" : "Player vote"}
                        </h1>
                        <div className=" join join-vertical">
                          {roomdetail.player
                            .filter(
                              (player: any) =>
                                player.name != master && player.name != name
                            )
                            .map((player: any) => {
                              return (
                                <>
                                  <button
                                    className={
                                      player.name != votePlayer
                                        ? "btn bg-stone-900  text-white tracking-widest join-item no-animation hover:none border-0 font-medium"
                                        : "btn bg-white text-black tracking-widest border-0 join-item no-animation hover:none font-medium"
                                    }
                                    onClick={() => {
                                      setVotePlayer(player.name);
                                    }}
                                  >
                                    {player.name}
                                    {player.name == votePlayer ? (
                                      <span className="badge bg-red-500 border-0">
                                        <AiFillEye className="text-white" />
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </button>
                                </>
                              );
                            })}
                        </div>
                        <dialog id="voteconfirm" className="modal">
                          <div className="modal-box bg-stone-900 text-white">
                            <h3 className="font-bold text-lg ">
                              {lang == "th" ? "ยืนยันหรือไม่" : "Are you sure"}
                            </h3>
                            <p className="py-4">
                              {lang == "th"
                                ? "คุณต้องการโหวต "
                                : "You want to vote for "}{" "}
                              {votePlayer} {lang == "th" ? " ใช่หรือไม่" : ""}
                            </p>
                            <div className="modal-action">
                              <form method="dialog">
                                <button className="btn bg-black text-white border-0 font-medium">
                                  {lang == "th" ? "ยกเลิก" : "Cancel"}
                                </button>
                              </form>
                              <button
                                className="btn bg-black text-white border-0 font-medium"
                                onClick={() => {
                                  socket.emit("voted", {
                                    roomId: params.id,
                                    player: votePlayer,
                                  });
                                  router.replace(
                                    `/${params.lang}/room/${params.id}/waiting`
                                  );
                                }}
                              >
                                {lang == "th" ? "ยีนยัน" : "Confirm"}
                              </button>
                            </div>
                          </div>
                        </dialog>
                        {votePlayer != null ? (
                          <button
                            className="btn bg-stone-900  text-white tracking-widest border-0 font-medium"
                            onClick={() => {
                              (
                                document.getElementById(
                                  "voteconfirm"
                                ) as HTMLDialogElement
                              )?.showModal();
                            }}
                          >
                            {lang == "th" ? "โหวต" : "Vote"}
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
                  )
                }
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
export default GameStart;
