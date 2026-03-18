import React from "react";

export default function NotesSkeleton() {
  const SKELETON_COUNT = 6;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="bg-brand-peach/10 border border-brand-peach/20 rounded-[12px] p-6 h-[180px] animate-pulse flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <div className="h-[12px] w-[60px] bg-brand-peach/20 rounded-full" />
            <div className="h-[24px] w-[80%] bg-brand-peach/30 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 flex-grow">
            <div className="h-[14px] w-full bg-brand-peach/20 rounded-full" />
            <div className="h-[14px] w-full bg-brand-peach/20 rounded-full" />
            <div className="h-[14px] w-[60%] bg-brand-peach/20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
