import { useEffect, useRef } from "react";
const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  const ref = useRef();
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.addEventListener("keydown", esc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
  };
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl w-full ${sizes[size]} animate-slide-up`}
      >
        {children}
      </div>
    </div>
  );
};
export default Modal;
