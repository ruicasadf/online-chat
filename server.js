const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const rooms = {};

io.on('connection', (socket) => {
    console.log('Пользователь подключился:', socket.id);

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);

        if (!rooms[room]) {
            rooms[room] = [];
        }

        const userExists = rooms[room].some(user => user.username === username);
        if (!userExists) {
            rooms[room].push({ id: socket.id, username });

            io.to(room).emit('userList', rooms[room].map(user => user.username));

            socket.emit('message', {
                username: 'Чат',
                text: `Добро пожаловать в комнату ${room}, ${username}!`,
                timestamp: new Date().toLocaleTimeString() // Добавляем время
            });

            socket.broadcast.to(room).emit('message', {
                username: 'Чат',
                text: `${username} присоединился к комнате!`,
                timestamp: new Date().toLocaleTimeString() // Добавляем время
            });
        } else {
            socket.emit('message', {
                username: 'Чат',
                text: `Вы уже подключены к комнате ${room}.`,
                timestamp: new Date().toLocaleTimeString() // Добавляем время
            });
        }
    });

    socket.on('sendMessage', ({ room, text }) => {
        const user = rooms[room].find(user => user.id === socket.id);
        if (user) {
            io.to(room).emit('message', {
                username: user.username,
                text,
                timestamp: new Date().toLocaleTimeString() // Добавляем время
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился:', socket.id);

        for (const room in rooms) {
            rooms[room] = rooms[room].filter(user => user.id !== socket.id);
            if (rooms[room].length === 0) {
                delete rooms[room];
                continue;
            }
            io.to(room).emit('userList', rooms[room].map(user => user.username));
        }
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
