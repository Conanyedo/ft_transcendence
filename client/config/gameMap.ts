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
        this.lineColor = TC;
    }
}