// les variables du labyrinthe : largeur, hauteur, tableau représentant le labyrinthe, coordonnées de la sortie
let mazex = 7;
let mazey = 6;
let maze = new Array();
let exitY = 2;
let exitX = 4;

// les variables du programme
// la position du personnage
let x = 0;
let y = 0;

let gx = -1;
let gy = -1;

// les tableaux des cases visitées et à visiter
let visited = new Array();
let toVisit = new Array();

// début du programme : création du labyrinthe, départ de la case [y, x], on l'ajoute à visited
createMaze();
visited.push([y, x]);

while (maze[y][x] != 'G') {
    let xx = x - 1;
    if (xx >= 0 && xx < mazex) {
        if (maze[y][xx] == 'G') {
            gx = xx;
            gy = y;
        } else if (maze[y][xx] != 'M' && hasNotBeenVisited(y, xx)) {
            toVisit.push([y, xx]);
            console.log("Add x to visit");
            console.log(toVisit);
        }
    }
    xx = x + 1;
    if (xx >= 0 && xx < mazex) {
        if (maze[y][xx] == 'G') {
            gx = xx;
            gy = y;
        } else if (maze[y][xx] != 'M' && hasNotBeenVisited(y, xx)) {
            toVisit.push([y, xx]);
            console.log("Add x to visit");
            console.log(toVisit);
        }
    }
    let yy = y - 1;
    if (yy >= 0 && yy < mazey) {
        if (maze[yy][x] == 'G') {
            gx = x;
            gy = yy;
        } else if (maze[yy][x] != 'M' && hasNotBeenVisited(yy, x)) {
            toVisit.push([yy, x]);
            console.log("Add y to visit");
            console.log(toVisit);
        }
    }
    yy = y + 1;
    if (yy >= 0 && yy < mazey) {
        if (maze[yy][x] == 'G') {
            gx = x;
            gy = yy;
        } else if (maze[yy][x] != 'M' && hasNotBeenVisited(yy, x)) {
            toVisit.push([yy, x]);
            console.log("Add y to visit");
            console.log(toVisit);
        }
    }
    
    if (gx == -1) {
        moveTo(toVisit[toVisit.length - 1][0], toVisit[toVisit.length - 1][1]);
        visited.push(toVisit[toVisit.length - 1]);
        toVisit.pop();
    } else {
        visited.push([gy, gx]);
        moveTo(gy, gx);
    }
    console.log(visited);
}
console.log("Trouvé G en " + gy + ", " + gx);

/**
 * fonction qui assigne les nouvelles coordonnées
 * 
 * @param {int} newX 
 * @param {int} newY 
 */
function moveTo(newY, newX) {
    x = newX;
    y = newY;
}

function hasNotBeenVisited(y, x) {
    for(let i = 0; i < visited.length; i++) {
        if (visited[i][0] == y && visited[i][1] == x) {
            return false;
        }
    }
    return true;
}

/**
 * fonction qui crée la labyrinthe
 */
 function createMaze() {
    maze = new Array(mazey);

    // construction du tableau labyrinthe
    for (let i = 0; i < mazey; i++) {
        maze[i] = new Array(mazex);
    }

    // positionnement des murs et de la sortie
    maze[0][1] = 'M';
    maze[1][1] = 'M';
    maze[2][1] = 'M';
    maze[4][1] = 'M';
    maze[5][1] = 'M';
    maze[1][3] = 'M';
    maze[2][3] = 'M';
    maze[4][3] = 'M';
    maze[1][4] = 'M';
    maze[3][4] = 'M';
    maze[3][5] = 'M';
    maze[5][5] = 'M';
    maze[1][6] = 'M';
    maze[exitY][exitX] = 'G';
}