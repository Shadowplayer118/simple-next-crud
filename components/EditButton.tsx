"use client";

import Button from "./Button";

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
}

export default function EditButton({ onClick, label = "Edit" }: EditButtonProps) {
  return <Button onClick={onClick} className="bg-yellow-500 hover:bg-yellow-600">{label}</Button>;
}
