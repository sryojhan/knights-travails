//* Global attributes

const chessBoard = document.querySelector('.chess-board');
const horse = document.querySelector('#horse');

const N = 8;

let inTraversal = false;
let currentPosition = -1;



//* Utils
/** 
 * @param {number} idx linear index of the square
 */
const CalculateColAndRow = function (idx) {

    const col = idx % N;
    const row = Math.floor(idx / N);

    return { col, row };
}

/**
 * Promise that waits a time out
 * @param {number} ms time in milliseconds to wait
 */
const Sleep = function (ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

//* Initialisation

/**
 * Programatically creates the board
 */
const PopulateChessBoard = function () {

    const boardSize = N * N;
    for (let idx = 0; idx < boardSize; idx++) {

        const { col, row } = CalculateColAndRow(idx);

        const square = document.createElement('div');
        square.classList.add('chess-square');

        // Checkboard pattern
        const color = (col + row) % 2 === 0 ? 'white' : 'black';
        square.classList.add(color);


        square.addEventListener('click', () => {
            BeginTravail(idx);
        });


        chessBoard.append(square);
    }


    // Change the size of the css grid
    chessBoard.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    chessBoard.style.gridTemplateRows = `repeat(${N}, 1fr)`;
};
PopulateChessBoard();



/**
 * Place the horse at the given location and update the current location index
 * @param {number} idx linear index of the desired location
 */
const MoveHorseToSquare = function (idx) {

    if(currentPosition === idx) return;
    
    currentPosition = idx;
    chessBoard.children[idx].append(horse);
}

/**
 * Place the horse at a random location, and make it visible
 */
const InitialiseHorse = function () {

    const randomInitialPosition = Math.floor(Math.random() * 64);
    MoveHorseToSquare(randomInitialPosition);

    horse.classList.remove('hidden');
};
InitialiseHorse();



//* Pathfinding

/**
 * Calculate all the knight possible moves from a given square position
 * @param {number} origin origin position, in a linear index
 * @returns Array with all possible moves 
 */
const KnightPosibleMovesFrom = function (origin) {

    const directions = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];

    const { col, row } = CalculateColAndRow(origin);

    const moves = [];

    directions.forEach((dir) => {

        const newPos = [col + dir[0], row + dir[1]];

        // Rule out invalid possitions outside of the grid
        if (newPos[0] < 0 || newPos[0] >= 8 || newPos[1] < 0 || newPos[1] >= 8) return;

        //Convert from col and row to index
        const newPosIdx = newPos[1] * 8 + newPos[0];

        moves.push(newPosIdx);
    });

    return moves;
}


/**
 * Calculate the shortest path between two points by knight moves using BFS
 * @param {number} origin origin position as a linear index
 * @param {number} destination destination position as a linear index
 * @returns array with the path of calculated positions (beginning and end included)
 */
const CalculateTravailPath = function (origin, destination) {

    /** Creates a node for a given position. A node contains a value and a predecessor
    * @param {number} position position given as a linear index
    * @param {Node} parent parent node*/
    const CreateNode = function (position, parent) {
        return {
            position, parent
        }
    }


    // Queue with the nodes pending to visit
    const queue = [CreateNode(origin, null)];

    // Array with every position added to the queue, to avoid duplicates
    const allElements = [origin]

    let result = null;

    while (queue.length > 0) {

        // Pop the first element of the queue
        const node = queue.shift();

        // When the element is found, exit the loop
        if (node.position === destination) {

            result = node;
            break;
        }

        // Calculate all possible knight moves from the position
        const knightMoves = KnightPosibleMovesFrom(node.position);

        // Create a node for each calculated position and add it to the queue
        knightMoves.forEach(move => {

            // If the element is already included, discard it
            if (allElements.includes(move)) return;

            // Add the position (and Node) to the queue and positions array
            queue.push(CreateNode(move, node));
            allElements.push(move);
        });
    }

    //! We dont check the result because in this exercise it is guaranteed to have a result


    // Convert out Node linked list into a positions array with the result

    const path = [];

    while (result !== null) {

        path.push(result.position);
        result = result.parent;
    }


    // The path has been built from destination to origin, so we have to reverse it first
    return path.reverse();
}


/**
 * Begin the animation of the horse, moving until it reaches the destination position
 * @param {number} destination destination linear index
 */
const BeginTravail = async function (destination) {

    // Avoid colliding animations. Don't start a new one until we are finished
    if (inTraversal) return;
    inTraversal = true;
    chessBoard.classList.add('traversal');

    // Draw a frame around the destination square
    SetTargetSquare(destination);

    const initialPosition = currentPosition;
    // Calculate the path to follow, given the horse current position and the desired destination
    const path = CalculateTravailPath(initialPosition, destination);


    for (const position of path) {

        // Color the path as the horse moves around the board
        ColorChessSquare(position);
        MoveHorseToSquare(position);

        // Pause so we can follow the path and it doesn't occur in a single frame
        if (position !== initialPosition && position != destination) // Avoid to long wait in the first and last move
            await Sleep(1000);
        else await Sleep(200);
    }

    // Clear the board coloring
    ClearSelectedSquares(path);
    RemoveTargetSquare(destination);

    // End the traversal animation
    chessBoard.classList.remove('traversal');
    inTraversal = false;
}




//* DOM manipulation

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
