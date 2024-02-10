'use strict'

const MINE = '💣'
const NUM = 0
const EMPTY = ''
// const MARKED = '🚩'

var gLivesCounter = 3

console.log(gLivesCounter);
var gNegCounter = 0
var gMines = []
var gBoard
var gTimerInterval
var gEmptyPos
var gLevel = {
    SIZE: 8,
    MINES: 10
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    gBoard = buildBoard()
    // createMines(gBoard)
    // loopSetMinesNegsCount(gBoard)
    resetLives()
    renderBoard(gBoard)
    gGame.isOn = true
    console.log('gMines: ', gMines);
}

function createMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        createMine(board)
    }
    console.log(gMines);
}

function createMine(board) {
    const emptyPos = getEmptyPos(board)
    if (!emptyPos) return
    const mine = {
        location: {
            i: emptyPos.i,
            j: emptyPos.j,
        },
    }
    gMines.push(mine)
    board[mine.location.i][mine.location.j].isMine = true
}

function getEmptyPos() {
    gEmptyPos = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isMine) {
                gEmptyPos.push({ i, j })
            }
        }
    }

    const randIdx = getRandomIntInclusive(0, gEmptyPos.length - 1)

    return gEmptyPos[randIdx]
}

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
    document.querySelector('span.lives').innerText = gLivesCounter
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            const className = `hidden cell-${i}-${j}`
            strHTML += `<td data-i=${i} data-j=${j} class="${className}" oncontextmenu="onCellRightClick(event, ${i}, ${j}, '${board}')" onclick="onCellClicked(this, ${i}, ${j})">`

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
}

function onCellRightClick(event, i, j, board) {
    event.preventDefault();
    // if(gGame.isOn) return
    var elCell = event
    // const className = `flag cell-${i}-${j}`
    // strHTML += `<td data-i=${i} data-j=${j} class="${className}">`
    // const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)

    if (gBoard[i][j].isShown) return
    
    // elCell.classList.remove('hidden')
    // gBoard[i][j].isMarked = !gBoard[i][j].isMarked

    if (!gBoard[i][j].isMarked) {
        renderCellFlag(i,j)
        // elCell.classList.remove('cell')
        // elCell.innerHTML = `${MARKED}`
        gGame.markedCount++
        // elCell.innerHTML = `${EMPTY}`
        // elCell.classList.remove('hidden')
        // gBoard[i][j].isMarked = true
    } else if (gBoard[i][j].isMarked === true) {
        // renderCellFlag(i,j)
        renderCellFlag(i,j)
        // renderCell(i,j)
        gGame.markedCount - 1
        gBoard[i][j].isMarked = false
        // elCell = document.querySelector(`.cell-${i}-${j}`)
        
    }


    document.querySelector('span.flags').innerHTML = gGame.markedCount
    console.log(gGame.markedCount);
    console.log(gBoard[i][j].isMarked);
    // alert('hi')
    // console.log(board[i][j])
    // console.log((elCell.isMarked));
}
function renderCellFlag(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    // elCell.classList.remove('cell')
    // elCell.classList.add('flag')
    elCell.classList.toggle('flag')
    elCell.classList.toggle('hidden')
    // elCell.innerText = ''
    gBoard[cellI][cellJ].isMarked = true
    // elCell.classList.toggle('hidden')

    if(elCell.classList.contains('flag')){
        elCell.innerText = ''
    } else {
        if (elCell.isMine) elCell.innerText = MINE
    }

}

function onCellClicked(elCell, cellI, cellJ) {
    elCell = gBoard[cellI][cellJ]
    if (gGame.shownCount === 0) {
        createMines(gBoard)
        loopSetMinesNegsCount(gBoard)
        elCell.isMine = false
        renderBoard(gBoard)
        startTimer()
    }
    if (elCell.isMarked) return
    if (elCell.isShown) return
    if (elCell.isMine) {
        document.querySelector('span.lives').innerText = gLivesCounter -= 1
        renderCell(cellI, cellJ)
    }

    if (gLivesCounter === 0) {
        revealMines()
        gameOver(checkVictory)

    }

    if (elCell.mineAroundCount === 0 && !elCell.isMine) {
        renderCell(cellI, cellJ)
        expandShown(cellI, cellJ)
        checkVictory(false)

    } else if (!elCell.isMine) {
        gGame.shownCount++
        renderCell(cellI, cellJ)
        elCell.isShown = true
        console.log('mine', gMines.length);
        console.log('marked', gGame.markedCount);
        checkVictory(false)
    }
    console.log(gGame.shownCount);
    document.querySelector('span.counter').innerText = gGame.shownCount

}



function gameOver(isVictory) {
    if (isVictory) {
        // revealMines(gMines)
        resetLives()
        console.log('BOOOMM!!');

    } else {
        console.log('victoryyyyyyyyyyyyyyyyy')
    }
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gMines = []

}

function resetLives() {
    gLivesCounter = 3
}

function revealMines() {
    for (var i = 0; i < gMines.length; i++) {
        renderCell(gMines[i].location.i, gMines[i].location.j)

        // console.log(`(${gMines[i].location.i},${gMines[i].location.j})`);
    }
}

function checkVictory() {
    if (gGame.shownCount >= (gBoard.length ** 2 - gMines.length)) gameOver(false)

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
            if (gBoard[i][j].isMine ||
                gBoard[i][j].isMarked) continue
            if (gBoard[i][j].isShown) continue
            gBoard[i][j].isShown = true
            if (gBoard[i][j].mineAroundCount === 0) expandShown(i, j)
            renderCell(i, j)
            gGame.shownCount++

        }
    }
}


function renderCell(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)
    elCell.classList.remove('hidden')
}




function startTimer() {

    if (gTimerInterval) clearInterval(gTimerInterval)

    var timePast = gGame.secsPassed

    var startTime = Date.now()
    // if(!gGame.isOn){
    // gGame.isOn = true
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime
        const seconds = getFormatSeconds(timeDiff)

        document.querySelector('span.seconds').innerText = seconds
    }, 10);


}

function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return seconds
}
