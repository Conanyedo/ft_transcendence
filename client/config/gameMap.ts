export class Theme {
    backgroundColor: string;
    leftPaddleColor: string;
    rightPaddleColor: string;
    ballColor: string;
    lineColor: string;
    textColor: string;
    constructor(BC: string, LC: string, LPC: string, RPC: string, BaC: string, TC: string) {
        this.backgroundColor = BC;
        this.leftPaddleColor = LPC;
        this.rightPaddleColor = RPC;
        this.ballColor = BaC;
        this.textColor = TC;
        this.lineColor = LC;
    }
}

export const ThemeSky = new Theme("#FDF4E3", "#C7B446", "#354D73", "#354D73", "#8E402A", '#C7B446');

export const allBlue = new Theme("#22354A", "#E0F0FF", "#63ADF2", "#63ADF2", "#D5E6F5", '#C7B446');
export const DarkMode = new Theme("black", "white", "white", "white", "white", 'white');
export const Rank = new Theme("#333333", "white", "#95B8D1", "#EDAFB8", "white", '#C7B446');
export const allTheme = [Rank, DarkMode, ThemeSky, allBlue];