import Link from "next/link";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <span className="loading loading-spinner"></span>
    </div>
  );
}
