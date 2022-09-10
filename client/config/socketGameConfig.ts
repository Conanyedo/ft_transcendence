import { getCookie } from "cookies-next";
import { io } from "socket.io-client";

const token = getCookie("jwt");

const socket_game = io(`http://localhost:5551`, { query: { jwt: token } });

export default socket_game;
