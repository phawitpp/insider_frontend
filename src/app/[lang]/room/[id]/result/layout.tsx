"use client";
import Navbar from "@/components/Nav";
export default function RoomLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" justify-center flex flex-col items-center gap-3 lg:gap-20 lg:flex-row">
        {children}
      </div>
    </>
  );
}
