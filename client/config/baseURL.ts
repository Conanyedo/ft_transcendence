export const baseUrl: string = 'http://localhost:5000/';

export function eraseCookie(name: string) {   
    document.cookie = name+'=; Max-Age=0;';
}


export const allRanks = ['Gold', 'Silver', 'bronze', 'Jalouq', 'Unranked'];