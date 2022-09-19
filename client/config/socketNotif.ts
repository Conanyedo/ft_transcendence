import { getCookie } from "cookies-next";
import { io } from "socket.io-client";

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
const socket_notif = io(`http://localhost:5000`, socketOptions);

export default socket_notif;
