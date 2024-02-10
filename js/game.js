'use strict'

const MINE = '💣'
const NUM = 0
const EMPTY = ''

// Game audio
let boom = new Audio('sound/boom.mp3')
let flag = new Audio('sound/flag.mp3')
let lose = new Audio('sound/lose.mp3')
let pop = new Audio('sound/pop.mp3')
let win = new Audio('sound/win.mp3')

var gLivesCounter = 3
var gNegCounter = 0
var gMines = []
var gBoard
var gTimerInterval
var gEmptyPos

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    hideModal()
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    // changeDifficulty(gLevel.SIZE, gLevel.MINES)
    gMines = []
    resetLives()
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log('gMines: ', gMines);
}

function changeDifficulty(size, mines) {
    gLevel = {
        SIZE: size,
        MINES: mines
    }
    return gLevel
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
    changeDifficulty(gLevel.SIZE, gLevel.MINES)
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
    if (!gGame.isOn) return
    const cell = gBoard[i][j]

    if (cell.isShown) return

    if (!cell.isMarked) {
        renderCellFlag(i, j)
        gGame.markedCount++
    } else if (cell.isMarked === true) {
        renderCellFlag(i, j)
        gGame.markedCount--
        cell.isMarked = false

    }
    document.querySelector('span.flags').innerHTML = gGame.markedCount
    checkVictory()
}

// BAD - THIS FUNCTION ERASES THE CURRENT CONTENTS..
function renderCellFlag(cellI, cellJ) {
    const elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`)

    elCell.classList.toggle('flag')

    gBoard[cellI][cellJ].isMarked = !gBoard[cellI][cellJ].isMarked
    elCell.classList.toggle('hidden')
    flag.load()
    flag.play()
    if (elCell.classList.contains('flag')) {
        elCell.innerText = ''
    } else {
        if (elCell.isMine) elCell.innerText = MINE
        // renderCell(cellI,cellJ)
    }

}

function onCellClicked(elCell, cellI, cellJ) {
    // if(elCell.isShown === true) return
    elCell = gBoard[cellI][cellJ]
    if (gGame.shownCount === 0) {
        createMines(gBoard)
        loopSetMinesNegsCount(gBoard)
        elCell.isMine = false
        renderBoard(gBoard)
        startTimer()
    }
    if (!gGame.isOn) return
    if (elCell.isMarked) return
    if (elCell.isShown) return
    if (elCell.isMine) {
        boom.load()
        boom.play()
        document.querySelector('span.lives').innerText = gLivesCounter -= 1
        renderCell(cellI, cellJ)
    }
    pop.load()
    pop.play()
    if (gLivesCounter === 0) {
        revealMines()
    }
    if (elCell.mineAroundCount === 0 && !elCell.isMine) {
        renderCell(cellI, cellJ)
        expandShown(cellI, cellJ)
        checkVictory()
    } else if (!elCell.isMine) {
        gGame.shownCount++
        renderCell(cellI, cellJ)
        elCell.isShown = true
        console.log('mine', gMines.length);
        console.log('marked', gGame.markedCount);
        checkVictory()
    }
    console.log(gGame.shownCount);
    document.querySelector('span.counter').innerText = gGame.shownCount
    checkVictory()
}

function gameOver(isVictory) {
    if (isVictory) {
        // document.querySelector('.emoji emoji--happy').innerText = 'emoji emoji--lose'
        // revealMines(gMines)
        resetLives()
        lose.play()
        document.querySelector('.user-msg').innerText = 'You Lose...'
    } else {
        document.querySelector('.user-msg').innerText = 'YOU WIN!'

        win.play()
    }
    showModal()
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

    if (gLivesCounter === 0) gameOver(true)

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
    // if(!gBoard[cellI][cellJ].isMine) gGame.shownCount++
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
