import { io } from "socket.io-client";

// iniciar un socket sin autoconectar
export const socket = io("https://cdaweb-backend.onrender.com/", {
  autoConnect: true,
});
