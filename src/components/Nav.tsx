"use client";
import { getDictionary } from "../dictionaries/dictionary";
import { AiFillEye } from "react-icons/ai";
// eslint-disable-next-line @next/next/no-async-client-component
export default async function Navbar() {
  const lang = await getDictionary("en");
  return (
    <div className="navbar">
      <div className="navbar-start"></div>
      <div className="navbar-center">
        {" "}
        <AiFillEye className=" text-black text-4xl" />
        <h1 className="text-2xl font-bold text-black tracking-wider">
          {lang?.text.title}
        </h1>
      </div>
      <div className="navbar-end"></div>
    </div>
  );
}
