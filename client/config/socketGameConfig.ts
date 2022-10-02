import { getCookie } from "cookies-next";
import { io } from "socket.io-client";
import { baseUrlGame } from "./baseURL";

const token = getCookie("jwt");
const socketOptions = {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        }
      }
    }
 };

const socket_game = io(`${baseUrlGame}`, socketOptions);

export default socket_game;
