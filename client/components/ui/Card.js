"use client";

import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-xl transition-all
        dark:bg-zinc-900/80 dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/10
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
