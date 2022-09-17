export class LiveGame {
    firstPlayer: string;
    firstScore: number;
    matchType: string;
    secondPlayer: string;
    secondScore: number;
    gameId: string;
    constructor(fp: string, fs: number, mt: string, sp: string, ss: number, GI: string) {
        this.firstPlayer = fp;
        this.firstScore = fs;
        this.matchType = mt;
        this.secondPlayer = sp;
        this.secondScore = ss;
        this.gameId = GI;
    }
}