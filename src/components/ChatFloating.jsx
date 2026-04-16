import { useState } from "react";
import ChatWidget from "./ChatWidget";
import "./ChatFloating.css";

function ChatFloating() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button className="chat-float-button" onClick={() => setIsOpen(true)}>
          <span className="chat-float-icon">🌙</span>
          <span className="chat-float-text">Habla con Lumi</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-overlay">
          <div className="chat-container">
            <div className="chat-header">
              <span>Lumi 🌙</span>
              <button type="button" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="chat-body">
              <ChatWidget />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatFloating;