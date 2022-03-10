// tambourinecheesecatrhino (Emma Buller, Tami Takada, Christopher Liu, Owen Yaggy)
// SoftDev pd0
// P02 -- Interactive Map of Stuy
// 2022-03-22

// Floor Editor JS

// get canvas
let c = document.getElementById("canvas");

// instantiate a CanvasRenderingContext2D object
let ctx = c.getContext("2d");
ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
ctx.strokeStyle = "black";

// get html elements
let buttonNew = document.getElementById("buttonNew");
let roomCard = document.getElementById("roomCard");
let roomId = document.getElementById("roomId");
let roomName = document.getElementById("roomName");
let roomNumber = document.getElementById("roomNumber");
let roomCoords = document.getElementById("roomCoords");
let buttonCancel = document.getElementById("buttonCancel");

let currentRoom = [];

// set map as the background
let bg = new Image();
bg.src = imageSrc;
bg.onload = () => {
  ctx.drawImage(bg, 0, (c.clientHeight - bg.height) / 2);
}
// draw existing rooms here

// clear the current room form
let clearRoomCard = () => {
  roomId.value = "";
  roomName.value = "";
  roomNumber.value = "";
  roomCoords.value = "";
  currentRoom = [];
}

// return to original map state
let clearMap = () => {
  clearRoomCard();
  ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
  ctx.drawImage(bg, 0, (c.clientHeight - bg.height) / 2);
  // draw existing rooms now
}


// set mode to select by default
let mode = "select";
c.style.cursor = "grab";
clearRoomCard();

// new room handler
let createNewRoom = () => {
  roomCard.style.display = "block";
  clearMap();
  mode = "draw";
  c.style.cursor = "crosshair";
};

// cancel current room
let cancelCurrentRoom = () => {
  roomCard.style.display = "none";
  clearMap();
  mode = "select";
  c.style.cursor = "grab";
}

// room drawing
let drawVertex = (e) => {
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;

  ctx.fillStyle = "green";
  ctx.fillRect(mouseX - 1, mouseY - 1, 2, 2);
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

  if (currentRoom.length === 0) {
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
  } else {
    ctx.lineTo(mouseX, mouseY);
  }

  currentRoom.push(`(${mouseX}, ${mouseY})`);
};

let completeRoom = (e) => {
  if (e.code === "ShiftLeft" && currentRoom.length > 0) {
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    roomCoords.value = currentRoom.toString();
    currentRoom = [];
  }
};

// selection mode
let checkSelection = (e) => {
  let mouseX = e.offsetX;
  let mouseY = e.offsetY;

  // placeholder roomData
  roomData = "[]"

  // would return the id of the room selected
  return null;
}

// event handlers
c.addEventListener("click", (e) => {
  if (mode === "select") {
    checkSelection(e);
  } else {
    drawVertex(e);
  }
});

document.addEventListener("keydown", (e) => {
  if (mode === "draw") {
    completeRoom(e);
  }
});

buttonNew.addEventListener("click", createNewRoom);

buttonCancel.addEventListener("click", cancelCurrentRoom);
