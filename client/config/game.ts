import { gameControleType } from "../Types/dataTypes"
import { Theme } from "./gameMap"

function drawRect(
	x: number,
	y: number,
	w: number,
	h: number,
	color: string,
	ctx: CanvasRenderingContext2D,
	ispaddle: boolean
) {
	ctx.beginPath()
	if (!ispaddle) {
		ctx.fillStyle = color
		ctx.fillRect(x, y, w, h)
		ctx.shadowBlur = 0
		ctx.shadowColor = color
	} else {
		let radius = 25
		if (w < 2 * radius) radius = w / 2
		if (h < 2 * radius) radius = h / 2
		ctx.shadowBlur = radius * 1.5
		ctx.shadowColor = color
		ctx.moveTo(x + radius, y)
		ctx.arcTo(x + w, y, x + w, y + h, radius)
		ctx.arcTo(x + w, y + h, x, y + h, radius)
		ctx.arcTo(x, y + h, x, y, radius)
		ctx.arcTo(x, y, x + w, y, radius)
		ctx.fillStyle = color
		ctx.fill()
	}
	ctx.closePath()
}
function drawCircle(x: number, y: number, r: number, color: string, ctx: CanvasRenderingContext2D) {
	ctx.beginPath()
	ctx.fillStyle = color
	// ctx.shadowBlur = r * 1.5
	// ctx.shadowColor = color
	ctx.arc(x, y, r, 0, Math.PI * 2, false)
	ctx.fill()
	ctx.closePath()
}

function drawNet(data: gameControleType, ctx: CanvasRenderingContext2D, lineColor: string) {
	for (let i = 0; i <= data.canvasHieght; i += 15) {
		drawRect(data.canvasWidth / 2 - 2.5, i, 5, 10, lineColor, ctx, false)
	}
}

export function render(data: gameControleType, canvas: any, theme: Theme) {
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
	drawRect(0, 0, data.canvasWidth, data.canvasHieght, theme.backgroundColor, ctx, false)
	drawRect(0, data.paddleLeft.paddleY, data.widthPaddle, data.HieghtPaddle, theme.leftPaddleColor, ctx, true)
	drawRect(
		data.canvasWidth - data.widthPaddle,
		data.paddleRight.paddleY,
		data.widthPaddle,
		data.HieghtPaddle,
		theme.rightPaddleColor,
		ctx,
		true
	)
	drawNet(data, ctx, theme.lineColor)
	drawCircle(data.ball.ballX, data.ball.ballY, data.ballRadius, theme.ballColor, ctx)
}
