"use client";
export default function RoomLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className=" justify-center flex flex-col items-center">
        {children}
      </div>
    </>
  );
}
