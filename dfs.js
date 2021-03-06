// Profondeur d'abord (DFS) : les possibilités des cases adjacentes sont stockées dans une PILE.
// On va donc continuer par la dernière analysée => on explore dans le sens inverse du test (empile/dépile)

// pour utiliser table au lieu de console.table (créé automatiquement)
import { table } from 'console';

// pour lire un fichier
import { readFileSync } from 'fs';

// pour utiliser papaparse (parse fichier csv)
import Papa from 'papaparse';

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
// création du labyrinthe initial du sujet du Campus
createMaze();


// analyse de la case de départ (qui analysera les autres par récursivité)
analyzeBox(x, y);
// lorsque la destination a été trouvée affichage du labyrinthe avec le parcours, du chemin d'exploration, du nombre d'étapes et du chemin réel
table(maze);
showExplorePath();
console.log("Nombre d'étapes pour trouver la sortie :" + step);
showRealPath();

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
            step++;
            maze[y][x] = step;
            visited.push([foundY, foundX]);
            console.log("Trouvé G en " + foundY + ", " + foundX);
            return;
        } else if (boxIsNotWall(y, x) && hasNotBeenVisited(y, x) && !foundExit) {
            step++;
            maze[y][x] = step;
            visited.push([y, x]);
            table(maze);
            analyzeBox(y, x - 1);
            analyzeBox(y + 1, x);
            analyzeBox(y, x + 1);
            analyzeBox(y - 1, x);

        }
    }
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
 * fonction pour afficher le chemin d'exploration
 */
function showExplorePath() {
    let str = "";
    for (let i = 0; i < visited.length; i++) {
        str += ((i + 1) + "(" + visited[i] + "), ");
    }
    console.log(str);
}


/**
 * fonction qui affiche le chemin réel du départ à la destination
 */
function showRealPath() {
    // parcourir le tableau en suivant les numéros d'étapes,
    // pour chaque case analyser les cases adjacentes et trouver celle qui a le numéro le plus élevé, c'est la suivante.
    // Ajouter cette case au tableau du chemin réel
    findGreater(0, 0);
    // afficher cette suite de coordonnées
    console.log("Chemin du départ à la destination : ");
    table(myPath);
}

/**
 * fonction qui trouve le numéro le plus élevé dans les case adjacentes à la case de coordonnées x, y
 * les coordonnées de cette case sont ajoutées au chemin réel, et on continue de manière récursive en appelant la fonction
 * avec ces nouvelles coordonnées. Jusqu'à avoir les coordonnées de la destination.
 * 
 * @param {int} y 
 * @param {int} x 
 */
function findGreater(y, x) {
    let greaterY = y;
    let greaterX = x;
    if (y == foundY && x == foundX) {
        return;
    }
    if (boxInMaze(y, x)) {
        let greater = maze[y][x];
        if (boxInMaze(y, x - 1) && isGreater(y, x - 1, y, x)) {
            greaterY = y;
            greaterX = x - 1;
            greater = maze[y][x-1];
        }
        if (boxInMaze(y + 1, x) && maze[y + 1][x] > greater) {
            greaterY = y + 1;
            greaterX = x;
            greater = maze[y + 1][x]
        }
        if (boxInMaze(y, x + 1) && maze[y][x+1] > greater) {
            greaterY = y;
            greaterX = x + 1;
            greater = maze[y][x+1];
        }
        if (boxInMaze(y - 1, x) && maze[y-1][x] > greater) {
            greaterY = y - 1;
            greaterX = x;
            greater = maze[y-1][x];
        }
        myPath.push([greaterY, greaterX]);
    }
    findGreater(greaterY, greaterX);
}

/**
 * fonction qui teste si le contenu de la case(x1, y1) est supérieur à celui de la case(x2, y2)
 * 
 * @param {int} y1 
 * @param {int} x1 
 * @param {int} y2 
 * @param {int} x2 
 * @returns boolean
 */
function isGreater(y1, x1, y2, x2) {
    return maze[y1][x1] > maze[y2][x2];

}