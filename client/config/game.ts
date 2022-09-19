import { gameControleType, GameDataType } from "../Types/dataTypes";
import { Theme } from "./gameMap";

function drawRect(x: number, y: number, w: number, h: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}
function drawCircle(x: number, y: number, r: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

function drawText(text: any, x: number, y: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.fillStyle = color;
	ctx.font = "5rem fantasy";
	ctx.fillText(text, x, y);
}

function drawNet(data: gameControleType, ctx: CanvasRenderingContext2D, lineColor: string) {
	for (let i = 0; i <= data.canvasHieght; i += 15) {
		drawRect(data.canvasWidth / 2 - 2.5, i, 5, 10, lineColor, ctx);
	}
}

export function render(data: gameControleType, canvas: any, theme: Theme) {
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	drawRect(0, 0, data.canvasWidth, data.canvasHieght, theme.backgroundColor, ctx);

	drawNet(data, ctx, theme.lineColor);

	drawRect(
		0,
		data.paddleLeft.paddleY,
		data.widthPaddle,
		data.HieghtPaddle,
		theme.leftPaddleColor,
		ctx
	);
	drawRect(
		data.canvasWidth - data.widthPaddle,
		data.paddleRight.paddleY,
		data.widthPaddle,
		data.HieghtPaddle,
		theme.rightPaddleColor,
		ctx
	);

	drawCircle(
		data.ball.ballX,
		data.ball.ballY,
		data.ballRadius,
		theme.ballColor,
		ctx
	);
}