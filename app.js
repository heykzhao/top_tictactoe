"use strict";

const Player = (name, marker) => {
    return {name, marker};
};

const gameBoard = (() => {
    let board = ["","","","","","","","",""]
    
    const resetBoard = () => {
        console.log("Reset");
        board = ["","","","","","","","",""]
    };

    return {board, resetBoard};
})();

const displayController = (() => {

    // Display board into each div
    const gridSquares = document.querySelectorAll(".square");
    const refreshGrid = () => {
        gridSquares.forEach((square) => {
            square.innerHTML = gameBoard.board[square.getAttribute("data-index")];
            if (square.innerHTML == "X") {
                square.classList.add("player-1-color");
            } else if (square.innerHTML == "O") {
                square.classList.add("player-2-color");
            }
        })
    };
    return {refreshGrid};
})();

displayController.refreshGrid();
