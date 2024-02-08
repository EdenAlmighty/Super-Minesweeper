'use strict'

const MINE = '💣'
const NUM = 0
const EMPTY = ''
const MARKED = '🚩'
var gNegCounter = 0
var gMines = []
var gBoard
var gTimerInterval
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

    gGame.isOn = true
    // startTimer()
    gBoard = buildBoard()
    createMines(gBoard)
    loopSetMinesNegsCount(gBoard)
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
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            const className = `hidden cell-${i}-${j}`
            // console.log(cell.mineAroundCount);
            strHTML += `<td data-i=${i} data-j=${j} class="${className}" oncontextmenu="onCellRightClick(event, ${i}, ${j}, '${board}')" onclick="onCellClicked(this, ${i}, ${j})">`
            // document.querySelector('.hidden').oncontextmenu = function() {
            //     alert('yoo')
            // }
            if (cell.isMine) strHTML += MINE;
            else if (cell.mineAroundCount > 0) strHTML += cell.mineAroundCount
            else if (cell.mineAroundCount === 0) strHTML += EMPTY
            else if (cell.isMarked) {

                strHTML += `<td oncontextmenu="onCellRightClick(event, ${i}, ${j})"">`
            }
            strHTML += `</td>`

        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    // console.log(setMinesNegsCount(board))
}

function onCellRightClick(event, i, j, board) {
    event.preventDefault();
    var elCell = gBoard[i][j]
    if (elCell.isShown) return
    elCell.isMarked = !elCell.isMarked

    if (elCell.isMarked) {
        gGame.markedCount - 1
        elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.innerHTML = elCell.mineAroundCount === 0 ? EMPTY : elCell.mineAroundCount
        // gGame.markedCount--

    }

    if (!elCell.isMarked) {
        elCell.innerHTML = `${MARKED}`
        gGame.markedCount++
        // elCell.innerHTML = `${EMPTY}`
        // elCell.classList.remove('hidden')
        elCell.isMarked = true
    }

    document.querySelector('span.flags').innerHTML = gGame.markedCount
    console.log(gGame.markedCount);
    console.log(elCell.isMarked);
    // alert('hi')
    // console.log(board[i][j])
}

function onCellClicked(elCell, cellI, cellJ) {
    startTimer()

    elCell = gBoard[cellI][cellJ]
    if (elCell.isMarked) {
        return
    }
    if (elCell.isMine) {
        renderCell(cellI, cellJ)
        gameOver()
        return
    }

    if (!elCell.isMine) {
        renderCell(cellI, cellJ)
        expandShown(cellI, cellJ)
    }
}

function setMinesNegsCount(cellI, cellJ, board) {
    var counter = 0
    // var emptyCells = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            // var currCell = board[i][j]
            if (board[i][j].isMine) {
                counter++
            }
        }
    }
    console.log(counter);
    return counter
}

function loopSetMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var numOfNeighbors = setMinesNegsCount(i, j, board)
            // console.log(numOfNeighbors);
            board[i][j].mineAroundCount = numOfNeighbors
        }
    }
    return numOfNeighbors
}



function expandShown(cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue


            if (gBoard[i][j].isMine || gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isShown) continue


            gBoard[i][j].isShown = true
            renderCell(i, j)

            // debugger
            // var numOfNeighbors = setMinesNegsCount(i, j, board)
            // expandShown(board, i, j)
        }


    }
}

function gameOver() {
    gGame.isOn = false

}

function renderCell(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.remove('hidden')
}


function startTimer() {

    if(gTimerInterval) clearInterval(gTimerInterval)

    var timePast = gGame.secsPassed

    var startTime = Date.now()

    // if(!gGame.isOn){
    // gGame.isOn = true
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime
        const seconds = getFormatSeconds(timeDiff)
        // const milliseconds = getFormatMilliSeconds(timeDiff)

        document.querySelector('span.seconds').innerText = seconds
        // document.querySelector('span.millie-seconds').innerText = seconds
    }, 10);

    
}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return seconds
}

// function getFormatMilliSeconds() {

// }