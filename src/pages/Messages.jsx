import { useEffect, useState } from "react";
import api from "../services/api";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const response = await api.get("/messages");
            setMessages(response.data);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRead = async (message) => {
        try {
            await api.put(`/messages/${message.id}`, {
                ...message,
                isRead: !message.isRead
            });

            loadMessages();
        } catch (error) {
            console.error("Error updating message:", error);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;

        try {
            await api.delete(`/messages/${id}`);
            loadMessages();
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <div className="cms-page">

            <div className="page-heading">
                <div>
                    <span className="card-label">INBOX</span>
                    <h2>Messages</h2>
                    <p>Messages received from your portfolio contact form.</p>
                </div>

                <div className="page-count">
                    {messages.length} Messages
                </div>
            </div>

            {loading ? (
                <div className="empty-state">
                    Loading messages...
                </div>
            ) : messages.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✉</div>
                    <h3>No messages yet</h3>
                    <p>Messages submitted through your portfolio will appear here.</p>
                </div>
            ) : (
                <div className="messages-list">

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-card ${
                                message.isRead ? "read" : "unread"
                            }`}
                        >

                            <div className="message-top">

                                <div>
                                    <h3>{message.subject || "No subject"}</h3>

                                    <div className="message-sender">
                                        <strong>{message.name}</strong>
                                        <span>{message.email}</span>
                                    </div>
                                </div>

                                <span className="message-status">
                                    {message.isRead ? "Read" : "Unread"}
                                </span>

                            </div>

                            <p className="message-content">
                                {message.message}
                            </p>

                            <div className="message-bottom">

                                <span className="message-date">
                                    {message.createdAt
                                        ? new Date(message.createdAt).toLocaleString()
                                        : ""}
                                </span>

                                <div className="message-actions">

                                    <button
                                        className="secondary-button"
                                        onClick={() => toggleRead(message)}
                                    >
                                        {message.isRead
                                            ? "Mark Unread"
                                            : "Mark Read"}
                                    </button>

                                    <button
                                        className="danger-button"
                                        onClick={() => deleteMessage(message.id)}
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Messages;