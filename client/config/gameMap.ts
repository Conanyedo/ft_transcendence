export class Theme {
    backgroundColor: string;
    leftPaddleColor: string;
    rightPaddleColor: string;
    ballColor: string;
    lineColor: string;
    constructor(BC: string, LC: string, LPC: string, RPC: string, BaC: string) {
        this.backgroundColor = BC;
        this.leftPaddleColor = LPC;
        this.rightPaddleColor = RPC;
        this.ballColor = BaC;
        this.lineColor = LC;
    }
}

export const ThemeSky = new Theme("#0C1E3E", "#EBFEFA", "#FC0FF5", "#8E52F5", "#38FBDB");
export const allBlue = new Theme("#22354A", "#E0F0FF", "#63ADF2", "#63ADF2", "#D5E6F5");
export const DarkMode = new Theme("black", "white", "white", "white", "white");
export const Rank = new Theme("#333333", "white", "#95B8D1", "#EDAFB8", "white");
export const allTheme = [Rank, DarkMode, allBlue, ThemeSky];