import { GameDataType } from "../Types/dataTypes";
import { Theme } from "./gameMap";

function drawRect(x: any, y: any, w: any, h: any, color: any, ctx: any) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}
function drawCircle(x: any, y: any, r: any, color: any, ctx: any) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

function drawText(text: any, x: any, y: any, color: any, ctx: any) {
	ctx.fillStyle = color;
	ctx.font = "5rem fantasy";
	ctx.fillText(text, x, y);
}

function drawNet(data: GameDataType, ctx: any, lineColor: string) {
	for (let i = 0; i <= data.canvasHieght; i += 15) {
		drawRect(data.canvasWidth / 2 - 2.5, i, 5, 10, lineColor, ctx);
	}
}

export function render(data: GameDataType, canvas: any, theme: Theme) {
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	drawRect(0, 0, canvas.width, canvas.height, theme.backgroundColor, ctx);

	drawNet(data, ctx, theme.lineColor);

	drawText(
		data.myScore,
		canvas.width / 4.5,
		canvas.height / 5,
		theme.textColor,
		ctx
	);
	drawText(
		data.otherScore,
		(3 * canvas.width) / 4,
		canvas.height / 5,
		theme.textColor,
		ctx
	);

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