# ♞ Knight Travails - Shortest Path Visualizer

This project is a visual and interactive solution to the classic **Knight Travails** problem from [The Odin Project](https://www.theodinproject.com). Unlike the original exercise, which is implemented purely in JavaScript, this version features a full **GUI with HTML and CSS** to visualize the knight's movement across a chessboard.

---

## 🎯 Goal

Given a standard chessboard and a knight placed at a random position, the user can click on any square, and the knight (`♞`) will move step by step to the destination, **always following the shortest possible path** according to chess rules.

The knight can be moved again and again by clicking on new squares, allowing for continuous interaction.

---

## 🚀 Live Demo

👉 [View the project live](https://sryojhan.github.io/knights-travails/)  
<!-- Replace '#' with the actual URL of your deployed project (e.g., GitHub Pages, Netlify, etc.) -->

---

## ⚙️ How It Works

This project uses the **Breadth-First Search (BFS)** algorithm to calculate the shortest path between two points on the board, treated as nodes in a graph. Since all knight moves are equally weighted, BFS is the optimal and simplest solution.

### Why BFS?

- A knight has up to **8 possible moves** at any given position.
- Each square can be thought of as a **node** in a graph.
- Each move represents an **edge**.
- BFS explores the graph **level by level**, so the first time it reaches the destination, it's guaranteed to be the shortest path (in number of moves).

---

## 🧠 Algorithm Overview

The core logic is implemented in JavaScript. Each square is treated as a node, and the knight's potential moves are edges in the graph. By using BFS, we explore all positions in increasing distance from the starting point. Once the destination is reached, we backtrack through the `parent` references to reconstruct the shortest path.

```js
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
```

```js
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
```


```js

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

```

---

## 🖱️ How to Use

1. Load the page.
2. A knight appears on a random square.
3. Click any square on the board.
4. The knight will automatically move to it using the shortest path.
5. Once it finishes, you can click again to move to another square.

---

## 🧩 Technologies Used

- **HTML + CSS Grid**: For building the visual chessboard.
- **Vanilla JavaScript**: For logic, pathfinding, and DOM interaction.
- **JSDoc**: Used for code clarity and editor autocomplete.

---

## 🎨 Design

- The knight's movement is rendered in steps for better visual feedback.
- While the knight moves, the path it has been following is highlighted for a clearer vision of the path.

---

## 📌 Notes

- Internally, positions are stored as **linear indices** (`0–63` on an 8×8 board) for easier calculation.
- The knight’s valid moves are calculated with a helper function that checks boundaries.
- The BFS algorithm guarantees the shortest path in terms of moves.

---

## 👤 Author

Developed by **Yojhan Steven García Peña**  
Feel free to connect or check out more of my work!
