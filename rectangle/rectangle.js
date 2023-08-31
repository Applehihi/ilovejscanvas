//rectangle
function draw() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(255, 0, 0)"
    ctx.fillRect(0, 0, 100, 100);
}

document.addEventListener("DOMContentLoaded", draw);