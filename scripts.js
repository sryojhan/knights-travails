
const chessBoard = document.querySelector('.chess-board');
const horse = document.querySelector('#horse');

let inTraversal = false;
let currentPosition = -1;

const PopulateChessBoard = function () {


    const CreateChessSquare = function (idx) {


        const col = idx % 8;
        const row = Math.floor(idx / 8);

        const square = document.createElement('div');
        square.classList.add('chess-square');

        const color = (col + row) % 2 === 0 ? 'white' : 'black';
        square.classList.add(color);


        square.addEventListener('click', () => {
            OnSquareClicked(idx)
        });


        chessBoard.append(square);
    }


    for (let i = 0; i < 64; i++)
        CreateChessSquare(i);

}

PopulateChessBoard();



const OnSquareClicked = function (idx) {

    BeginTravail(idx);
}

const sleep = function (ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

const KnightPosibleMovesFrom = function (origin) {

    const directions = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];

    const col = origin % 8;
    const row = Math.floor(origin / 8);

    const moves = [];

    directions.forEach((dir) => {

        const newPos = [col + dir[0], row + dir[1]];

        if (newPos[0] < 0 || newPos[0] >= 8 || newPos[1] < 0 || newPos[1] >= 8) return;

        const newPosIdx = newPos[1] * 8 + newPos[0];

        moves.push(newPosIdx);
    });

    return moves;
}


const CreateNode = function (position, parent) {
    return {
        position, parent
    }
}

const TravailPath = function (initialPosition, destination) {

    const queue = [CreateNode(initialPosition, null)];

    let result = null;

    while (queue.length > 0) {

        const node = queue.shift();

        if (node.position === destination) {

            result = node;
            break;
        }

        const knightMoves = KnightPosibleMovesFrom(node.position);

        knightMoves.forEach(moves => {

            queue.push(CreateNode(moves, node));
        });
    }

    const path = [];

    while (result !== null) {

        path.push(result.position);
        result = result.parent;
    }

    return path.reverse();
}

const BeginTravail = async function (destination) {

    if(inTraversal) return;

    inTraversal = true;

    SetTargetSquare(destination);

    const path = TravailPath(currentPosition, destination);

    for (const position of path) {

        ColorChessSquare(position);
        MoveHorseToSquare(position);

        if (position !== destination)
            await sleep(1000);
    }

    ClearSelectedSquares(path);
    RemoveTargetSquare(destination);

    inTraversal = false;
}

const MoveHorseToSquare = function (idx) {

    currentPosition = idx;
    chessBoard.children[idx].append(horse);
}

const PrintPath = function (path) {

    let str = "";

    path.forEach((position) => {

        const col = position % 8;
        const row = Math.floor(position / 8);

        str += `[ ${col}, ${row} ]`
    });

    console.log(str);
}

const ColorChessSquare = function (idx) {

    chessBoard.children[idx].classList.add('selected');
}

const ClearSelectedSquares = function (path) {

    path.forEach((position) => {

        chessBoard.children[position].classList.remove('selected');
    });
}

const SetTargetSquare = function (idx) {

    chessBoard.children[idx].classList.add('target');
}

const RemoveTargetSquare = function (idx) {

    chessBoard.children[idx].classList.remove('target');
}

const InitialiseHorse = function () {

    const randomInitialPosition = Math.floor(Math.random() * 64);
    MoveHorseToSquare(randomInitialPosition);

    horse.classList.remove('hidden');
}
InitialiseHorse();