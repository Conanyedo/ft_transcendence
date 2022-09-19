import { getCookie } from "cookies-next";
import { io } from "socket.io-client";
import { baseUrl } from "./baseURL";

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
const socket_notif = io(`${baseUrl}`, socketOptions);
export default socket_notif;
