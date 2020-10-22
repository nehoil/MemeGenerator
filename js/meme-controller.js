'use strict';


// Todos:
// 1. Fix on change align, rec is demaged.
// 2. Fix removal func so will not remove lines if they're not selected.
// 3. Change drawLine to receve on lines.
// 4. Chnage line 77 on meme-service to work with construction or find a work-around. (preffered)

var gCanvas;
var gCtx;
var defaultFontSize = 48;
var defaultFont = 'Impact';
var gDefault1LineLoc;
var gDefault2LineLoc;
var gDefaultLoc;
var gDefaultTxt = 'ENTER TEXT HERE';

function init() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    gDefault1LineLoc = { x: gCanvas.width / 2, y: defaultFontSize };
    gDefault2LineLoc = { x: gCanvas.width / 2, y: gCanvas.height - 10 };
    changeLinesToDefault();
    gDefaultLoc = { x: gCanvas.width / 2, y: gCanvas.height / 2 };
    renderCanvas()
}


/** Render Funcs **/

function renderCanvas() {
    var selectedImg = getSelectedImgUrl();
    var img = new Image()
    img.src = selectedImg;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawTxt();
    }
}



/** On Funcs **/

function onGalleryClick() {
    document.querySelector('.gallery-container').classList.remove('hide')
    document.querySelector('.editor-container').classList.add('hide')
}

function onImgClick(el,id) {
    document.querySelector('.editor-container').classList.toggle('hide')
    document.querySelector('.gallery-container').classList.toggle('hide')
    onImgChange(el,id)
}

function onAlignChange(align) {
    alignChange(align);
    renderCanvas();
}

function onFillColorChange(color) {
    changeFillColor(color);
    renderCanvas();
}

function onFontChange(font) {
    changeFont(font);
    renderCanvas();
}

function onAddTxt() {
    addLine(gDefaultTxt, gDefaultLoc);
    renderCanvas();
}

function onRemove() {
    // prepare in the near future for other sort of removals.
    removeLine();
    renderCanvas();
}

function onSwitch() {
    var prevLine = getSelectedLine().isFocus = false;
    switchSelectedLine();
    var line = getSelectedLine().isFocus = true;
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

function drawTxt() {
    var lines = getLines();
    lines.forEach(line => {
        drawText(line.txt, line.x, line.y, line.font, line.size, line.lineW, line.strokeColor, line.fillColor, line.align);
        if (line.isFocus) drawRectAroundTxt(line.x, line.y)
    });
}


function drawRectAroundTxt(x, y) {
    var selectedLine = getSelectedLine();
    var txtMeasure = gCtx.measureText(selectedLine.txt);
    console.log('txtMeasure', txtMeasure);
    var height = selectedLine.size * 1.286;
    var yPos = y - height / 1.1 + 10;
    gCtx.strokeRect(x - (txtMeasure.width / 2) - 10, yPos, txtMeasure.width + 20, height - 6);
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


function drawText(text, x, y, font = defaultFont, size = defaultFontSize, lineW = 2, strokeColor = 'black', FillColor = 'white', txtAlign = 'center') {
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = FillColor;
    gCtx.lineWidth = lineW;
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = txtAlign;
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


