// besoin de generator
//const Generator = require("./generator");
import * as Generator from './generator.js';

// Largeur d'abord (BFS) : les possibilités des cases adjacentes sont stockées dans une FILE.
// On va donc continuer par la première analysée => on explore dans le même sens que le test (enfile/défile)

// les variables du labyrinthe : largeur, hauteur, tableau représentant le labyrinthe, coordonnées de la sortie
//let mazex = 7;
//let mazey = 6;
let maze = new Array();
//let exitY = 2;
//let exitX = 4;

// les variables du programme
// la position du personnage
let x = 5;
let y = 5;
let endx = 3;
let endy = 3;
// taille du labyrinthe
const mazeWidth = 18;
const mazeHeight = 26;

// savoir si la case de sortie a été trouvée, et sa position
let foundExit = false;
let foundX = -1;
let foundY = -1;

// les tableaux des cases visitées et à visiter
let visited = new Array();
let toVisit = new Array();

// le nombre détapes pour trouver la sortie
let step = 0;

// le tableau du chemin réel
let myPath = new Array();


///////////////////////////////////
//                               //
// Début du programme principal  //
//                               //
///////////////////////////////////

// Commenter/décommenter le mode de création du labyrinthe voulu

// création depuis le fichier maze.csv
// let mazeMap = readFileSync('maze.csv', 'utf8');
// Papa.parse(mazeMap, {
//     delimiter: ",",
//     complete: function (results) {
//         createMazeFromCsv(results);
//     }
// });
//
// création du labyrinthe initial du sujet du Campus
// let exitY = 2;
// let exitX = 4;
// createMaze();
//
// création du labyrinthe par mon générateur
maze = Generator.generateMaze(x, y, endx, endy, mazeWidth, mazeHeight);
let mazex = maze[0].length;
let mazey = maze.length;

// début du parcours : départ de la case [y, x], on l'ajoute à visited
visited.push([y, x]);

x = 2*x;
y = 2*y;

// mode récursif;
while (!foundExit) {
    step++;
    maze[y][x] = step;
    console.table(maze);

    analyzeBox(y - 1, x);
    analyzeBox(y, x + 1);
    analyzeBox(y + 1, x);
    analyzeBox(y, x - 1);
    if (foundExit) {
        console.table(maze);
        maze[foundY][foundX] = step + 1;
        visited.push([foundY, foundX]);
    } else {
        //console.log(firstInToVisit());
        moveTo(firstInToVisit());
        visited.push(firstInToVisit());
        toVisit.shift();
        //console.table(maze);
        //recursiveMove();
    }
}
console.table(maze);
step++;
console.log("Trouvé G en " + foundY + ", " + foundX);
showExplorePath();
// console.log("Nombre d'étapes pour trouver la sortie :" + step);
// showRealPath();

///////////////////////////////////
//                               //
//  Fin du programme principal   //
//                               //
///////////////////////////////////

/**
 * fonction qui crée le labyrinthe du sujet du Campus
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

/**
 * fonction qui crée le tableau maze représentant le labyrinthe à partir du json créé par papaparse
 * 
 * @param {json} results 
 */
function createMazeFromCsv(results) {
    let csv = results["data"];
    mazex = parseInt(csv[0][0]);
    mazey = parseInt(csv[0][1]);
    if (csv[0][2] != "") {
        x = csv[0][2];
        y = csv[0][3];
    }
    for (let i = 0; i < mazey; i++) {
        maze[i] = csv[i + 1];
    }
}

/**
 * fonction qui analyse la case y,x
 * Si les coordonnées y,x sont à l'intérieur du labyrinthe alors la case est-elle la sortie ?
 * Si oui on le sait et on enregistre ses coordonnées,
 * Si non on l'ajoute à la liste des cases à visiter seulement si ce n'est pas un mur et qu'elle n'a pas déjà été visitée
 * 
 * @param {int} y 
 * @param {int} x 
 */
function analyzeBox(y, x) {
    if (boxInMaze(y, x)) {
        if (boxIsG(y, x)) {
            foundExit = true;
            foundX = x;
            foundY = y;
        } else if (boxIsNotWall(y, x) && hasNotBeenVisited(y, x)) {
            console.log("x, y : " + x + ", " + y);
            toVisit.push([y, x]);
        }
    }
}

