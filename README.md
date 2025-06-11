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
const CalculateTravailPath = function (origin, destination) {

    // Creates a node object with its current position and parent
    const CreateNode = function (position, parent) {
        return { position, parent };
    };

    const queue = [CreateNode(origin, null)];
    const allElements = [origin];

    let result = null;

    while (queue.length > 0) {
        const node = queue.shift();

        if (node.position === destination) {
            result = node;
            break;
        }

        const knightMoves = KnightPosibleMovesFrom(node.position);

        knightMoves.forEach(move => {
            if (allElements.includes(move)) return;
            queue.push(CreateNode(move, node));
            allElements.push(move);
        });
    }

    // Backtrack from the destination to the origin to build the path
    const path = [];
    while (result !== null) {
        path.push(result.position);
        result = result.parent;
    }

    return path.reverse(); // Path is built from destination to origin, so we reverse it
};
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
