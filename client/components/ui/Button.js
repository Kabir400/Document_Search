"use client";

import React from "react";

const Button = ({ children, onClick, type = "button", disabled = false, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full overflow-hidden rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300
        hover:bg-zinc-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50
        active:scale-[0.98] 
        dark:bg-white dark:text-black dark:hover:bg-zinc-200
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
