interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, onClick, className, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition ${className || ""}`}
    >
      {children}
    </button>
  );
}
