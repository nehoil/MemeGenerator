'use strict';

var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gNextId = 1;
var gImgs = [
    {
        id: 1, url: 'img/2.jpg', keywords: ['happy']
    },
    {
        id: 2, url: 'img/1.jpg', keywords: ['happy']
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
            align: 'left',
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
            align: 'left',
            lineW: 2,
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'white',
            x: 225,
            y: 435
        }
    ]
};

function switchSelectedLine(){
    if (gMeme.selectedLineIdx >= gMeme.lines.length-1) gMeme.selectedLineIdx = 0;
    else{
        gMeme.selectedLineIdx++
    }
}

function changeTxtSize(diff, id) {
    var line = gMeme.lines.find(line => line.id === id);
    line.size += diff;
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
    line[changeDir] += diff;
}

function changeTxt(txt) {
    var line = gMeme.lines[gMeme.selectedLineIdx];
    line.txt = txt;
}

function changeImg(id) {
    gMeme.selectedImgId = id;
}
function changeTxtSize(diff) {
    var line = getSelectedLine();
    line.size = line.size + diff;
}

function getMemeTextByIdx(idx) {
    return gMeme.lines[idx].txt;
}
function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}
function getSelectedImgUrl() {
    var img = gImgs.find(img => img.id === gMeme.selectedImgId)
    return img.url;
}

function getImgUrlById(id) {
    return gImgs.find(img => img.id === gMeme[id]);
}

function getLines() {
    return gMeme.lines;
}