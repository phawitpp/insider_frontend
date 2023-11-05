import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-xl font-bold text-white">Not Found</h2>
      <p className="text-white">Could not find requested resource</p>
      <Link href="/" className="text-white">
        Return Home
      </Link>
    </div>
  );
}
