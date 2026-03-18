"use client";

import Image from "next/image";
import bobaImage from "@/assets/boba.webp";



export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 select-none px-6 h-full">
      <Image
        src={bobaImage}
        alt="Boba tea illustration"
        width={297}
        height={296}
        className="object-contain"
        priority
      />
      <p className="font-sans font-normal text-[24px] text-brand-walnut text-center">
        {"I'm just here waiting for your charming notes..."}
      </p>
    </div>
  );
}
