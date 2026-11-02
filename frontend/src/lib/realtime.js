import { apiBaseUrl } from '../services/axiosInstance';

/**
 * One socket.io connection per signed-in tab, to the API's own address (VITE_API_URL without /api).
 * socket.io-client is loaded only once someone is signed in, so it never weighs on the login page.
 * It reconnects by itself after sleep or a dropped network.
 */
let socket = null;
let currentToken = null;

const serverUrl = () => apiBaseUrl.replace(/\/api\/?$/, '');

export const connectRealtime = async (token) => {
  if (socket && currentToken === token) return socket;
  disconnectRealtime();
  currentToken = token;
  const { io } = await import('socket.io-client');
  if (currentToken !== token) return null; // signed out (or in as someone else) while loading
  socket = io(serverUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnectionDelay: 1000,
    reconnectionDelayMax: 15000,
  });
  return socket;
};

export const disconnectRealtime = () => {
  currentToken = null;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
