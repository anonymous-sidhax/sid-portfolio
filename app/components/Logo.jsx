"use client";

import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-foreground/10 transition-colors duration-300 group-hover:border-accent/50">
      <Image
        src="/logo.jpg"
        alt="Siddesh Logo"
        fill
        sizes="40px"
        className="object-cover"
      />
    </div>
  );
}