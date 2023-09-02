//conway's game of life
//i know the code is quite messy
//i might refactor later
const INTERVAL_DELAY = 0.1; //ms
const BOARD_W = 100;
const BOARD_H = 100;
const SCALE_MULT = 5;

let step = 0;
let boards = [];
let active_board = 0;
function generate_random_boards(w, h) {
    let board = [];
    for(let x = 0; x < w; x++) {
        let board_row = []
        for(let y= 0; y < h; y++) {
            board_row.push(Math.floor(Math.random() * 2)*0);
        }
        board.push(board_row);
    }
    return board;
}

function gol(boards, active_board_flag) {
    let active_board = boards[active_board_flag];
    //since there are only 2 boards, and the flag is 0 or 1,
    //we can just xor to get the flag of the inactive
    //board.
    let next_board = boards[active_board_flag ^ 1];
    for(let x = 0; x < BOARD_W; x++) {
        for(let y = 0; y < BOARD_H; y++) {
            let cell_sum = 0;
            //time to go through all neighbours
            for(let i = -1; i <= 1; i++) {
                //out of bounds
                if(x+i < 0 || x+i >= BOARD_W) {
                    cell_sum += 0;
                    continue;
                }

                for(let j = -1; j <=1; j++) {
                    //out of bounds
                    if(y+j < 0 || y+j >= BOARD_H) {
                        cell_sum += 0;
                        continue;
                    }
                    //not out of bounds
                    //console.log(x+i, y+j, active_board);
                    cell_sum += active_board[x+i][y+j];

                }
            }

            if(active_board[x][y]) {
                //cell is alive.
                //remain alive if 2 or 3 live neighbours
                //cell_sum also factors in the cell itself
                if(cell_sum > 2 && cell_sum <=4) {
                    next_board[x][y] = 1;
                } else {
                    next_board[x][y] = 0;
                }
            } else {
                //cell is dead.
                //become alive if 3 live neighbours
                if(cell_sum == 3) {
                    next_board[x][y] = 1;
                } else {
                    next_board[x][y] = 0;
                }
            }
        }
    }
    return [next_board, active_board_flag ^ 1];
}


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

function start() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    //resize canvas
    canvas.width = BOARD_W * SCALE_MULT;
    canvas.height = BOARD_H * SCALE_MULT;
    boards.push(generate_random_boards(BOARD_W, BOARD_H));
    boards.push(generate_random_boards(BOARD_W, BOARD_H));
    setInterval(update, INTERVAL_DELAY, ctx);
}

function update(ctx) {
    step++;
    step %= 5;
    draw(boards[active_board], ctx);
    if(step == 3) {
    let result = [];
        result = gol(boards, active_board);
        active_board = result[1];
        boards[active_board] = result[0];
    }
    let x = ant.getX();
    let y = ant.getY();
    //console.log(x, y, board[x][y]);
    ant.rotate(boards[active_board][x][y]);
    boards[active_board][x][y] ^= 1;

    ant.move();
    drawAnt(ctx, ant);
}

function draw(boards, ctx) {
    for(let x = 0; x < BOARD_W; x++) {
        for(let y = 0; y < BOARD_H; y++) {
            if(boards[x][y]) {
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillRect(x * SCALE_MULT, y * SCALE_MULT, SCALE_MULT, SCALE_MULT);
            } else {
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.fillRect(x * SCALE_MULT, y * SCALE_MULT, SCALE_MULT, SCALE_MULT);
            }
        }
    }
}

function drawAnt(ctx, ant) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(ant.getX() * SCALE_MULT, ant.getY() * SCALE_MULT, SCALE_MULT, SCALE_MULT);
}

document.addEventListener("DOMContentLoaded", start);