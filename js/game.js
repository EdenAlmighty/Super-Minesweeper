'use strict'

const MINE = '*'
const NUM = '1'
const EMPTY = ' '
var gNegCounter = 0
var gMines = []
var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 3
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
function onInit() {

    gBoard = buildBoard()
    createMines(gBoard)
    renderBoard(gBoard)
    console.table(gBoard);
    console.log('gMines: ', gMines);

}

function createMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        createMine(board)
    }
}

function createMine(board) {
    const mine = {
        location: {
            i: getRandomInt(0, gLevel.SIZE - 1),
            j: getRandomInt(0, gLevel.SIZE - 1),
        },
    }
    gMines.push(mine)
    board[mine.location.i][mine.location.j].isMine = true
    // renderCell(board[mine.location.i][mine.location.j], MINE) 


}
// console.log(createMines(gBoard));
function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                mineAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    // board[1][1].isMine = true
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${className}">${cell}</td>`
            // setMinesNegsCount(cellI, cellJ, board)
        }
        strHTML += '</tr>'
    }
    setMinesNegsCount(board)
    const elBoard = document.querySelector('tbody.board')
    elBoard.innerHTML = strHTML

}

function onCellClicked(elCell, cellI, cellJ) {
    // if(gBoard[cellI][cellJ])
    var location = `${cellI},${cellJ}`
    elCell = gBoard[cellI][cellJ]
    // setMinesNegsCount(cellI, cellJ, gBoard)
    if (elCell.isMine) {
        // renderCell(location, MINE)
        console.log(location, 'elCell: is a mine');
    }
}

function setMinesNegsCount(board) {
    var counter = 0
    for (var i = 0 ; i <= board.length; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = 0 ; j <= board[i].length; j++) {
            if (i === board.length && j === board[i].length) continue
            if (j < 0 || j >= board[i].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                counter++
                board[i][j].mineAroundCount = counter
                console.log(board[i][j].mineAroundCount);
                renderCell(currCell, counter)
            }
        }
    }

    document.querySelector('h2 span.counter').innerText = counter
    console.log(counter);
    return counter
}

