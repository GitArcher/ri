"use strict"
let btnClear = document.getElementById('clear');

let btnTeach = document.getElementById('teach');
let btnTrain = document.getElementById('train');

let mmr = document.getElementById('mmr');
let save = document.getElementById('save');
let load = document.getElementById('load');

let cstmMsg = document.getElementById('cstmMsg')
let iknow = document.getElementById('block-info');

let canv = document.getElementById('c1'),
    ctx = canv.getContext("2d");
ctx.fillStyle = "black";
ctx.lineWidth = 15;
ctx.lineCap = "round";
ctx.filter = 'blur(1px)';

let buffCanv = document.createElement('canvas'),
    buffCtx = buffCanv.getContext("2d");
buffCanv.width = 40;
buffCanv.height = 40;

let symbol = "";

let NNet = {
  memory: {},
  similarity: 0,
  possSymbol: undefined,
  check: function(imgMap) {
    let similarityPer = 0;
    let wastePixels = 0;
    for (let symbl in this.memory) {
      for (let i = 0; i < this.memory[symbl].length; i++) {
        for (let n = 0; n < 1600; n++) {
          (this.memory[symbl][i][n]+imgMap[n] == 0) ? wastePixels++ : similarityPer += 1-Math.abs(this.memory[symbl][i][n]-imgMap[n]);
        };
        similarityPer *= 100/(1600-wastePixels);
        if(this.similarity < similarityPer) {
          this.similarity = Math.round(similarityPer);
          this.possSymbol = symbl;
        };
        similarityPer = 0;
        wastePixels = 0;
      };
    };
    alert(`${this.possSymbol}`);
    this.similarity = 0;
  },
  addInMemory: function(imgMap, symbl) {
    if(this.memory[symbl]) {
      this.memory[symbl].push(imgMap);
    } else {
      this.memory[symbl] = [];
      this.memory[symbl].push(imgMap);
    };
//    this.memory[symbl].weight = 1;
  },
};

function getSizeDrawnImage () {
  let left, top, width, height, k,
  [xArr, yArr] = new Array ([], []);
  let data = ctx.getImageData(0, 0, 300, 300).data;

  for(let i = 3, x = 0, y = 0; i < data.length; i+=4, x++) {
    if(x == 300) y++, x = 0;
    if(data[i] != 0) {
      xArr.push(x);
      yArr.push(y);
    };
  };

  left = Math.min(...xArr);
  top = Math.min(...yArr);
  width = Math.max(...xArr) - left + 1;
  height = Math.max(...yArr) - top + 1;

  k = (width > height) ? 40/width : 40/height;

  return [left, top, width, height, k];
};

function getImageBitMap () {
  let [left, top, width, height, k] = [...getSizeDrawnImage()];
  let bitMap = [];

  buffCtx.drawImage(canv, left, top, width, height, (40-width*k)/2, (40-height*k)/2, width*k, height*k);
  ctx.clearRect(left, top, width, height);

  let data = buffCtx.getImageData(0, 0, 40, 40).data;
  buffCtx.clearRect(0, 0, 40, 40);
  for (let i = 3; i < data.length; i+=4) {
    bitMap.push( data[i]==0 ? data[i] : Math.round(data[i]/255*100)/100 );
  };
  return bitMap;
};
/*img.style.background = 'white'
cstmMsg.appendChild(img);
img.style.width = '20vw';*/

btnTrain.addEventListener('click', () => {
  NNet.check( getImageBitMap() );
})

btnTeach.addEventListener('click', () => {
  symbol = prompt("Придумай имя рисунку:", symbol);
  NNet.addInMemory( getImageBitMap(), symbol );
});

save.addEventListener('click', () => {
  let tmp = prompt("Придумайте имя сохранения");
  if(tmp !== null) localStorage.setItem(tmp, JSON.stringify(NNet.memory));
});

load.addEventListener('click', () => {
  let tmp = prompt('Имя сохранения');
  if(tmp !== null) NNet.memory = JSON.parse( localStorage.getItem(tmp) );
});

mmr.addEventListener('click', () => {
  cstmMsg.style.visibility = 'visible';
});
