'use strict';

const STORAGE_MEMES_KEY = 'memesDB';

var gKeywords = {
    'happy': 0,
    'dogs': 0,
    'trump': 0,
    'fun': 0,
    'baby': 0,
    'dog': 0,
    'cat': 0,
    'animals': 0,
    'obama': 0,
    'history': 0,
    'kid': 0
};
var gNextId = 2;
var gMemeNextId = 1;
var gUserMemes = [];
var gImgs = [
    {
        id: 1, url: 'img/1.jpg', keywords: ['trump']
    },
    {
        id: 2, url: 'img/2.jpg', keywords: ['dogs', 'fun']
    },
    {
        id: 3, url: 'img/3.jpg', keywords: ['baby', 'dog', 'animals']
    },
    {
        id: 4, url: 'img/4.jpg', keywords: ['cat', 'animals']
    },
    {
        id: 5, url: 'img/5.jpg', keywords: ['baby', 'funny']
    },
    {
        id: 6, url: 'img/6.jpg', keywords: ['history']
    },
    {
        id: 7, url: 'img/7.jpg', keywords: ['baby', 'funny']
    },
    {
        id: 8, url: 'img/8.jpg', keywords: ['funny']
    },
    {
        id: 9, url: 'img/9.jpg', keywords: ['kid', 'funny']
    },
    {
        id: 10, url: 'img/10.jpg', keywords: ['obama']
    }
];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    selectedItemIdx: null,
    lines: []
};


/* Get Funcs */

function getMemsImgs(){
    return gImgs
}

function getImgs() {
    return gImgs;
}

function getMemeTextByIdx(idx) {
    return gMeme.lines[idx].txt;
}
function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}
function getSelectedImgUrl() {
    var img = gImgs.find(img => img.id === gMeme.selectedImgId);
    return img.url;
}

function getImgUrlById(id) {
    return gImgs.find(img => img.id === gMeme[id]);
}

function getLines() {
    return gMeme.lines;
}


/* Local Util Funcs */

function isOutOfCanvas(dir, line) {
    var txtWidth = gCtx.measureText(line.txt).width;
    if (dir === 'right' && line.x + txtWidth / 2 > gCanvas.width - 4) return true;
    if (dir === 'right' && line.x - txtWidth / 2 < 4) return true;
    return false;
}


function drawRectAroundTxt(x, y) {
    var selectedLine = getSelectedLine();
    var txtMeasure = gCtx.measureText(selectedLine.txt);
    var height = selectedLine.size * 1.286;
    var yPos = y - height / 1.1 + 10;
    gCtx.strokeRect(x - (txtMeasure.width / 2) - 10, yPos, txtMeasure.width + 20, height - 6);
}

function isOnText(x, y) {
    var locs = gMeme.lines.map((line, idx) => {
        var txtMeasure = gCtx.measureText(line.txt);
        var txtWidth = txtMeasure.width;
        var height = line.size * 1.286;
        return { x: line.x, y: line.y, txtWidth, height, id: line.id, idx }
    });
    var res;
    locs.forEach(line => {
        if (x >= line.x - line.txtWidth / 2 && x <= line.x + line.txtWidth / 2 && y <= line.y && y > line.y - line.height) {
            if (!gIsMouseDown) gMeme.selectedItemIdx = line.idx;
            return res = true;
        }
    });
    return res;
}

/* User Memes Funcs */

function saveMeme(img) {
    var meme = { img, id: gMemeNextId++ };
    gUserMemes.push(meme);
    saveToStorage(STORAGE_MEMES_KEY, gUserMemes);
}

/* Change Model Funcs */

function moveItem(x, y) {
    // gMeme.lines[gMeme.selectedItemIdx] = {x,y};
    gMeme.lines[gMeme.selectedItemIdx].x = x
    gMeme.lines[gMeme.selectedItemIdx].y = y
    renderCanvas()
}

function createDefaultLines() {
    var size = (gCanvas.width < 500) ? 38 : 48;
    var lines = [
        {
            id: 1,
            isFocus: false,
            txt: 'First Line Text',
            size,
            align: 'center',
            lineW: 2,
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'white',
            x: gCanvas.width / 2,
            y: size
        },
        {
            id: 2,
            isFocus: false,
            txt: 'Second Line Text',
            size,
            align: 'center',
            lineW: 2,
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'white',
            x: gCanvas.width / 2,
            y: gCanvas.height - 10
        }
    ]
    gMeme.lines = lines;
}


function switchSelectedLine() {
    (gMeme.selectedLineIdx >= gMeme.lines.length - 1) ? gMeme.selectedLineIdx = 0 : gMeme.selectedLineIdx++;
}

function alignChange(lgn) {
    var line = gMeme.lines[gMeme.selectedLineIdx]
    var txtWidth = gCtx.measureText(line.txt).width;
    console.log(txtWidth);
    if (lgn === 'left') line.x = 0 + txtWidth / 2;
    if (lgn === 'right') line.x = gCanvas.width - txtWidth / 2;
    if (lgn === 'center') line.x = gCanvas.width / 2;
}

function changeFont(newFont) {
    var line = gMeme.lines[gMeme.selectedLineIdx];
    line.font = newFont;
}

function addLine(txt, loc) {
    var size = (gCanvas.width < 500) ? 38 : 48;
    var { x, y } = loc
    var newLine = {
        id: gNextId++,
        isFocus: false,
        txt,
        size,
        align: 'center',
        lineW: 2,
        font: 'Impact',
        strokeColor: 'black',
        fillColor: 'white',
        x,
        y
    }
    gMeme.lines.push(newLine)
}

function changeFillColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = color;
}

function changeTxtSize(diff, id) {
    gMeme.lines.find(line => line.id === id) += diff;
}

function removeLine() {
    if (!gMeme.lines.length) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}

function changeTxtLoc(dir, diff) {
    var line = getSelectedLine();
    var changeDir;
    switch (dir) {
        case 'left':
            changeDir = 'x';
            break;
        case 'right':
            changeDir = 'x';
            break;
        case 'down':
            changeDir = 'y';
            break;
        case 'up':
            changeDir = 'y';
            break;
    }
    if (isOutOfCanvas(dir, line)) return;
    line[changeDir] += diff;
}


function changeTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function changeImg(id) {
    gMeme.selectedImgId = id;
}
function changeTxtSize(diff) {
    var line = getSelectedLine();
    line.size = line.size + diff;
}
