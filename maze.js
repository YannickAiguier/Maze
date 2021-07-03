// création du labyrinthe
let mazex = 7;
let mazey = 6;
let maze = new Array(mazey);
for (let i = 0; i < mazey; i++) {
    maze[i] = new Array(mazex);
}
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
maze[2][4] = 'G';

// les variables du programme
let x = 0;
let y = 0;
let gx = -1;
let gy = -1;
let visited = new Array();
let toVisit = new Array();
visited.push([y, x]);
console.log(visited);
console.log(toVisit);

while (maze[y][x] != 'G') {
    for (let xx = x-1; xx < x+2; xx+=2) {
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
    }
    for (let yy = y-1; yy < y+2; yy+=2) {
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
    }
    if (gx == -1) {
        moveTo(toVisit[toVisit.length - 1][0], toVisit[toVisit.length - 1][1]);
        visited.push(toVisit[toVisit.length - 1]);
        toVisit.pop();
    } else {
        moveTo(gy, gx);
    }
    console.log(visited);
}
console.log("Trouvé G en " + gx + ", " + gy);

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