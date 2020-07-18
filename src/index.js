const WIDTH = 500;
const HEIGHT = 500;
const w = WIDTH / 3;
const h = HEIGHT / 3;
let board = [];
let turn; // 'x' | 'o'
let last;
let ended;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	for (let i = 0; i < 3; i++) board.push(new Array(3));
	turn = "x";
}

function draw() {
	if (ended) return;
	// Draw board lines
	for (let i = 1; i <= 2; i++) {
		stroke(0, 255, 0);
		line(0, h * i, WIDTH, h * i);
		line(w * i, 0, w * i, HEIGHT);
	}

	if (last) {
		const [r, c] = last;
		if (!board[r][c]) {
			drawSymbol(turn, ...last);
			board[r][c] = turn;
			turn = turn == "x" ? "o" : "x";
		}
		last = null;
		check();
	}
}

function mouseClicked(e) {
	if (mouseX < 0 || mouseX > WIDTH || mouseY < 0 || mouseY > HEIGHT) return;
	const rIndex = Math.floor(mouseY / (HEIGHT / 3));
	const cIndex = Math.floor(mouseX / (WIDTH / 3));
	last = [rIndex, cIndex];
}

function drawSymbol(sym, r, c) {
	const pad = 10;
	if (sym == "x") {
		line(c * w + pad, r * h + pad, (c + 1) * w - pad, (r + 1) * h - pad);
		line(c * w + pad, (r + 1) * h - pad, (c + 1) * w - pad, r * h + pad);
	} else if (sym == "o") {
		ellipseMode(CORNER);
		ellipse(c * w + pad, r * h + pad, w - pad, h - pad);
	}
}

const reduceLine = (line) =>
	line.reduce((acc, curr) => (acc += curr == "x" ? 1 : 0), 0);

const checkLines = (lines) => {
    for (let line of lines) {
        if (line.includes(undefined)) continue;
        const result = reduceLine(line);
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
    
	const diags = [
        [board[0][0], board[1][1], board[2][2]],
		[board[0][2], board[1][1], board[2][0]],
	];
    
    checkLines(board);
    checkLines(cols);
	checkLines(diags);
}