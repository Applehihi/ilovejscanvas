//langton's ant
const INTERVAL_DELAY = 1;
const BOARD_W = 200;
const BOARD_H = 200;
const SCALE_MULT = 2;
let board = [];

function mod(n, m) {
    return ((n % m) + m) % m;
}

class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        //anticlockwise, clockwise.
        this.rotationMat = [-1, 1];
        this.direction = 0;
        //up, right, down, left.
        this.movementMat = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    rotate(cell_state) {
        //wraparound
        this.direction = mod(this.direction + this.rotationMat[cell_state], 4); 
        //console.log(cell_state, this.direction);
    }

    move() {
        //console.log(this.direction);
        this.x += this.movementMat[this.direction][0];
        this.y += this.movementMat[this.direction][1];
        this.x = mod(this.x, BOARD_W);
        this.y = mod(this.y, BOARD_H);
    }
}

let ant = new Ant(Math.floor(BOARD_W/2), Math.floor(BOARD_H/2));
//let ant2 = new Ant(Math.floor(BOARD_W/4), Math.floor(BOARD_H/4));
function start() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    //resize canvas
    canvas.width = BOARD_W * SCALE_MULT;
    canvas.height = BOARD_H * SCALE_MULT;

    //let board_row = Array(BOARD_W).fill(0);
    for(let i = 0; i < BOARD_W; i++) {
        board.push(new Array(BOARD_H).fill(0));
    }
    setInterval(update, INTERVAL_DELAY, ctx);
}

function update(ctx) {
    let x = ant.getX();
    let y = ant.getY();
    //console.log(x, y, board[x][y]);
    ant.rotate(board[x][y]);
    board[x][y] ^= 1;

    ant.move();
    //console.log(x, y, board[x][y]);
    draw(ctx, x, y, ant);

    /*
    let x2 = ant2.getX();
    let y2 = ant2.getY();
    //console.log(x, y, board[x][y]);
    ant2.rotate(board[x2][y2]);
    board[x2][y2] ^= 1;

    ant2.move();
    //console.log(x, y, board[x][y]);
    draw(ctx, x2, y2, ant2);
    */
}

function draw(ctx, x, y, ant) {
    //console.log("drawing");
    if(board[x][y]) {
        //black cell
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(x * SCALE_MULT, y * SCALE_MULT, SCALE_MULT, SCALE_MULT);
    } else {
        //white cell
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(x * SCALE_MULT, y * SCALE_MULT, SCALE_MULT, SCALE_MULT);
    }
    //draw ant
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(ant.getX() * SCALE_MULT, ant.getY() * SCALE_MULT, SCALE_MULT, SCALE_MULT);
}

document.addEventListener("DOMContentLoaded", start);