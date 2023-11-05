import Navbar from "@/components/Nav";
export default function CreateRoomLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-between p-24">
      <Navbar />
      {children}
      <div></div>
    </div>
  );
}
