// création du labyrinthe
let gx = 7;
let gy = 6;
let maze = new Array(gy);
for (let i = 0; i < gy; i++) {
    maze[i] = new Array(gx);
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
console.log(maze);