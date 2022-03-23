/*
  tambourinecheesecatrhino (Emma Buller, Tami Takada, Christopher Liu, Owen Yaggy)
  SoftDev pd0
  P02 -- Interactive Map of Stuy
  2022-03-23

  Map Viewer JS
*/

// get canvas
let c = document.getElementById("canvas");

// instantiate a CanvasRenderingContext2D object
let ctx = c.getContext("2d");
ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
ctx.strokeStyle = "black";

// apply scaling
const originalWidth = 1200;
const originalHeight = 800;
const widthScale = c.clientWidth / originalWidth;
const heightScale = c.clientHeight / originalHeight;
ctx.scale(widthScale, heightScale);

// get html elements
let roomCard = document.getElementById("roomCard");
let roomName = document.getElementById("roomName");
let roomNumber = document.getElementById("roomNumber");
let roomType = document.getElementById("roomType");
let roomAmenities = document.getElementById("roomAmenities");
let chalkboard = document.getElementById("chalkboard");
let dryerase = document.getElementById("dryerase");
let smartboard = document.getElementById("smartboard");
let projector = document.getElementById("projector");
let computers = document.getElementById("computers");

let currentRoom = [];

// clear the current room form
let clearRoomCard = () => {
  roomName.innerHTML = "";
  roomNumber.innerHTML = "";
  currentRoom = [];
};

// draw the provided room array
let drawRoom = (room) => {
  let coords = room[4];
  coords = JSON.parse(
    "[" + coords.replaceAll("(", '{"coords": [').replaceAll(")", "]}") + "]"
  );

  if (coords.length < 3) {
    return;
  }

  ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
  if (room[0] === selectedRoomId) {
    ctx.fillStyle = "rgba(34, 227, 34, 0.5)";
  }

  ctx.beginPath();
  ctx.moveTo(coords[0].coords[0], coords[0].coords[1]);
  for (let i = 1; i < coords.length; i++) {
    ctx.lineTo(coords[i].coords[0], coords[i].coords[1]);
  }
  ctx.closePath();
  ctx.fill();
};

// return to original map state
let clearMap = () => {
  clearRoomCard();
  ctx.clearRect(0, 0, originalWidth, originalHeight);
  ctx.drawImage(bg, 0, (originalHeight - bg.height) / 2);
  for (let i = 0; i < roomData.length; i++) {
    drawRoom(roomData[i]);
  }
};

// set map as the background
let bg = new Image();
bg.src = imageSrc;
bg.onload = () => {
  clearMap();
};

// set mode to select by default
let mode = "select";
c.style.cursor = "grab";
clearRoomCard();

// selection mode
let didClickRoom = (x, y, room) => {
  let coords = room[4];
  coords = JSON.parse(
    "[" + coords.replaceAll("(", '{"coords": [').replaceAll(")", "]}") + "]"
  );
  coords.push(coords[0]);

  let clicked = false;
  for (let i = 1, j = 0; i < coords.length; i++, j++) {
    let ix = coords[i].coords[0];
    let iy = coords[i].coords[1];
    let jx = coords[j].coords[0];
    let jy = coords[j].coords[1];
    let iySide = iy > y;
    let jySide = jy > y;

    if (iySide != jySide) {
      if (x < ((jx - ix) * (y - iy)) / (jy - iy) + ix) {
        clicked = !clicked;
      }
    }
  }

  return clicked;
};

let showSelected = (room) => {
  roomCard.style.display = "block";
  clearMap();
  roomName.innerHTML = room[3];
  roomNumber.innerHTML = room[2];
  if (room[5] != "") {
    info = JSON.parse(room[5]);
    if (info['items'].length == 0) roomAmenities.hidden = "hidden";
    else roomAmenities.hidden = "";
    if (info['items'].includes('chalkboard')) chalkboard.hidden = "";
    else chalkboard.hidden = "hidden";
    if (info['items'].includes('dryerase')) dryerase.hidden = "";
    else dryerase.hidden = "hidden";
    if (info['items'].includes('smartboard')) smartboard.hidden = "";
    else smartboard.hidden = "hidden";
    if (info['items'].includes('projector')) projector.hidden = "";
    else projector.hidden = "hidden";
    if (info['items'].includes('computers')) computers.hidden = "";
    else computers.hidden = "hidden";
    let matchType = {"classroom": "Classroom", "lab": "Lab", "computer": "Computer Lab", "demo": "Science Demo", "art": "Art Class", "music": "Music Room", "gym": "Gym", "office": "Office", "bathroom": "Bathroom", "other": "Other"};
    roomType.innerHTML = matchType[info['type']];
  } else {
    chalkboard.hidden = "hidden";
    dryerase.hidden = "hidden";
    smartboard.hidden = "hidden";
    projector.hidden = "hidden";
    computers.hidden = "hidden";
    roomType.innerHTML = "Other";
    roomAmenities.hidden = "hidden";
  }
};

let checkSelection = (e) => {
  let mouseX = e.offsetX / widthScale;
  let mouseY = e.offsetY / heightScale;

  for (let i = 0; i < roomData.length; i++) {
    if (didClickRoom(mouseX, mouseY, roomData[i])) {
      showSelected(roomData[i]);
      return;
    }
  }
};

// event handlers
c.addEventListener("click", (e) => {
  checkSelection(e);
});
