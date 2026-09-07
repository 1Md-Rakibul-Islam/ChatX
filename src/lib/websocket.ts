import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'https://frontend-task-chatapp.onrender.com';

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
