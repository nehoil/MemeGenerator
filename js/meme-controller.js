'use strict';

var gCanvas;
var gCtx;
var defaultFontSize = 48;

function init() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    drawImg();
    setTimeout(() => {
        drawText(getMemeText(), gCanvas.width/2, defaultFontSize);
    }, 50);
}

function drawImg() {
    var img = new Image()
    img.src = './img/1.jpg';
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}

function renderCanvas(){
    drawImg();
}

function onTextChange(txt){
    renderCanvas()
    setTimeout(() => {
        drawText(txt, gCanvas.width/2, defaultFontSize);
    }, 50);
}

function drawText(text, x, y) {
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.lineWidth = '2'
    gCtx.font = '48px Impact'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function drawLine(x, y, xEnd = 250, yEnd = 250) {
    gCtx.beginPath()
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.strokeStyle = 'red'
    gCtx.stroke()

}