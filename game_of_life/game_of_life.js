//conway's game of life
//i know the code is quite messy
//i might refactor later
const INTERVAL_DELAY = 50; //ms
const BOARD_W = 200;
const BOARD_H = 200;
const SCALE_MULT = 3;

let boards = [];
let active_board = 0;
function generate_random_boards(w, h) {
    let board = [];
    for(let x = 0; x < w; x++) {
        let board_row = []
        for(let y= 0; y < h; y++) {
            board_row.push(Math.floor(Math.random() * 2));
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
    draw(boards[active_board], ctx);
    let result = [];
    result = gol(boards, active_board);
    active_board = result[1];
    boards[active_board] = result[0];
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

document.addEventListener("DOMContentLoaded", start);