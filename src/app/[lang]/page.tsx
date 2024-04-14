"use client";
import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
import { getDictionary } from "@/dictionaries/dictionary";
import GameMenu from "@/components/GameMenu";
import { useLangStore } from "@/utils/storeProvider";
import { useRouter } from "next/navigation";
import MobileDetect from "mobile-detect";
// eslint-disable-next-line @next/next/no-async-client-component
const Page = ({ params }: any) => {
  const router = useRouter();
  const md = new MobileDetect(window.navigator.userAgent);

  if (!!!params.lang) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h2 className="text-xl font-bold text-white">Not Found</h2>
        <p className="text-white">Could not find requested resource</p>
        <Link href={"/"} className="text-white">
          Return Home
        </Link>
      </div>
    );
  }

  //main
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className=" absolute right-10 top-10">
        <div className="flex flex-col items-center">
          <label className="swap swap-flip text-4xl">
            <input
              type="checkbox"
              onClick={(e) => {
                if (params.lang == "th") {
                  router.push(`/en`);
                } else {
                  router.push(`/th`);
                }
              }}
            />
            <div
              className={
                params.lang == "th"
                  ? "swap-on hover:scale-110"
                  : "swap-off hover:scale-110"
              }
            >
              🇺🇸
            </div>
            <div
              className={
                params.lang == "th"
                  ? "swap-off hover:scale-110"
                  : "swap-on hover:scale-110"
              }
            >
              🇹🇭
            </div>
          </label>
          <span className="text-white">{params.lang.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center items-center mb-4">
          <AiFillEye
            className={
              params.lang == "th"
                ? "text-8xl font-bold text-black tracking-wider"
                : "text-9xl font-bold text-black tracking-wider"
            }
          />
          <h1
            className={
              params.lang == "th"
                ? "text-3xl font-bold text-black tracking-wider"
                : "text-6xl font-bold text-black tracking-wider"
            }
          >
            {/* @ts-ignore */}
            {params.lang == "th" ? "จอมบงการ" : "INSINDER"}
          </h1>
        </div>
      </div>
      {/* open here */}
      <GameMenu lang={params.lang} />
      {/* <span>Website is under maintenance....</span> */}
      {md.os() == "iPadOS" ||
      md.is("iPad") ||
      md.match("Macintosh; Intel Mac OS X") ? (
        <div
          className="alert lg:w-7/12 mt-8 bg-stone-800 border-0 text-white"
          id="info"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-white shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            {params.lang == "th"
              ? "สำหรับคนใช้ iPad ให้อัพเดท IOS เป็น version ล่าสุด"
              : "For iPad users, please update IOS to the latest version."}
          </span>
          <div>
            <button
              className="btn btn-sm"
              onClick={() => {
                document.getElementById("info")?.remove();
              }}
            >
              {params.lang == "th" ? "ปิด" : "Close"}
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Page;
