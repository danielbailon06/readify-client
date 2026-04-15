import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./ChatWidget.css";

function ChatWidget() {
    const [input, setInput] = useState("");
    const [previousResponseId, setPreviousResponseId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const greetings = [
        "Holi ✨ soy Lumi, tu asistente virtual de lectura. ¿Buscamos tu próxima obsesión o vienes a cotillear libros conmigo? 😏📖",
        "Holi ✨ soy Lumi, tu asistente virtual. Dime tu mood y te encuentro la historia perfecta 📖",
        "Holi ✨ soy Lumi. ¿Romance, drama o algo que te deje pensando toda la noche? 👀📖",
        "Holi ✨ soy Lumi, tu asistente virtual en Readify. Libros, moods y tés… dime qué necesitas ✨📖",
    ];

    const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: randomGreeting,
        },
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);



    const handleSendMessage = async (e) => {
        e.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage = {
            role: "user",
            content: trimmedInput,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const storedToken = localStorage.getItem("authToken");

            const response = await axios.post(
                "http://localhost:5005/api/chat",
                {
                    message: trimmedInput,
                    previousResponseId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                }
            );

            const assistantMessage = {
                role: "assistant",
                content: response.data.reply || "Ups… no he sabido qué decir 😅",
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setPreviousResponseId(response.data.responseId || null);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Ups, ha habido un problema al responder. Inténtalo otra vez en un momento.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="chat-widget">
            <div className="chat-widget-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-bubble ${message.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"
                            }`}
                    >
                        <span className="chat-bubble-role">
                            {message.role === "user" ? "Tú" : "Lumi"}
                        </span>
                        <p>{message.content}</p>
                    </div>
                ))}

                {isLoading && (
                    <div className="chat-bubble chat-bubble-assistant">
                        <span className="chat-bubble-role">Lumi</span>
                        <p>Escribiendo...</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-widget-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Escribe algo..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    Enviar
                </button>
            </form>
            
        </section>
    );
}

export default ChatWidget;