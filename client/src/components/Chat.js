import React, { useState, useEffect, useRef } from 'react';
import './Chat.css'; // Подключаем CSS

const Chat = ({ socket, username, room }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [userList, setUserList] = useState([]);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const messageListener = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on('message', messageListener);
        socket.on('userList', (users) => {
            setUserList(users);
        });

        return () => {
            socket.off('message', messageListener);
            socket.off('userList');
        };
    }, [socket]);

    useEffect(() => {
        // Прокрутка вниз при добавлении нового сообщения
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('sendMessage', { room, text: message });
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Чат: {room}</h2>
            </div>
            <div className="user-list">
                <h3>Пользователи:</h3>
                <ul>
                    {userList.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))}
                </ul>
            </div>
            <div className="message-container" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.username === username ? 'message-right' : 'message-left'}`}
                    >
                        <div className="message-content">
                            <div className="message-header">
                                <strong>{msg.username}:</strong>
                                <span className="message-timestamp">{msg.timestamp}</span>
                            </div>
                            <div className="message-text">{msg.text}</div>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                />
                <button type="submit">Отправить</button>
            </form>
        </div>
    );
};

export default Chat;