/**
 * fonction qui assigne les nouvelles coordonnées
 * 
 * @param {int} newX 
 * @param {int} newY 
 */
function moveTo([newY, newX]) {
    x = newX;
    y = newY;
}

/**
 * fonction qui détermine si les coordonnées y,x sont à l'intérieur du labyrinthe
 * 
 * @param {int} y 
 * @param {int} x 
 * @returns boolean
 */
function boxInMaze(y, x) {
    return (y >= 0 && y < mazey && x >= 0 && x < mazex);
}

/**
 * fontion qui détermine si une case y,x est la destination (=='G')
 * 
 * @param {int} y 
 * @param {int} x 
 * @returns boolean
 */
function boxIsG(y, x) {
    return maze[y][x] == 'G';
}

/**
 * fonction qui détermine si la case n'est pas un mur (!='M')
 * 
 * @param {int} y 
 * @param {int} x 
 * @returns boolean
 */
function boxIsNotWall(y, x) {
    return maze[y][x] != 'M';
}

/**
 * fonction qui détermine si la case y,x n'a pas été visitée (n'est pas dans le tableau visited)
 * 
 * @param {int} y 
 * @param {int} x 
 * @returns boolean
 */
function hasNotBeenVisited(y, x) {
    for (let i = 0; i < visited.length; i++) {
        if (visited[i][0] == y && visited[i][1] == x) {
            return false;
        }
    }
    return true;
}

/**
 * fonction qui renvoie les coordonnées de la première case de la liste des cases à visiter
 * 
 * @returns array[y, x]
 */
function firstInToVisit() {
    return toVisit[0];
}

/**
 * fonction pour afficher le chemin d'exploration
 */
function showExplorePath() {
    let str = "";
    for (let i = 0; i < visited.length; i++) {
        str += ((i + 1) + "(" + visited[i] + "), ");
    }
    console.log(str);
}

function showRealPath() {
    // parcourir le tableau en partant de la destination
    // pour chaque case analyser les cases adjacentes et trouver celle qui a le numéro le moins élevé, c'est la suivante.
    // Ajouter cette case au tableau du chemin réel
    findLesser(foundY, foundX);
    // afficher cette suite de coordonnées
    console.log("Chemin du départ à la destination : ");
    console.table(myPath);
}

/**
 * fonction qui trouve le numéro le moins élevé dans les case adjacentes à la case de coordonnées x, y
 * les coordonnées de cette case sont ajoutées au chemin réel, et on continue de manière récursive en appelant la fonction
 * avec ces nouvelles coordonnées. Jusqu'à avoir les coordonnées de la destination.
 * 
 * @param {int} y 
 * @param {int} x 
 */
function findLesser(y, x) {
    let lesserY = y;
    let lesserX = x;
    if (y == 0 && x == 0) {
        return;
    }
    if (boxInMaze(y, x)) {
        let lesser = maze[y][x];
        if (isComparable(y, x - 1) && isLesser(y, x - 1, y, x)) {
            lesserY = y;
            lesserX = x - 1;
            lesser = maze[y][x - 1];
        }
        if (isComparable(y + 1, x) && maze[y + 1][x] < lesser) {
            lesserY = y + 1;
            lesserX = x;
            lesser = maze[y + 1][x]
        }
        if (isComparable(y, x + 1) && maze[y][x + 1] < lesser) {
            lesserY = y;
            lesserX = x + 1;
            lesser = maze[y][x + 1];
        }
        if (isComparable(y - 1, x) && maze[y - 1][x] < lesser) {
            lesserY = y - 1;
            lesserX = x;
            lesser = maze[y - 1][x];
        }
        myPath.unshift([lesserY, lesserX]);
    }
    findLesser(lesserY, lesserX);
}

/**
 * fonction qui teste si le contenu de la case(x1, y1) est inférieur à celui de la case(x2, y2)
 * 
 * @param {int} y1 
 * @param {int} x1 
 * @param {int} y2 
 * @param {int} x2 
 * @returns boolean
 */
function isLesser(y1, x1, y2, x2) {
    return maze[y1][x1] < maze[y2][x2];
}

function isComparable(y, x) {
    return (boxInMaze(y, x) && maze[y][x] != '' && !isNaN(maze[y][x]));
}