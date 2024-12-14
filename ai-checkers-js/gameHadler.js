// Utility Helpers
const getNextChar = (c, move = 1) => String.fromCharCode(c.charCodeAt(0) + move);

// Gerador de combinações entre letras e números
const combineLettersAndNumbers = (letters, numbers) => {
    return letters.flatMap(letter => numbers.map(number => letter + number));
};

// Classe para tabuleiro de xadrez
class ChessBoard {
    constructor() {
        this.board = {};
        this.turn = "white";
    }

    setPosition(position) {
        this.board = { ...position };
    }

    getPiece(square) {
        return this.board[square] || null;
    }

    isSquareEmpty(square) {
        return !this.board[square];
    }

    movePiece(from, to) {
        if (!this.board[from]) return;

        this.board[to] = this.board[from];
        delete this.board[from];
    }
}

// Classe de movimentação
class ChessMoves {
    static getPawnMoves(square, piece, board) {
        const [letter, number] = [square[0], parseInt(square[1], 10)];
        const direction = piece[0] === "w" ? 1 : -1;
        const possibleMoves = [];

        const forward = `${letter}${number + direction}`;
        if (board.isSquareEmpty(forward)) {
            possibleMoves.push(forward);
        }

        const captures = [getNextChar(letter, -1), getNextChar(letter, 1)]
            .map(l => `${l}${number + direction}`)
            .filter(target => board.getPiece(target)?.[0] !== piece[0]);

        possibleMoves.push(...captures);
        return possibleMoves;
    }

    static getKingMoves(square, board) {
        const [letter, number] = [square[0], parseInt(square[1], 10)];
        const moves = [];

        for (let l = -1; l <= 1; l++) {
            for (let n = -1; n <= 1; n++) {
                if (l === 0 && n === 0) continue;

                const target = `${getNextChar(letter, l)}${number + n}`;
                if (board.isSquareEmpty(target) || (board.getPiece(target)?.[0] !== board.getPiece(square)?.[0])) {
                    moves.push(target);
                }
            }
        }

        return moves;
    }

    static getMoves(piece, square, board) {
        if (!piece) return [];
        const type = piece[1].toLowerCase();

        switch (type) {
            case "p":
                return this.getPawnMoves(square, piece, board);
            case "k":
                return this.getKingMoves(square, board);
            default:
                return [];
        }
    }
}

// Exemplo de uso
const board = new ChessBoard();
board.setPosition({
    "e2": "wp",
    "e7": "bp",
    "d1": "wK",
    "d8": "bK",
});

const pawnMoves = ChessMoves.getPawnMoves("e2", "wp", board);
console.log("Movimentos possíveis do peão em e2:", pawnMoves);

const kingMoves = ChessMoves.getKingMoves("d1", board);
console.log("Movimentos possíveis do rei em d1:", kingMoves);


