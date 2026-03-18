import Image from "next/image";
import bobaImage from "@/assets/boba.webp";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <Image
        src={bobaImage}
        alt="Boba tea illustration"
        width={297}
        height={296}
        priority
      />
      <p className="font-sans font-normal text-[24px] text-brand-walnut text-center">
        I&apos;m just here waiting for your charming notes...
      </p>
    </div>
  );
}
