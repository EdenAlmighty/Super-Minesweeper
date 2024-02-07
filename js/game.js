'use strict'

const MINE = '💣'
const NUM = 0
const EMPTY = ''
const MARKED = '🚩'
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
    loopSetMinesNegsCount(gBoard)
    // loopSetMinesNegsCount(gBoard)
    console.log(gBoard);
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
            const cell = {
                mineAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
            // cell = EMPTY
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
            // runGeneration(gBoard)
            var cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" class="${className}">`

            console.log(cell.mineAroundCount);

            // cell = (cell.isMine) ? MINE : EMPTY
            // if (cell.mineAroundCount > 0 && !cell.isMine) cell = cell.mineAroundCount
            // cell = (cell.isMine) ? MINE : cell.mineAroundCount
            if (cell.isMine) strHTML += MINE;
            else if (cell.mineAroundCount > 0) strHTML += cell.mineAroundCount
            // else strHTML += `${cell.mineAroundCount}`
            // if (cell.isMine) cell = MINE
            else if (cell.mineAroundCount === 0) cell += `${EMPTY}`
            else if (cell.isMarked) cell += `${MARKED}`



            strHTML += `</td>`
        }

        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    // console.log(setMinesNegsCount(board))
    // 
}

function onCellClicked(elCell, cellI, cellJ) {
    // if(gBoard[cellI][cellJ])
    var location = `${cellI},${cellJ}`
    elCell = gBoard[cellI][cellJ]
    // setMinesNegsCount(cellI, cellJ, gBoard)


    if (elCell.isMine) {
        console.log(location, 'elCell: is a mine');
    }
}



function setMinesNegsCount(cellI, cellJ, board) {
    var counter = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) {
                counter++
                // continue        
                // console.log(currCell.mineAroundCount);
                // renderCell(currCell, counter)

            }
        }
    }

    document.querySelector('h2 span.counter').innerText = counter
    // console.log('sfs',currCell.mineAroundCount);
    return counter
}


function loopSetMinesNegsCount(board) {
    // const newBoard = copyMat(board)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var numOfNeighbors = setMinesNegsCount(i, j, board)
            // var currCell = board[i][j]
            // if (currCell.isMine) continue

            // if (currCell.mineAroundCount > 0) {
            //     currCell.mineAroundCount = numOfNeighbors
            // }
            console.log(numOfNeighbors);

            board[i][j].mineAroundCount = numOfNeighbors

        }
    }
    // return currCell
}
