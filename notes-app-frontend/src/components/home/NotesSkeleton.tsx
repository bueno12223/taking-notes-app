"use client";

import React from "react";
import { CATEGORY_CARD_STYLES } from "@/constants";

export default function NotesSkeleton() {
  const SKELETON_COUNT = 6;
  const categories = Object.keys(CATEGORY_CARD_STYLES);

  return (
    <div className="flex flex-row flex-wrap items-start content-start p-0 gap-y-[16px] gap-x-[13px] animate-pulse">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => {
        const styleClass = CATEGORY_CARD_STYLES[categories[i % categories.length]];

        return (
          <article
            key={i}
            className={`relative flex flex-col w-[303px] h-[246px] rounded-[11px] p-4 gap-3 border-[3px] shadow-[1px_1px_2px_rgba(0,0,0,0.1)] overflow-hidden shrink-0 transition-colors duration-500 opacity-60 ${styleClass}`}
          >
            <header className="flex items-start gap-2 h-[15px] shrink-0">
              <div className="h-[12px] w-[60px] bg-black/10 rounded-full" />
              <div className="h-[12px] w-[50px] bg-black/10 rounded-full" />
            </header>

            <div className="w-[80%] h-[29px] bg-black/10 rounded-md shrink-0 mb-1" />

            <div className="flex flex-col gap-2 flex-grow overflow-hidden">
              <div className="h-[14px] w-full bg-black/10 rounded-full" />
              <div className="h-[14px] w-full bg-black/10 rounded-full" />
              <div className="h-[14px] w-[90%] bg-black/10 rounded-full" />
              <div className="h-[14px] w-[95%] bg-black/10 rounded-full" />
              <div className="h-[14px] w-[70%] bg-black/10 rounded-full" />
            </div>
          </article>
        );
      })}
    </div>
  );
}
