import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import { useState, useEffect, useRef } from "react";
import { AIAssistant } from "~features/AIbutton";
import icon1 from "src/icon1.png";


// Configuration for Plasmo Content Script
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
};

// Get styles for the extension
export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

// Main overlay component
const PlasmoOverlay = () => {
  const [showIcon, setShowIcon] = useState(false);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle focus and blur events to show/hide the AI icon
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === "msg-form__contenteditable" || target.classList.contains("msg-form__contenteditable")) {
        const rect = target.getBoundingClientRect();
        setIconPosition({
          top: rect.bottom - 40,
          left: rect.right - 40
        });
        setShowIcon(true);
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.id === "msg-form__contenteditable" || target.classList.contains("msg-form__contenteditable")) {
        setShowIcon(false);
      }
    };

    document.addEventListener("focus", handleFocus, true);
    document.addEventListener("blur", handleBlur, true);

    return () => {
      document.removeEventListener("focus", handleFocus, true);
      document.removeEventListener("blur", handleBlur, true);
    };
  }, []);

  // Handle clicks outside the popup to close it
  const handleClickOutside = (e: React.MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setShowPopup(false);
    }
  };

  // Handle icon click to open the popup
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click event from propagating to the document
    setShowPopup(true);
  };

  // Get the appropriate icon based on whether the popup is shown
  const iconSrc = icon1;

  return (
    <>
      {showIcon && (
        <div
          style={{
            position: 'fixed',
            top: `${iconPosition.top}px`,
            left: `${iconPosition.left}px`,
            zIndex: 9999
          }}
        >
          <button
            onMouseDown={(e) => e.preventDefault()} // Prevent blur on mousedown
            onClick={handleIconClick}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundImage: `url(${iconSrc})`,
              backgroundSize: 'cover',
              backgroundColor: 'white',
              border: '2px solid #ccc', // optional border
              padding: '5px'
            }}
          >
          </button>
        </div>
      )}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClickOutside}
        >
          <div ref={popupRef} onClick={(e) => e.stopPropagation()}>
            <AIAssistant onClose={() => setShowPopup(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default PlasmoOverlay;
