export const gameMap = () => {
	// Select Canvas
	const canvas = document.querySelector("#pong") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

	// Game Variables ==================
	const COM_LEVEL = 0.2;
	const PLAYER_HEIGHT = 100;
	const PLAYER_WIDTH = 20;
	const BALL_START_SPEED = 0.5;
	const BALL_DELTA_SPEED = 0.1;

	// Game Objects ======================
	const player = {
		x: 0,
		y: canvas.height / 2 - PLAYER_HEIGHT / 2,
		width: PLAYER_WIDTH,
		height: PLAYER_HEIGHT,
		color: "#3AB0FF",
		score: 0,
	};

	const computer = {
		x: canvas.width - PLAYER_WIDTH,
		y: canvas.height / 2 - PLAYER_HEIGHT / 2,
		width: PLAYER_WIDTH,
		height: PLAYER_HEIGHT,
		color: "#FF1E00",
		score: 0,
	};

	const ball = {
		x: canvas.width / 2,
		y: canvas.height / 2,
		radius: 10,
		speed: BALL_START_SPEED,
		velocityX: 5,
		velocityY: 5,
		color: "#3AB0FF",
	};

	const net = {
		x: canvas.width / 2 - 1,
		y: 0,
		width: 2,
		height: 10,
		color: "#59CE8F",
	};

	// Draw Shapes & Text Functions ==============
	function drawRect(x: any, y: any, w: any, h: any, color: any) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}
	// drawRect(0, 0, canvas.width, canvas.height, "BLACK");

	function drawCircle(x: any, y: any, r: any, color: any) { 
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
	}
	// drawCircle(100, 100, 50, "WHITE");

	function drawText(text: any, x: any, y: any, color: any) {
		ctx.fillStyle = color;
		ctx.font = "45px fantasy";
		ctx.fillText(text, x, y);
	}
	// drawText("Korsat X Parmaga", 200, 300, "WHITE");

	function drawNet() {
		for (let i = 0; i <= canvas.height; i += 15) {
			drawRect(net.x, net.y + i, net.width, net.height, net.color);
		}
	}

	// Redraw Canvas =================
	function render() {
		// Clear the Canvas
		drawRect(0, 0, canvas.width, canvas.height, "#E8F9FD");

		// Draw the net
		drawNet();

		// Draw Score
		drawText(
			player.score,
			canvas.width / 4.5,
			canvas.height / 5,
			"#59CE8F"
		);
		drawText(
			computer.score,
			(3 * canvas.width) / 4,
			canvas.height / 5,
			"#59CE8F"
		);

		// Draw the player & computer
		drawRect(player.x, player.y, player.width, player.height, player.color);
		drawRect(
			computer.x,
			computer.y,
			computer.width,
			computer.height,
			computer.color
		);

		// Draw the ball
		drawCircle(ball.x, ball.y, ball.radius, ball.color);
	}

	// Check Collisions
	function collision(b: any, p: any) {
		b.top = b.y - b.radius;
		b.bottom = b.y + b.radius;
		b.left = b.x - b.radius;
		b.right = b.x + b.radius;

		p.top = p.y;
		p.bottom = p.y + p.height;
		p.left = p.x;
		p.right = p.x + p.width;

		return (
			b.right > p.left &&
			b.bottom > p.top &&
			b.left < p.right &&
			b.top < p.bottom
		);
	}

	// Reset Ball
	function resetBall() {
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.speed = BALL_START_SPEED;
		ball.velocityX = -ball.velocityX;
	}

	// Player Movement
	canvas.addEventListener("mousemove", (e) => {
		if (paused) return;

		let rect = canvas.getBoundingClientRect();

		player.y = e.clientY - rect.top - player.height / 2;
	});

	function lerp(a: any, b: any, t: any) {
		return a + (b - a) * t; // t=0 (a) , t=1 (b)
	}

	// Update : pos, mov, score, .... ==========
	let paused = false;
	function update() {
		if (paused) return;

		// ball movement
		ball.x += ball.velocityX * ball.speed;
		ball.y += ball.velocityY * ball.speed;

		// ball collision with Top & Bottom borders
		if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
			ball.velocityY = -ball.velocityY;
		}

		// ball collision with players
		// Which player??
		let selectedPlayer = ball.x < canvas.width / 2 ? player : computer;
		if (collision(ball, selectedPlayer)) {
			ball.velocityX = -ball.velocityX;

			// every time ball hits a player, we increase its speed
			ball.speed += BALL_DELTA_SPEED;
		}

		// Computer Movement (simple AI)
		let targetPos = ball.y - computer.height / 2;
		let currentPos = computer.y;
		computer.y = lerp(currentPos, targetPos, COM_LEVEL);

		// Update Score
		if (ball.x - ball.radius < 0) {
			// increase computer score
			computer.score++;
			resetBall();
		} else if (ball.x + ball.radius > canvas.width) {
			// increase player score
			player.score++;
			resetBall();
		}
	}

	// Game Init =====================
	function game() {
		update();
		render();
	}

	// loop
	const FPS = 60;
	setInterval(game, 1000 / FPS);

	const pauseBtn = document.querySelector("#pause") as Element;
	pauseBtn.addEventListener("click", () => {
		if (pauseBtn.innerHTML === "Resume") {
			pauseBtn.innerHTML = "Pause";
			paused = false;
		} else {
			pauseBtn.innerHTML = "Resume";
			paused = true;
		}
	});
};
