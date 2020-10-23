// Todos:
// 1. Fix on change align, rec is demaged.
// 2. Fix removal func so will not remove lines if they're not selected.
// 3. Change drawLine to recieve lines.
// 4. Chnage line 77 on meme-service to work with construction or find a work-around. (preffered)
// 6. Consider change the canvas resize when live resizing is accure.
// 7. Improve text onclick detection line 117 (find text hight with better technics) and improve detect if text is bigger


'use strict';

var gCanvas;
var gCtx;
var defaultFontSize = 48;
var defaultFont = 'Impact';
var gDefault1LineLoc;
var gDefault2LineLoc;
var gDefaultLoc;
var gDefaultTxt = 'ENTER TEXT HERE';
var gIsOn = false;


function init() {
    if (gUserMemes.length < 0) gUserMemes = loadFromStorage(STORAGE_MEMES_KEY);
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    resizeCanvas();
    renderCanvas();
    renderGallery();
    gDefaultLoc = { x: gCanvas.width / 2, y: gCanvas.height / 2 };
    createDefaultLines();
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

function renderGallery() {
    var strHtmls = getImgs().map(img => {
        return `
        <img src="img/${img.id}.jpg" alt="" onclick="onImgClick(this,${img.id})">`
    }).join('');
    document.querySelector('.gallery-container').innerHTML = strHtmls;
}


function renderMemes() {
    var memes = loadFromStorage(STORAGE_MEMES_KEY)
    var strHtmls;
    if (!memes) strHtmls = 'No Memes Saved Yet..!'
    else {
        var strHtmls = memes.map(meme => {
            return `<a href="#" onclick="onDownloadMeme(this,${meme.id})" download="my-img.jpg"><img src="${meme.img}" alt=""></a>`
        }).join('');
    }
    document.querySelector('.memes-container').innerHTML = strHtmls
}


function resizeCanvas() {
    gDefaultLoc = { x: gCanvas.width / 2, y: gCanvas.height / 2 };
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
    createDefaultLines();
    renderCanvas();
}


/** On Funcs **/


function onDownloadMeme(elLink, id) {
    var memeImg = gUserMemes.find(meme => meme.id === id).img
    elLink.href = memeImg;
}

function onDownload(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function onSave() {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    saveMeme(imgContent)
}

function onGalleryClick() {
    document.querySelector('.gallery-container').classList.remove('hide');
    document.querySelector('.memes-container').classList.add('hide');
    document.querySelector('.editor-container').classList.add('hide');
}

function onMemesClick() {
    document.querySelector('.memes-container').classList.remove('hide');
    document.querySelector('.gallery-container').classList.add('hide');
    document.querySelector('.editor-container').classList.add('hide');
    renderMemes()
}

function onImgClick(el, id) {
    document.querySelector('.editor-container').classList.toggle('hide');
    document.querySelector('.gallery-container').classList.toggle('hide');
    onImgChange(el, id)
    resizeCanvas();
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


/* Drag & Drop */



/* On Funcs Drag & Drop */


function onMouseUp() {
    gIsOn = false;
}

function onMouseMove(ev) {
    if (!gIsOn) return;
    const { offsetX, offsetY } = ev;
    moveItem(offsetX, offsetY);
}

function onMouseDown(ev) {
    const { offsetX, offsetY } = ev;
    if (isOnText(offsetX, offsetY)) gIsOn = true;
}

