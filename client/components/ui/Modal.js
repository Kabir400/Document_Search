"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Card from "./Card";

const Modal = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all text-left">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="z-10 w-full max-w-md px-4">
        <Card className="animate-in fade-in zoom-in-95 duration-200">
            {title && (
                <div className="mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {title}
                    </h3>
                </div>
            )}
          {children}
        </Card>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
