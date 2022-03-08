// retrieve node in DOM via ID
let c = document.getElementById("slate");

// instantiate a CanvasRenderingContext2D object
let ctx = c.getContext("2d");
ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
ctx.strokeStyle = "black";

// set map as the background
let background = new Image();
background.src = "1.png";
background.onload = function () {
    ctx.drawImage(background, 0, (c.clientHeight - background.height) / 2);
}

let currentPolygon = [];

// draw function
let draw = function (e) {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;

    ctx.fillStyle = "green";
    ctx.fillRect(mouseX - 1, mouseY - 1, 2, 2);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

    if (currentPolygon.length === 0) {
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
    } else {
        ctx.lineTo(mouseX, mouseY);
    }

    currentPolygon.push([mouseX, mouseY]);
}

// complete current polygon when left shift pressed
let keyDown = function (e) {
    if (e.code === "ShiftLeft") {
        console.log("finished polygon");
        console.log(currentPolygon);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        currentPolygon = [];
    }
    console.log(e.code);
}

// clear canvas
let wipeCanvas = function () {
    console.log("wiping canvas...")
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    ctx.drawImage(background, 0, (c.clientHeight - background.height) / 2);
}

// event listeners
c.addEventListener("click", draw);
let clearB = document.getElementById("buttonClear");
clearB.addEventListener("click", wipeCanvas);

document.addEventListener("keydown", keyDown);
