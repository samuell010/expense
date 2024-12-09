import React, { useCallback, useRef, ReactNode, useState } from "react";
import { FiXSquare } from "react-icons/fi";

interface ModalProps {
  children: ReactNode;
  onClose: () => void; // Function to handle closing the modal
}

export default function PdfModal({ children, onClose }: ModalProps) {
  const [isVisible, setIsVisible] = useState(true); // State to manage modal visibility
  const overlay = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlay.current) {
        setIsVisible(false); // Hide the modal
        onClose(); // Call the onClose function passed as a prop
      }
    },
    [onClose],
  );

  // If the modal is not visible, return null
  if (!isVisible) return null;

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal"
      onClick={(e) => handleClick(e)}
    >
      <div
        ref={wrapper}
        className="relative w-3/4 p-2 bg-white rounded-lg modal_wrapper dark:bg-blue-dark-900"
      >
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="absolute right-2 top-2"
        >
          {/* <img src="/close.svg" width={17} height={17} alt="close" /> */}
          <FiXSquare size={24} />
        </button>

        {children}
      </div>
    </div>
  );
}
