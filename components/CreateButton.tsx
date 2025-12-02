"use client";

import Button from "./Button";

interface CreateButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string; // ✅ add this
}

export default function CreateButton({ onClick, label = "Create", className }: CreateButtonProps) {
  return (
    <Button onClick={onClick} className={`bg-green-500 hover:bg-green-600 ${className || ""}`}>
      {label}
    </Button>
  );
}
