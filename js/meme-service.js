'use strict';

var gKeywords = { 'happy': 12, 'funny puk': 1 };

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
            txt: 'I never eat Falafel',
            size: 48, align: 'left',
            color: 'red',
            lineW: 2,
            font: 'Impact',
            strokeColor: 'black',
            fillColor: 'white',
            x: 225,
            y: 48
        },
        // {
        //     txt: 'Until.. on vacation!',
        //     size: 48, align: 'left',
        //     color: 'red',
        //     lineW: 2,
        //     font: 'Impact',
        //     strokeColor: 'black',
        //     fillColor: 'white',
        //     x: 225,
        //     y: 425
        // }
    ]
};


function changeImg(id) {
    gMeme.selectedImgId = id;
}

function getMemeText() {
    return gMeme.lines[0].txt;
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