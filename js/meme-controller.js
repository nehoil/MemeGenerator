'use strict';


// Todos:
// 1. Improve the img delay issue (render txt after img is loaded by using .onload); 
// Found Out if i can use the onload func on other func witout maxing two funcs into one.
// 2. 

var gCanvas;
var gCtx;
var defaultFontSize = 48;
var defaultFont = 'Impact';
var gDefault1LineLoc;
var gDefault2LineLoc;
var gText;

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
    drawImgFromSrc(selectedImg);
    function drawImgFromSrc(imgSrc = './img/1.jpg') {
        var img = new Image()
        img.src = imgSrc;
        img.onload = () => {
            gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
            drawTxt();
        }
    }
}

function drawTxt() {
    var lines = getLines();
    lines.forEach(line => {
        drawText(line.txt, line.x, line.y, line.font, line.size, line.lineW, line.strokeColor, line.fillColor);
        if (line.isFocus) drawRectAroundTxt(line.x, line.y)
    });
}


/** On Funcs **/

function onSwitch() {
    switchSelectedLine();
    var line = getSelectedLine();
    line.isFocus = true;
    renderCanvas()
}

function onTextChange(txt) {
    changeTxt(txt);
    renderCanvas();
}

function onImgChange(el, id) {
    changeImg(id);
    renderCanvas();
}

function onTxtSizeChange(diff) {
    changeTxtSize(diff);
    renderCanvas();
}

function onLocChange(dir, diff) {
    changeTxtLoc(dir, diff);
    renderCanvas();
}


/** Draws **/

function drawRectAroundTxt(x, y) {
    var selectedLine = getSelectedLine();
    // console.log('selected', selectedLine);
    var txtmeasue = gCtx.measureText(selectedLine.txt);
    var height = selectedLine.size * 1.286;
    var yPos = y - height / 1.1;
    gCtx.strokeRect(x - (txtmeasue.width / 2) - 5, yPos + 10, txtmeasue.width + 15, height - 5);
}


function drawRect(x, y) {
    gCtx.beginPath()
    gCtx.rect(x, y, 150, 150)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
    gCtx.fillStyle = 'orange'
    gCtx.fillRect(x, y, 150, 150)
}

function drawGlowingText(text, x, y, glowColorHexString, glowDistance = 10) {
    gCtx.save();
    gCtx.shadowBlur = glowDistance;
    gCtx.shadowColor = glowColorHexString;
    gCtx.strokeText(text, x, y);
    for (let i = 0; i < 3; i++)
        gCtx.fillText(text, x, y);
    gCtx.restore();
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

/* test codes */


