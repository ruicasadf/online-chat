import React, { useState } from 'react';
import './Join.css';

const Join = ({ setUsername, setRoom, joinRoom }) => {
    const [name, setName] = useState('');
    const [roomName, setRoomName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setUsername(name);
        setRoom(roomName);
        joinRoom({ username: name, room: roomName });
    };

    return (
        <div className="join-container">
            <h2>Войти в чат</h2>
            <form onSubmit={handleSubmit} className="join-form">
                <div className="form-group">
                    <label htmlFor="name">Имя:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="room">Комната:</label>
                    <input
                        type="text"
                        id="room"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default Join;
