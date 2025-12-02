"use client";

import Button from "./Button";

interface DeleteButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string; // ✅ add this
}

export default function DeleteButton({ onClick, label = "Delete", className }: DeleteButtonProps) {
  return (
    <Button onClick={onClick} className={`bg-red-500 hover:bg-red-600 ${className || ""}`}>
      {label}
    </Button>
  );
}
