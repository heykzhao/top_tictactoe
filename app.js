"use strict";

const Player = (name, marker) => {
    return {name, marker};
};

const gameBoard = (() => {
    let board = ["","","","","","","","",""];

    const reset = () => {
        const cleanBoard = ["","","","","","","","",""];
        board = board.splice(0, 9, ...cleanBoard);
        gameController.reset();
    };

    return {
        board,
        reset,
    };
})();

const gameController = (() => {
    let round = 1;
    let gameOver = false;
    const playerX = Player("Player 1", "X");
    const playerY = Player("Player 2", "O");

    const currentPlayer = () => {
        if (round % 2 === 0) {
            return playerY;
        } else if (round % 2 !== 0) {
            return playerX;
        }
    };

    const playRound = (e) => {
        let currentMarker = currentPlayer().marker;
        let boardIndex = e.target.getAttribute("data-index");
        gameBoard.board.splice(boardIndex,1,currentMarker);
        round++
    }

    const reset = () => {
        round = 1;
        gameOver = false;
    }

    return {
        gameOver,
        currentPlayer,
        playRound,
        reset,
    }

})();

const displayController = (() => {
    const gridSquares = document.querySelectorAll(".square");
    // Display board into each div
    const refreshGrid = () => {
        const gridSquares = document.querySelectorAll(".square");
        gridSquares.forEach((square) => {
            const squareIndex = square.getAttribute("data-index");
            square.innerHTML = gameBoard.board[squareIndex];
            if (square.innerHTML == "X") {
                square.classList.add("player-1-color");
            } else if (square.innerHTML == "O") {
                square.classList.add("player-2-color");
            }
        })
    };
    refreshGrid();

    // Updates text above tictactoe grid, indicating turn and marker
    const updateWhosTurn = () => {
        let currentName = gameController.currentPlayer().name;
        let currentMarker = gameController.currentPlayer().marker;
        // let winnerName = gameController.winningPlayer().name;
        const whosTurnText = document.querySelector(".whos-turn");
        if (gameController.gameOver === false) {
            whosTurnText.innerHTML = `It's <span class="whos-turn-text">${currentName}'s</span> turn. <br> Select a square to place your <span class="whos-turn-text">${currentMarker}</span> on!`;}
        // } else {
        //     whosTurnText.innerHTML = `Congrats, <span class="whos-turn-text">${winnerName}</span>. You've won!`;
        // }
    }
    updateWhosTurn();

    // Removes and Enables hover depending on if a box is filled
    const disableHover = () => {
        const gridSquares = document.querySelectorAll(".square");
        gridSquares.forEach((square) => {
            if (square.innerHTML != "") {
                square.classList.add("noHover");
            }
        })
    }
    const enableHover = () => {
        gridSquares.forEach((square) => {
            square.classList.remove("noHover");
        })
    }
    disableHover();

    // Allows individual to put down a marker
    const placeMarker = () => {
        gridSquares.forEach((square) => {
            square.addEventListener('click', gameController.playRound);
            square.addEventListener("click", updateWhosTurn);
            square.addEventListener('click', refreshGrid);
        })
    };
    placeMarker();

    // Resets the game board by changing the board array back to all blanks
    const reset = () => {
        const resetGridButton = document.querySelector(".reset-button");
        resetGridButton.addEventListener("click", gameBoard.reset);
        resetGridButton.addEventListener("click", updateWhosTurn);
        resetGridButton.addEventListener("click", enableHover);
        resetGridButton.addEventListener("click", refreshGrid);
    }
    reset();
    
    return {
        refreshGrid,
        updateWhosTurn,
        placeMarker,
        reset,
    };
})();