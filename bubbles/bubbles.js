//bubbles that pop
const INTERVAL_DELAY = 50;
const CANVAS_W = 1000;
const CANVAS_H = 1000;
const GROWTH_C = 0.9;
const POP_C = 0.025;
let bubbles = [];

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

class Bubble {
    constructor(x, y, colour, growthChance, popChance) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.radius = 0;
        this.growthChance = growthChance;
        this.popChance = popChance;
    }

    update(ctx) {
        let rng = Math.random();
        if(rng < this.growthChance) {
            this.radius++;
        }
        if(rng < this.popChance) {
            return true;
        }
        //this.draw(ctx);
        return false;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `rgb( ${this.colour} )`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

function start() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.buffer = document.createElement("canvas");
    canvas.buffer.width = canvas.width;
    canvas.buffer.height = canvas.height;
    setInterval(update, INTERVAL_DELAY, ctx, canvas.buffer);
    requestAnimationFrame((time) => draw(ctx, canvas.buffer)); //so that it stops flickering
}

function update(ctx, buffer) {
    
    const bufferCtx = buffer.getContext("2d");
    //bufferCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    
    let rng = Math.random();
    if(rng < (2/(bubbles.length+1))) {
        let colour = "";
        colour += randInt(0, 255) + ' ' + randInt(0, 255) + ' ' + randInt(0, 255);
        bubbles.push(new Bubble(randInt(0, CANVAS_W), randInt(0, CANVAS_H), colour, GROWTH_C, POP_C));
    }
    bubbles.forEach((bubble, index) => {
        let popped = bubble.update(bufferCtx);
        if(popped) {
            bubbles.splice(index, 1);
        }
    })
    if(bubbles.length > 100) {
        //console.log("More than 100 bubbles! Possible leak? Bubbles: ", bubbles.length);
    }
    //ctx.clearRect(0, 0, CANVAS_W,CANVAS_H);
    //ctx.drawImage(buffer, 0, 0); //smoother anim
}

function draw(ctx, buffer) {
    //i think we could actually remove the buffer without consequence
    //might even be more performant
    const bufferCtx = buffer.getContext("2d");
    bufferCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    bubbles.forEach((bubble) => {
        bubble.draw(bufferCtx);
    });
    ctx.drawImage(buffer, 0, 0);
    requestAnimationFrame((time) => draw(ctx, canvas.buffer));
}
document.addEventListener("DOMContentLoaded", start);