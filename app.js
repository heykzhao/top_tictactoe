"use strict";

const Player = (name, marker) => {
    return {name, marker};
};

const gameBoard = (() => {
    let board = ["","","","","","","","",""];

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
          board[i] = "";
        }
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

    const getGameStatus = () => {
        return gameOver;
    }

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

    const getRound = () => {
        return round;
    }

    const checkWinGame = () => {
        // Indexes on board, if all the same, indicates a win;
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Empty array to push the board[indexes] onto
        let currentBoardSingleRow = [];
        
        for (let i = 0; i < winningConditions.length; i++) {
            for (let j = 0; j < winningConditions[i].length; j++)
            currentBoardSingleRow.push(gameBoard.board[winningConditions[i][j]]);
        }

        // Empty array to push the single row array onto, so that it can match the winning conditions
        let currentBoardMultiRow = [];
        while (currentBoardSingleRow.length) currentBoardMultiRow.push(currentBoardSingleRow.splice(0,3));

        let winningPlayer;
        const allEqual = arr => arr.every( v => v === arr[0] && v !== undefined && v !== "");
        for (let i = 0; i < currentBoardMultiRow.length; i++) {
            if (allEqual(currentBoardMultiRow[i])) {
                let winningMarker = currentBoardMultiRow[i][0];
                let winningCombo = winningConditions[i];
                gameOver = true;
                if (winningMarker === playerX.marker) {
                    winningPlayer = playerX;
                } else if (winningMarker === playerY.marker) {
                    winningPlayer = playerY;
                }
                return {winningPlayer, winningCombo};
            }
        }
    }

    const reset = () => {
        round = 1;
        gameOver = false;
    }

    return {
        getGameStatus,
        currentPlayer,
        playRound,
        getRound,
        checkWinGame,
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
        const whosTurnText = document.querySelector(".whos-turn");
        const resetGameText = document.querySelector(".reset-game-text");
        if (gameController.getGameStatus() === false && gameController.getRound() < 10) {
            whosTurnText.innerHTML = `It's <span class="whos-turn-text">${currentName}'s</span> turn. <br> Select a square to place your <span class="whos-turn-text">${currentMarker}</span> on!`;
        } else if (gameController.getGameStatus() === false && gameController.getRound() === 10) {
            whosTurnText.innerHTML = "Looks like it's a tie... You're both winners!";
            resetGameText.style.display = "block";
        } else {
            let winningPlayerName = gameController.checkWinGame().winningPlayer.name;
            whosTurnText.innerHTML = `Congrats, <span class="whos-turn-text">${winningPlayerName}</span>. You've won!`;
            resetGameText.style.display = "block";
        }
    }
    updateWhosTurn();
    
    const endGame = () => {
        if (gameController.getGameStatus() === true) {
            gridSquares.forEach((square) => {
                square.classList.add("noHover");
            })
            const winningCombo = gameController.checkWinGame().winningCombo;
            gridSquares[winningCombo[0]].classList.add("winning-row");
            gridSquares[winningCombo[1]].classList.add("winning-row");
            gridSquares[winningCombo[2]].classList.add("winning-row");
        } else if (gameController.getGameStatus() === false && gameController.getRound() === 10) {
            gridSquares.forEach((square) => {
                square.classList.add("noHover");
            })
        }
    };

    // Removes and Enables hover depending on if a box is filled
    const disableHover = (e) => {
        e.target.classList.add("noHover");
    }

    const resetSquares = () => {
        gridSquares.forEach((square) => {
            square.classList.remove("noHover");
            square.classList.remove("player-1-color");
            square.classList.remove("player-2-color");
            square.classList.remove("winning-row");
        })
    }

    // Allows individual to put down a marker
    const placeMarker = () => {
        gridSquares.forEach((square) => {
            square.addEventListener('click', gameController.playRound);
            square.addEventListener('click', gameController.checkWinGame);
            square.addEventListener("click", updateWhosTurn);
            square.addEventListener("click", endGame);
            square.addEventListener("click", disableHover);
            square.addEventListener('click', refreshGrid);
        })
    };
    placeMarker();

    // Resets the game board by changing the board array back to all blanks
    const reset = () => {
        const resetGridButton = document.querySelector(".reset-button");
        resetGridButton.addEventListener("click", gameBoard.reset);
        resetGridButton.addEventListener("click", updateWhosTurn);
        resetGridButton.addEventListener("click", resetSquares);
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