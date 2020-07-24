const WIDTH = 300;
const HEIGHT = 300;
const w = WIDTH / 3;
const h = HEIGHT / 3;
let board = [];
let virtualBoard = [];
let turn; // 'x' | 'o'
let last;
let ended;
const interactiveBounds = {
	x: WIDTH,
	y: HEIGHT,
};
let boards = [
	{ x: 0, y: 0 },
	{ x: 0, y: HEIGHT },
	{ x: 0, y: 2 * HEIGHT },
	{ x: WIDTH, y: 0 },
	{ x: WIDTH, y: HEIGHT },
	{ x: WIDTH, y: 2 * HEIGHT },
	{ x: WIDTH * 2, y: 0 },
	{ x: WIDTH * 2, y: HEIGHT },
	{ x: WIDTH * 2, y: 2 * HEIGHT },
];

function setup() {
	createCanvas(WIDTH * 3 + 50, HEIGHT * 3 + 50);
	for (let i = 0; i < 3; i++) board.push(new Array(3));
	for (let i = 0; i < 9; i++) virtualBoard.push(new Array(9));
	turn = "x";
}

function draw() {
	if (ended) return;
	// Draw board lines
	for (let board of boards) {
		drawBoard(board.x, board.y);
	}

	if (last) {
		const [r, c] = last;
		if (!board[r][c]) {
			for (let board of boards) {
				drawSymbol(turn, ...last, board);
			}
			board[r][c] = turn;
			updateVirtualBoard();
			console.log(virtualBoard);
			turn = turn == "x" ? "o" : "x";
		}
		last = null;
		check();
	}
}

function updateVirtualBoard() {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			for (let m = 0; m < 3; m++) {
				for (let n = 0; n < 3; n++) {
					virtualBoard[i + m * 3][j + n * 3] = board[i][j];
				}
			}
		}
	}
}

function mouseClicked(e) {
	const { x, y } = interactiveBounds;
	translate(0, 0);
	if (mouseX < x || mouseX > WIDTH + x || mouseY < y || mouseY > HEIGHT + y)
		return;
	const cIndex = Math.floor((mouseX - x) / (WIDTH / 3));
	const rIndex = Math.floor((mouseY - y) / (HEIGHT / 3));
	last = [rIndex, cIndex];
}

function drawBoard(x, y) {
	for (let i = 1; i <= 2; i++) {
		stroke(0, 255, 0);
		line(x + 10, y + h * i, x + WIDTH - 10, y + h * i);
		line(x + w * i, y + 10, x + w * i, y + HEIGHT - 10);
	}
}

function drawSymbol(sym, r, c, bounds) {
	const pad = 10;
	const { x, y } = bounds;
	if (sym == "x") {
		line(
			x + c * w + pad,
			y + r * h + pad,
			x + (c + 1) * w - pad,
			y + (r + 1) * h - pad
		);
		line(
			x + c * w + pad,
			y + (r + 1) * h - pad,
			x + (c + 1) * w - pad,
			y + r * h + pad
		);
	} else if (sym == "o") {
		ellipseMode(CORNER);
		ellipse(x + c * w + pad, y + r * h + pad, w - 2 * pad, h - 2 * pad);
	}
}

const checkLines = (lines) => {
	for (let line of lines) {
		if (line.includes(undefined)) continue;
		const result = line.reduce(
			(acc, curr) => (acc += curr == "x" ? 1 : 0),
			0
		);
		if (result == 3) ended = "x";
		else if (result == 0) ended = "o";
	}
};

function check() {
	let cols = [];
	for (idx in board) {
		const col = board.flatMap((r) => r[idx]);
		cols.push(col);
	}
	const diags = [];
	// Main board first cell is at (3, 3)
	for (let i = 3; i < 6; i++) {
		for (let j = 3; j < 6; j++) {
			diags.push([
				virtualBoard[i + 1][j + 1],
				virtualBoard[i][j],
				virtualBoard[i - 1][j - 1],
			]);
			diags.push([
				virtualBoard[i + 1][j - 1],
				virtualBoard[i][j],
				virtualBoard[i - 1][j + 1],
			]);
		}
	}

	checkLines(board);
	checkLines(cols);
	checkLines(diags);
}
