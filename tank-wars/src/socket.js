import { io } from "socket.io-client";

// iniciar un socket sin autoconectar
export const socket = io("http://localhost:3000", {
  autoConnect: true,
});
