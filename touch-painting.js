canv.addEventListener('touchstart', (e) => {
  e.preventDefault();
  ctx.beginPath();
  ctx.moveTo( ...getTouchCoords(e) );
});

canv.addEventListener('touchmove', (e) => {
  e.preventDefault();
  ctx.lineTo( ...getTouchCoords(e) );
  ctx.stroke();
  ctx.moveTo( ...getTouchCoords(e) );
});

canv.addEventListener('touchend', (e) => {
  ctx.closePath();
});

function getTouchCoords (e) {
  let layerX = e.targetTouches[0].clientX-(canv.offsetLeft+canv.clientLeft);
  let layerY = e.targetTouches[0].clientY-(canv.offsetTop+canv.clientTop);
  let x = Math.round(layerX*300/canv.clientWidth);
  let y = Math.round(layerY*300/canv.clientHeight);
  return [x,y];
}
