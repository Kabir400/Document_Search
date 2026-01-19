"use client";

import React from "react";

const Input = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  required = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="
          w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-3 text-sm text-zinc-900 transition-all duration-200
          placeholder:text-zinc-400
          focus:border-black focus:outline-none focus:ring-1 focus:ring-black
          dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white
        "
      />
    </div>
  );
};

export default Input;
