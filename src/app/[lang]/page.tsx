import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
import { getDictionary } from "@/dictionaries/dictionary";
import GameMenu from "@/components/GameMenu";
import { useLangStore } from "@/utils/storeProvider";

// eslint-disable-next-line @next/next/no-async-client-component
const Page = async ({ params }: any) => {
  let lang = await getDictionary(params.lang);
  useLangStore.setState({ lang: lang });
  if (!!!lang) {
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
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center items-center mb-4">
          <AiFillEye className=" text-black text-9xl" />
          <h1 className="text-6xl font-bold text-black tracking-wider">
            {/* @ts-ignore */}
            {lang?.text.title}
          </h1>
        </div>
      </div>

      <GameMenu lang={params.lang} />
    </div>
  );
};
export default Page;
