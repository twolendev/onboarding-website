"use client";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import React from "react";

export const Circle = ({ className, idx, ...rest }: { className?: string; idx: number; [key: string]: unknown }) => {
  return (
    <motion.div
      {...rest}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: idx * 0.1, duration: 0.2 }}
      className={twMerge(
        "absolute inset-0 left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-neutral-200/20",
        className
      )}
    />
  );
};

export const Radar = ({ className }: { className?: string }) => {
  const circles = new Array(8).fill(1);
  return (
    <div
      className={twMerge(
        "relative flex h-20 w-20 items-center justify-center rounded-full",
        className
      )}
    >
      <style>{`
        @keyframes radar-spin {
          from { transform: rotate(20deg); }
          to   { transform: rotate(380deg); }
        }
        .animate-radar-spin {
          animation: radar-spin 10s linear infinite;
        }
      `}</style>
      {/* Rotating sweep line */}
      <div
        style={{ transformOrigin: "right center" }}
        className="animate-radar-spin absolute right-1/2 top-1/2 z-40 flex h-[5px] w-[400px] items-end justify-center overflow-hidden bg-transparent"
      >
        <div className="relative z-40 h-[1px] w-full bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      </div>
      {/* Concentric circles */}
      {circles.map((_, idx) => (
        <Circle
          style={{
            height: `${(idx + 1) * 5}rem`,
            width: `${(idx + 1) * 5}rem`,
            border: `1px solid rgba(220, 38, 38, ${1 - (idx + 1) * 0.1})`,
          }}
          key={`circle-${idx}`}
          idx={idx}
        />
      ))}
    </div>
  );
};

export const IconContainer = ({
  icon,
  text,
  delay,
  explanation,
}: {
  icon?: React.ReactNode;
  text?: string;
  delay?: number;
  explanation?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: delay ?? 0 }}
      className="relative z-50 flex flex-col items-center justify-center space-y-2 group"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-900/50 bg-neutral-900/80 shadow-inner group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="hidden rounded-md px-2 py-1 md:block">
        <div className="text-center text-xs font-bold text-neutral-300">
          {text}
        </div>
      </div>
      {/* Tooltip for Layman Explanation (Audio request) */}
      {explanation && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[60]">
          <div className="bg-neutral-900/95 border border-red-900/50 text-neutral-200 text-xs text-center p-3 rounded-lg shadow-xl backdrop-blur-md">
            {explanation}
          </div>
        </div>
      )}
    </motion.div>
  );
};
