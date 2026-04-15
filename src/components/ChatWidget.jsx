import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./ChatWidget.css";

function ChatWidget() {
    const [input, setInput] = useState("");
    const [previousResponseId, setPreviousResponseId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [chatMemory, setChatMemory] = useState({
        mood: "",
        preferredGenres: [],
        dislikedGenres: [],
        shortReplies: false,
    });

    const greetings = [
        "Holi ✨ soy Lumi, tu asistente virtual de lectura. ¿Buscamos tu próxima obsesión o vienes a cotillear libros conmigo? 😏📖",
        "Holi ✨ soy Lumi, tu asistente virtual. Dime tu mood y te encuentro la historia perfecta 📖",
        "Holi ✨ soy Lumi. ¿Romance, drama o algo que te deje pensando toda la noche? 👀📖",
        "Holi ✨ soy Lumi, tu asistente virtual en Readify. Libros, moods y tés… dime qué necesitas ✨📖",
    ];

    const randomGreeting =
        greetings[Math.floor(Math.random() * greetings.length)];

    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const storedToken = localStorage.getItem("authToken");

                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/chat/history`,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    }
                );

                if (response.data.chatHistory?.length > 0) {
                    setMessages(response.data.chatHistory);
                } else {
                    setMessages([
                        {
                            role: "assistant",
                            content: randomGreeting,
                        },
                    ]);
                }

                if (response.data.chatMemory) {
                    setChatMemory(response.data.chatMemory);
                }
            } catch (error) {
                console.error("Error al cargar historial del chat:", error);

                setMessages([
                    {
                        role: "assistant",
                        content: randomGreeting,
                    },
                ]);
            }
        };

        fetchChatHistory();
    }, []);

    const handleSendMessageWithText = async (text) => {
        const trimmedInput = text.trim();
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
                `${import.meta.env.VITE_API_URL}/api/chat`,
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

            if (response.data.updatedMemory) {
                setChatMemory(response.data.updatedMemory);
            }

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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        handleSendMessageWithText(input);
    };

    const quickSuggestions = [
        "¿Qué leo hoy?",
        "Recomiéndame algo cozy",
        "Recomiéndame un libro",
        "¿Qué tengo pendiente?",
    ];

    const handleQuickSuggestion = async (suggestion) => {
        if (isLoading) return;

        setInput(suggestion);

        setTimeout(() => {
            handleSendMessageWithText(suggestion);
        }, 0);
    };

    return (
        <section className="chat-widget">
            <div className="chat-widget-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-bubble ${
                            message.role === "user"
                                ? "chat-bubble-user"
                                : "chat-bubble-assistant"
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
                        <p>Lumi está escribiendo... 🌙</p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-quick-suggestions">
                {quickSuggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        className="chat-suggestion-chip"
                        onClick={() => handleQuickSuggestion(suggestion)}
                        disabled={isLoading}
                    >
                        {suggestion}
                    </button>
                ))}
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