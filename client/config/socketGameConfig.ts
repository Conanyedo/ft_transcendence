import { getCookie } from "cookies-next";
import { io } from "socket.io-client";
import { baseUrlGame } from "./baseURL";

const token = getCookie("jwt");

const socket_game = io(`${baseUrlGame}`, { query: { jwt: token } });

export default socket_game;
