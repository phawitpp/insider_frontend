"use client";
import { useParams } from "next/navigation";
import { AiFillEye } from "react-icons/ai";
// eslint-disable-next-line @next/next/no-async-client-component
export default async function Navbar() {
  const router = useParams();
  const lang = router["lang"];
  return (
    <div className="navbar">
      <div className="navbar-start"></div>
      <div className="navbar-center">
        {" "}
        <AiFillEye className=" text-black text-4xl" />
        <h1 className="text-2xl font-bold text-black tracking-wider">
          {lang == "th" ? "จอมบงการ" : "INSINDER"}
        </h1>
      </div>
      <div className="navbar-end"></div>
    </div>
  );
}
