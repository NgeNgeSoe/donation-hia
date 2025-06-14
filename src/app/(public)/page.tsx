import DonationInfoItem from "@/components/project/donation-info-item";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur shadow flex items-center px-8 py-3">
        <Image
          src="/img/logo.png"
          width={48}
          height={48}
          alt="logo"
          className="mr-4"
        />
        <span className="text-2xl font-bold text-gray-700">
          Hearts in Action (HiA)
        </span>
      </header>
      <div
        className="w-full flex justify-center items-center min-h-[600px] overflow-hidden"
        style={{
          backgroundImage: "url(/Rice-Porridge.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
        }}
      >
        <Label className="text-6xl text-gray-500">
          Donation Helps Give For Nonprofits
        </Label>
      </div>
      <div className="grid grid-rows-[20px_1fr_20px]  min-h-screen p-08 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex gap-5 justify-center items-center">
            <Heart fill="red" color="red" />
            <h1 className="text-xl">Raising Your Helping Hands</h1>
          </div>
          <div className="w-full">
            <h1 className="text-5xl font-bold mb-10">Check Latest Activies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
              <DonationInfoItem />
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Copyright . All Rights Reserved.
          </a>
        </footer>
      </div>
    </>
  );
}
