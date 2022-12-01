import { useMemo } from 'react';

export const useWebSocket = (
) => useMemo(() => {
  const socket = new WebSocket('ws://localhost:3001/api/liveMessages');
  socket.onclose = () => {
    socket.send(JSON.stringify({ event: 'disconnect' }));
  };
  socket.onopen = () => {
    socket.send(JSON.stringify({ event: 'connect', username: sessionStorage.getItem('id') }));
  };
  socket.onerror = () => {
  };
  return socket;
}, []);
