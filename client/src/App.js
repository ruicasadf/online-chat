import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Join from './components/Join';
import Chat from './components/Chat';
import './App.css';

const ENDPOINT = 'http://localhost:5000';

function App() {
   const [username, setUsername] = useState('');
   const [room, setRoom] = useState('');
   const [socket, setSocket] = useState(null);

   useEffect(() => {
       const newSocket = socketIOClient(ENDPOINT);
       setSocket(newSocket);

       return () => {
           newSocket.disconnect();
       };
   }, []);

   const joinRoom = ({ username, room }) => {
       if (socket) {
           socket.emit('joinRoom', { username, room });
       }
   };

   return (
       <div className="app-container">
           {username && room && socket ? (
               <Chat socket={socket} username={username} room={room} />
           ) : (
               <Join setUsername={setUsername} setRoom={setRoom} joinRoom={joinRoom} />
           )}
       </div>
   );
}

export default App;

