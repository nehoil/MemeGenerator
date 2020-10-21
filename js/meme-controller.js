'use strict';

var gCanvas;
var gCtx;
var defaultFontSize = 48;
var defaultFont = 'Impact';
var gDefault1LineLoc;
var gDefault2LineLoc;

function init() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    gDefault1LineLoc = { x: gCanvas.width / 2, y: defaultFontSize };
    gDefault2LineLoc = { x: gCanvas.width / 2, y: gCanvas.height - 20 };
    renderCanvas()
}


/** Render Funcs **/

function renderCanvas() {
    var selectedImg = getSelectedImgUrl();
    var lines = getLines();
    drawImgFromSrc(selectedImg);
    setTimeout(() => {
        lines.forEach(line => {
            drawText(line.txt, line.x, line.y, line.font, line.size, line.lineW, line.strokeColor, line.FillColor);
        })
    }, 50);
}


/** On Funcs **/

function onTextChange(txt,id=1) {
    changeTxt(txt,id);
    renderCanvas();
}

function onImgChange(el,id) {
    changeImg(id);
    renderCanvas();
}

function onTxtSizeChange(diff,id=1){
    changeTxtSize(diff,id);
    renderCanvas();
}

function onLocChange(dir,diff,id=1){
    changeTxtLoc(dir,diff,id);
    renderCanvas();
}

/** Draws **/

function drawImgFromSrc(imgSrc = './img/1.jpg') {
    var img = new Image()
    img.src = imgSrc;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}

function drawImgFromEl(el) {
    gCtx.drawImage(el, 0, 0, gCanvas.width, gCanvas.height)
}


function drawText(text, x, y, font = defaultFont, size = defaultFontSize, lineW = 2, strokeColor = 'black', FillColor = 'white') {
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = FillColor;
    gCtx.lineWidth = lineW;
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = 'center';
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}


function drawLine(x, y, xEnd = 250, yEnd = 250) {
    gCtx.beginPath()
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.strokeStyle = 'red'
    gCtx.stroke()

}