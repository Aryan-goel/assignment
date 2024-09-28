import { AIAssistant } from "~features/AIbutton";
import "~style.css";

// Popup component
function IndexPopup() {
  return (
    <div className="w-96 h-96 p-4">
      <AIAssistant />
    </div>
  );
}

export default IndexPopup;
