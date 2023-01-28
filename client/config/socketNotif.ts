import { io } from "socket.io-client";
import { baseUrl } from "./baseURL";

const socketOptions = {
    withCredentials: true,
 };
const socket_notif = io(`${baseUrl}`, socketOptions);
export default socket_notif;
