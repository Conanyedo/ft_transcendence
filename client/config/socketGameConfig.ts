import { io } from "socket.io-client";
import { baseUrlGame } from "./baseURL";

const socketOptions = {
  withCredentials: true,
 };

const socket_game = io(`${baseUrlGame}`, socketOptions);

export default socket_game;
