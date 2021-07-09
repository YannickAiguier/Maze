class Box {
    constructor(x, y, mazeWidth, mazeHeight) {
        this.x = x;
        this.y = y;
        this.mazeWidth = mazeWidth;
        this.mazeHeight = mazeHeight;
        this.possibleNeighbors = new Array();
    }

    addNeighbor(x, y) {
        this.possibleNeighbors.push([x, y]);
    }

    hasPossibleNeighbors() {
        return this.possibleNeighbors.length > 0;
    }

    chooseNeighbor() {
        // tirage aléatoire de l'indice de la case choisie dans possibleNeighbors
        //console.log((this.possibleNeighbors.length));
        let nb = this.getRandomInt(this.possibleNeighbors.length);
        return this.possibleNeighbors[nb];

        // dans un premier temps retour du premier voisin
        // console.log("possibleNeighbors :");
        // console.table(this.possibleNeighbors);
        // return [this.possibleNeighbors[0]];
    }

    getRandomInt(max) {
        let result = Math.floor(Math.random() * max);
        if (result < max) {
            return result;
        } else {
            return max - 1;
        }
    }

    removeNeighbors() {
        this.possibleNeighbors.length = 0;
    }
}

module.exports = Box;