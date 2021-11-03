"use strict";

const Player = (name, marker) => {
    return {name, marker};
};


const gameBoard = (() => {
    let board = ["","","","","","","","",""]

    const resetBoard = () => {
        const cleanBoard = ["","","","","","","","",""]
        board = board.splice(0, 9, ...cleanBoard);
        displayController.refreshGrid();
    };

    return {
        board,
        resetBoard
    };
})();

const displayController = (() => {

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

    const resetGrid = () => {
        const resetGridButton = document.querySelector(".reset-button");
        resetGridButton.addEventListener("click", gameBoard.resetBoard);
    }
    resetGrid();
    
    return {
        refreshGrid,
    };
})();
