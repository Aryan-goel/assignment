import { useState, useRef } from "react";

// AI Assistant Component
export const AIAssistant = ({ onClose = () => {} }) => {
  // State management
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Generate response handler
  const handleGenerate = () => {
    if (!isGenerated) {
      setGeneratedText("Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.");
      setIsGenerated(true);
      setUserInput(inputText);
      setInputText("");
    }
  };

  // Insert response into the LinkedIn message input field
  const handleInsert = () => {
    try {
      const inputField = document.querySelector("#msg-form__contenteditable, .msg-form__contenteditable");
      const placeholder = document.querySelector(".msg-form__placeholder");
      if (inputField) {
        (inputField as HTMLElement).innerText = generatedText;

        if (placeholder) {
          placeholder.remove();
        }

        // Trigger input event to update LinkedIn's internal state
        const event = new Event('input', { bubbles: true });
        inputField.dispatchEvent(event);

        // Close the assistant popup
        onClose();

        // Dispatch change event to ensure send button is enabled
        const changeEvent = new Event('input', { bubbles: true });
        inputField.dispatchEvent(changeEvent);
      }
    } catch (error) {
      console.error("Error inserting text into input field:", error);
    }
  };

  // Render the assistant content
  const renderContent = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg text-xl" style={{ width: '450px', maxWidth: '90vw', marginLeft: '390px' }}>
      {isGenerated && (
        <>
          <div className="flex justify-end mb-4">
            <div className="p-3 text-gray-500 bg-gray-100 rounded-lg" style={{ maxWidth: '80%' }}>
              {userInput}
            </div>
          </div>
          <div className="flex justify-start mb-4">
            <div className="p-3 text-gray-500 bg-blue-100 rounded-lg" style={{ maxWidth: '70%' }}>
              {generatedText}
            </div>
          </div>
        </>
      )}
      <div className="mb-4">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-3 border rounded-lg text-lg"
          placeholder="Your prompt"
        />
      </div>
      <div className="flex justify-end">
        {!isGenerated ? (
          <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg flex items-center"
          >
            <span className="ml-2" style={{ fontSize: '1.2em', marginRight: '8px' }}>&#10148;</span> Generate 
          </button>
        ) : (
          <div className="flex">
            <button
              onClick={handleInsert}
              className="border border-gray-500 text-gray-500 px-6 py-3 rounded-lg mr-3 text-xl flex items-center font-semibold"
            >
              <span className="ml-2" style={{ fontSize: '1.2em', marginRight: '8px' }}>&#8595;</span> Insert 
            </button>
            <button
              onClick={() => {}}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl flex items-center cursor-not-allowed"
            >
              <span className="ml-2" style={{ fontSize: '1.2em', marginRight: '8px' }}>&#8635;</span> Regenerate 
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return renderContent();
};
