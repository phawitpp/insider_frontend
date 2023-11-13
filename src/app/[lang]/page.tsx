"use client";
import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
import { getDictionary } from "@/dictionaries/dictionary";
import GameMenu from "@/components/GameMenu";
import { useLangStore } from "@/utils/storeProvider";
import { useRouter } from "next/navigation";
// eslint-disable-next-line @next/next/no-async-client-component
const Page = ({ params }: any) => {
  const router = useRouter();
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

      <GameMenu lang={params.lang} />
    </div>
  );
};
export default Page;
