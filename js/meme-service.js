'use strict';

const STORAGE_MEMES_KEY = 'memesDB';

var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gNextId = 2;
var gMemeNextId = 1;
var gUserMemes = [];
var gImgs = [
    {
        id: 1, url: 'img/1.jpg', keywords: ['happy']
    },
    {
        id: 2, url: 'img/2.jpg', keywords: ['happy']
    },
    {
        id: 3, url: 'img/3.jpg', keywords: ['happy']
    },
    {
        id: 4, url: 'img/4.jpg', keywords: ['happy']
    },
    {
        id: 5, url: 'img/5.jpg', keywords: ['happy']
    },
    {
        id: 6, url: 'img/6.jpg', keywords: ['happy']
    },
    {
        id: 7, url: 'img/7.jpg', keywords: ['happy']
    },
    {
        id: 8, url: 'img/8.jpg', keywords: ['happy']
    },
    {
        id: 9, url: 'img/9.jpg', keywords: ['happy']
    },
    {
        id: 10, url: 'img/10.jpg', keywords: ['happy']
    }
];
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [
        {
            id: 1,
            isFocus: false,
            txt: 'First Line Text',
            size: 48,
            align: 'center',
            lineW: 2,
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'white',
            x: 225,
            y: 48
        },
        {
            id: 2,
            isFocus: false,
            txt: 'Second Line Text',
            size: 48,
            align: 'center',
            lineW: 2,
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'white',
            x: 225,
            y: 435
        }
    ]
};


/* Get Funcs */

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

/* General Funcs */

function isOutOfCanvas(dir, line) {
    var txtWidth = gCtx.measureText(line.txt).width;
    if (dir === 'right' && line.x + txtWidth / 2 > gCanvas.width - 4) return true;
    if (dir === 'right' && line.x - txtWidth / 2 < 4) return true;
    return false;
}

/* User Memes Funcs */

function saveMeme(img) {
    var meme = { img, id: gMemeNextId++ };
    gUserMemes.push(meme);
    saveToStorage(STORAGE_MEMES_KEY, gUserMemes);
}

/* Change Model Funcs */

function switchSelectedLine() {
    if (gMeme.selectedLineIdx >= gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else {
        gMeme.selectedLineIdx++
    }
}

function changeLinesToDefault() {
    for (let i = 0; i < 2; i++) {
        gDefault1LineLoc
        gMeme.lines[0].y = gDefault1LineLoc.y;
        gMeme.lines[0].x = gDefault1LineLoc.x;
        gMeme.lines[1].y = gDefault2LineLoc.y;
        gMeme.lines[1].x = gDefault2LineLoc.x;
    }
}

function alignChange(lgn) {
    var line = gMeme.lines[gMeme.selectedLineIdx]
    // line.align = lgn;
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
    var { x, y } = loc
    var newLine = {
        id: gNextId++,
        isFocus: false,
        txt,
        size: 48,
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
