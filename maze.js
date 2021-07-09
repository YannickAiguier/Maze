//const Box = require("./box");
import {Box} from './box.js';

export class Maze {
    constructor(mazeWidth, mazeHeight) {
        this.mazeWidth = mazeWidth;
        this.mazeHeight = mazeHeight;
        this.boxes = new Array(mazeHeight);
        for (let i = 0; i < mazeHeight; i++) {
            this.boxes[i] = new Array(mazeWidth);
            for (let j = 0; j < mazeWidth; j++) {
                this.boxes[i][j] = new Box(i, j, this.mazeWidth, this.mazeHeight);
            }
        }
        this.visited = new Array(mazeHeight);
        for (let i = 0; i < mazeHeight; i++) {
            this.visited[i] = new Array(mazeWidth);
            for (let j = 0; j < mazeWidth; j++) {
                this.visited[i][j] = false;
            }
        }
    }

    getBox(x, y) {
        return this.boxes[y][x];
    }

    setVisited([x, y]) {
        this.visited[y][x] = true;
    }

    isNotVisited(x, y) {
        return this.visited[y][x] == false;
    }

    isPossible(x, y) {
        if (x >= 0 && x < this.mazeWidth && y >= 0 && y < this.mazeHeight) {
            return (this.visited[y][x] == false);
        }
        return false;
    }

    findPossibleNeighbors(x, y) {
        // pour chaque case adjacente dans l'ordre E S O N (x-1, y / x, y+1 / x+1, y / x, y-1)
        // si box_adjacente.isPossible() alors ajouter box_adjacente à possibleNeighbors
        this.getBox(x, y).removeNeighbors();
        //console.log(this.getBox(x, y).possibleNeighbors);
        if (this.isPossible(x - 1, y)) {
            //console.log("case existante");
            this.getBox(x, y).addNeighbor(x - 1, y);
        } else {
            //console.log("case inexistante");
        }
        if (this.isPossible(x, y + 1)) {
            //console.log("case existante");
            this.getBox(x, y).addNeighbor(x, y + 1);
        } else {
            //console.log("case inexistante");
        }
        if (this.isPossible(x + 1, y)) {
            //console.log("case existante");
            this.getBox(x, y).addNeighbor(x + 1, y);
        } else {
            //console.log("case inexistante");
        }
        if (this.isPossible(x, y - 1)) {
            //console.log("case existante");
            this.getBox(x, y).addNeighbor(x, y - 1);
        } else {
            //console.log("case inexistante");
        }

    }
}