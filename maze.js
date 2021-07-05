// pour lire un fichier
import { table } from 'console';
import { readFileSync } from 'fs';

// pour utiliser papaparse (parse fichier csv)
import Papa from './node_modules/papaparse/papaparse.js';

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

// savoir si la case de sortie a été trouvée, et sa position
let foundExit = false;
let foundX = -1;
let foundY = -1;

// les tableaux des cases visitées et à visiter
let visited = new Array();
let toVisit = new Array();

// le nombre détapes pour trouver la sortie
let step = 0;

//
// Début du programme principal
//

// Commenter/décommenter le mode de création du labyrinthe voulu
// création depuis le fichier maze.csv
let mazeMap = readFileSync('maze.csv', 'utf8');
Papa.parse(mazeMap, {
    delimiter: ",",
    complete: function (results) {
        createMazeFromCsv(results);
    }
});
// création du labyrinthe initial du sujet du Campus
//createMaze();

// début du parcours : départ de la case [y, x], on l'ajoute à visited
visited.push([y, x]);

// mode récursif
recursiveMove();
step++;
console.log("Trouvé G en " + foundY + ", " + foundX);
showPath();
console.log("Nombre d'étapes pour trouver la sortie :" + step);

//
// Fin du programme principal
//

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
 * fontion qui détermine si une case y,x contient la sortie (=='G')
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
 * fonction qui renvoie les coordonnées de la dernière case de la liste des cases à visiter
 * 
 * @returns array[y, x]
 */
function lastInToVisit() {
    return toVisit[toVisit.length - 1];
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

/**
 * fonction pour afficher le chemin d'exploration
 */
function showPath() {
    let str = "";
    for (let i = 0; i < visited.length; i++) {
        str += ((i+1) + "(" + visited[i] +"), ");
    }
    console.log(str);
}

/**
 * fonction récursive d'analyse d'une case
 */
function recursiveMove() {
    step++;
    maze[y][x] = step;

    analyzeBox(y - 1, x);
    analyzeBox(y, x + 1);
    analyzeBox(y + 1, x);
    analyzeBox(y, x - 1);
    if (foundExit) {
        table(maze);
        visited.push([foundY, foundX]);
    } else {
        moveTo(lastInToVisit());
        visited.push(lastInToVisit());
        toVisit.pop();
        table(maze);
        recursiveMove();
    }
}