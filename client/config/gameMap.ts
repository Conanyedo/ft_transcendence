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

export const ThemeDarkMode = new Theme("black", "white", "white", "white", "white", 'white');
export const ThemeSky = new Theme("#FDF4E3", "#C7B446", "#354D73", "#354D73", "#8E402A", '#C7B446');