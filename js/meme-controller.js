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
var gIsMouseDown = false;
var gIsImgClicked = false;


function init() {
    if (gUserMemes.length < 0) gUserMemes = loadFromStorage(STORAGE_MEMES_KEY);
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    resizeCanvas();
    renderCanvas();
    renderGallery();
    gDefaultLoc = { x: gCanvas.width / 2, y: gCanvas.height / 2 };
    createDefaultLines();
    addSrcListener();
    renderStickers();
    DragDropSticker();
}



/** Render Funcs **/

function renderCanvas() {
    var selectedImg = getSelectedImgUrl();
    var img = new Image()
    img.src = selectedImg;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawTxt();
        drawStickers();
    }
}

function renderGallery() {
    var strHtmls = getImgs().map(img => {
        return `
        <img src="img/${img.id}.jpg" alt="" onclick="onImgClick(this,${img.id})">`;
    }).join('');
    document.querySelector('.gallery-container').innerHTML = strHtmls;
}


function renderMemes() {
    var memes = loadFromStorage(STORAGE_MEMES_KEY)
    var strHtmls;
    if (!memes) strHtmls = 'No Memes Saved Yet..!';
    else {
        var strHtmls = memes.map(meme => {
            return `<a href="#" onclick="onDownloadMeme(this,${meme.id})" download="my-img.jpg"><img src="${meme.img}" alt=""></a>`
        }).join('');
    }
    document.querySelector('.memes-container').innerHTML = strHtmls;
}

function renderStickers() {
    var stickers = getStickersToPanel();
    var strHtmls = stickers.map(sticker => {
        return ` <img src="img/stickers/${sticker.id}.png" alt="">`;
    }).join('');
    document.querySelector('.stickers-container').innerHTML = strHtmls
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
    gDefaultLoc = { x: gCanvas.width / 2, y: gCanvas.height / 2 };
    createDefaultLines();
    renderCanvas();
}


/** On Funcs **/

function onSearch(keyword) {
    document.querySelector('.search-page-container').classList.remove('hide');
    document.querySelector('.memes-container').classList.add('hide');
    document.querySelector('.gallery-container').classList.add('hide');
    document.querySelector('.editor-container').classList.add('hide');
    renderSearchResult(keyword)
}

function onDownloadMeme(elLink, id) {
    var memeImg = gUserMemes.find(meme => meme.id === id).img
    elLink.href = memeImg;
}

function onDownload(elLink) {
    removeFocus();
    renderCanvas();
    renderCanvas();
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
}

function onSave() {
    removeFocus();
    renderCanvas();
    var imgContent = gCanvas.toDataURL('image/jpeg');
    saveMeme(imgContent)
}

function onGalleryClick() {
    document.querySelector('.gallery-container').classList.remove('hide');
    document.querySelector('.memes-container').classList.add('hide');
    document.querySelector('.search-page-container').classList.add('hide');
    document.querySelector('.editor-container').classList.add('hide');
}

function onMemesClick() {
    document.querySelector('.memes-container').classList.remove('hide');
    document.querySelector('.gallery-container').classList.add('hide');
    document.querySelector('.editor-container').classList.add('hide');
    renderMemes()
}

function onImgClick(el, id) {
    gIsImgClicked = true;
    document.querySelector('.editor-container').classList.toggle('hide');
    document.querySelector('.search-page-container').classList.add('hide');
    document.querySelector('.gallery-container').classList.toggle('hide');
    onImgChange(el, id);
    setTimeout(() => {
        gIsImgClicked = false;
    }, 100);
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
    getSelectedLine().isFocus = false;
    switchSelectedLine();
    getSelectedLine().isFocus = true;
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
        if (line.isFocus) {
            drawRectAroundTxt(line.x, line.y)
            console.log('works!');
        }
    });
}


function drawStickers() {
    var stickers = getStickers();
    stickers.forEach(sticker => {
        drawImg(sticker.element, sticker.x, sticker.y);
        if (sticker.isFocus) drawRectAroundTxt(line.x, line.y)
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

function drawImg(img, x, y) {
    var stickerSize = (gCanvas.width / 5)
    gCtx.drawImage(img, x - 25, y - 25, stickerSize, stickerSize)
}

function drawImgFromUrl(imgUrl, x, y) {
    var img = new Image;
    img.src = imgUrl;
    gCtx.drawImage(img, x - 25, y - 25, 50, 50)
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


/* Mouse Clicks */

function onMouseDown(ev) {
    gIsMouseDown = true;
    const { offsetX, offsetY } = ev;
    if (isOnItem(offsetX, offsetY)) {
        gIsOn = true;
        changeCursor(1);
    }
}

function changeCursor(isShow) {
    if (!gCanvas) return;
    (isShow) ? gCanvas.classList.add('pointer') : gCanvas.classList.remove('pointer');
}

function onMouseMove(ev) {
    const { offsetX, offsetY } = ev;
    if (isOnItem(offsetX, offsetY)) {
        changeCursor(1);
    } else if (!gIsMouseDown) {
        changeCursor(0);
    }
    if (!gIsOn) return;
    moveItem(offsetX, offsetY);
}

function onMouseUp(ev) {
    changeCursor(0);
    gIsMouseDown = false;
    gIsOn = false;
}

/* Touch Events */


function onTouchStart(ev) {
    ev.preventDefault();
    var offsetX = ev.touches[0].pageX - ev.touches[0].target.offsetLeft;
    var offsetY = ev.touches[0].pageY - ev.touches[0].target.offsetTop;
    if (isOnItem(offsetX, offsetY)) gIsOn = true;
}

function onTouchMove(ev) {
    ev.preventDefault();
    if (!gIsOn) return;
    var offsetX = ev.touches[0].pageX - ev.touches[0].target.offsetLeft;
    var offsetY = ev.touches[0].pageY - ev.touches[0].target.offsetTop;
    moveItem(offsetX, offsetY);
}

function onTouchEnd(ev) {
    ev.preventDefault();
    gIsOn = false;
}


/* Search Funcs */

function renderSearchResult(keyword) {
    var imgs = getMemsImgs()
    var strHtmls;
    var strHtmls = imgs.map(img => {
        var found = img.keywords.find(Imgkeyword => Imgkeyword === keyword);
        if (found) return ` <img src="img/${img.id}.jpg" alt="" onclick="onImgClick(this,${img.id})">`
    }).join('');
    if (!strHtmls) strHtmls = 'No images found..';
    document.querySelector('.search-page-container').innerHTML = strHtmls
}

function addSrcListener() {
    var input = document.querySelector('.search-input');
    input.addEventListener('input', function () {
        var val = input.value.toLowerCase();
        onSearch(val);
    })
    input.addEventListener('blur', function () {
        setTimeout(() => {
            if (gIsImgClicked) document.querySelector('.search-page-container').classList.add
            else onGalleryClick();
        }, 100);
    })
}

/* Drop & Drop Stickers Funcs */


function DragDropSticker() {
    var draggedItem;
    document.querySelector('.stickers-container').addEventListener('dragstart', function (e) {
        toggleDragModal()
        draggedItem = e.target;
        setTimeout(() => {
            toggleDragModal()
        }, 1000);
    });

    gCanvas.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    gCanvas.addEventListener('drop', function (e) {
        e.preventDefault();
        var { offsetX, offsetY } = e;
        drawImg(draggedItem, offsetX, offsetY);
        addSticker(offsetX, offsetY, draggedItem);
    });

}

function toggleDragModal() {
    document.querySelector('.drag-modal').classList.toggle('hide');
}
