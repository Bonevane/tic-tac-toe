const Gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];
    
    const getBoard = () => board;
    const resetBoard = () => board.fill("");
    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    const checkWinner = () => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes("") ? null : "Tie";
    };
    
    return { getBoard, resetBoard, placeMarker, checkWinner };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (function () {
    let players = [Player("Player 1", "X"), Player("Player 2", "O")];
    let currentPlayer = players[0];
    let gameActive = true;
    
    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };
    
    const playRound = (index) => {
        if (!gameActive || !Gameboard.placeMarker(index, currentPlayer.marker)) return;
        
        DisplayController.updateBoard();

        let winner = Gameboard.checkWinner();
        if (winner) {
            gameActive = false;
            DisplayController.showResult(winner === "Tie" ? "It's a Tie!" : `${currentPlayer.name} Wins!`);
        } else {
            switchPlayer();
        }

        DisplayController.showResult(`${currentPlayer.marker}'s Turn!`);
    };
    
    const restartGame = () => {
        Gameboard.resetBoard();
        currentPlayer = players[0];
        gameActive = true;
        DisplayController.updateBoard();
        DisplayController.clearResult();
        DisplayController.showResult(`${currentPlayer.marker}'s Turn!`);    
    };
    
    return { playRound, restartGame, getCurrentPlayer: () => currentPlayer };
})();

const DisplayController = (function () {
    const boardElement = document.getElementById("board");
    const resultElement = document.getElementById("result");
    const restartButton = document.getElementById("restart");
    
    const updateBoard = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => GameController.playRound(index));
            boardElement.appendChild(cellElement);
        });
    };
    
    const showResult = (message) => {
        resultElement.textContent = message;
    };
    
    const clearResult = () => {
        resultElement.textContent = "";
    };
    
    restartButton.addEventListener("click", () => {
        GameController.restartGame();
        updateBoard();
    });
    
    return { updateBoard, showResult, clearResult };
})();

DisplayController.updateBoard();