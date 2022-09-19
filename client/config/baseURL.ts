import socket_notif from "./socketNotif";

export const baseUrl: string = 'http://localhost:5000/';

export function eraseCookie(name: string) {  
    // socket_notif.disconnect();
    document.cookie = name+'=; Max-Age=0;';
}


export const allRanks = ['Gold', 'Silver', 'bronze', 'Jalouq', 'Unranked'];