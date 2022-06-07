let input = {
  x:0,
  y:0,
};
let idTimer;

function startPainting() {
  ctx.lineTo(input.x, input.y);
  ctx.stroke();
  ctx.moveTo(input.x, input.y);
};

canv.addEventListener('mousedown', (e) => {
  clearInterval(idTimer);
  input.canvWidth = parseInt(getComputedStyle(canv).width);
  input.canvHeight = parseInt(getComputedStyle(canv).height);
  input.x = e.offsetX*300/input.canvWidth;
  input.y = e.offsetY*300/input.canvHeight;
  ctx.beginPath();
  ctx.moveTo(input.x, input.y)
  idTimer = setInterval(startPainting, 15)
});

canv.addEventListener('mousemove', (e) => {
  input.x = e.offsetX*300/input.canvWidth;
  input.y = e.offsetY*300/input.canvHeight;
});

canv.addEventListener('mouseup', () => {
  clearInterval(idTimer);
  ctx.closePath();
});

canv.addEventListener('mouseleave', () => {
  clearInterval(idTimer);
  ctx.closePath();
});

btnClear.addEventListener("click", () => {
  ctx.clearRect(0, 0, 300, 300);
});
