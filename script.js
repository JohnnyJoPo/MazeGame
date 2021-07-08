"use strict"

let mazeCoord = [];
let winWidth = document.getElementById("wrapper").offsetWidth;
let maze = document.getElementById("maze");

function init(){
    setEvents();
    generateMaze(21, 21);
    drawMaze(21,21);
}

function drawMaze(row, col){
    maze.style.gridTemplateRows = `repeat(${row}, auto)`;
    maze.style.gridTemplateColumns = `repeat(${col}, auto)`;
    for(let x=0; x < col; x++){
        for(let y=0; y < row; y++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.gridRow = y + 1;
            cell.style.gridColumn = x + 1;
            maze.appendChild(cell);
        }
    }
}

function generateMaze(row, col){ // Rows and collumns should always be an odd number
    if(row % 2 === 0){
        row++;
    }
    if(col % 2 === 0){
        col++;
    }
    let genWidth = (col-1) / 2;
    let genHeight = (row-1) / 2;
    for(let x=0; x < genWidth; x++){
        mazeCoord.push([]);    
        for(let y=0; y < genHeight; y++){
            mazeCoord[x].push([]);
            mazeCoord[x][y] = [0, false, x, y] // [Valid directions, visited flag, X coord, Y coord]
        }
    }
    let xPos = Math.floor(Math.random() * mazeCoord.length);
    let yPos = Math.floor(Math.random() * mazeCoord[xPos].length);
    let stack = [];
    let currentIndex;
    let currentCell;
    let possibleRoutes;
    let selectedIndex;
    let xNew;
    let yNew;
    let direction;
    let sourceDirection;

    mazeCoord[xPos][yPos][1] = true;
    stack.push(mazeCoord[xPos][yPos]);
    // console.log(`${xPos}   ${yPos}`);
    // console.log(mazeCoord.length);
    // console.log(mazeCoord[xPos+1][yPos]);
    // console.log(stack);

    while(stack.length !== 0){
        possibleRoutes = [];
        currentIndex = Math.floor(Math.random() * stack.length);
        currentCell = stack[currentIndex];
        xPos = currentCell[2];
        yPos = currentCell[3];
        stack.splice(currentIndex, 1);
        if(xPos === 0){
            if(mazeCoord[xPos+1][yPos][1] === false){
                possibleRoutes.push([mazeCoord[xPos+1][yPos], 2]);
            }
        }
        else if(xPos === (mazeCoord.length - 1)){
            if(mazeCoord[xPos-1][yPos][1] === false){
                possibleRoutes.push([mazeCoord[xPos-1][yPos], 8]);
            }
        }
        else{
            if(mazeCoord[xPos+1][yPos][1] === false){
                possibleRoutes.push([mazeCoord[xPos+1][yPos], 2]);
            }
            if(mazeCoord[xPos-1][yPos][1] === false){
                possibleRoutes.push([mazeCoord[xPos-1][yPos], 8]);
            }
        }

        if(yPos === 0){
            if(mazeCoord[xPos][yPos+1][1] === false){
                possibleRoutes.push([mazeCoord[xPos][yPos+1], 4]);
            }
        }
        else if(yPos === (mazeCoord[0].length - 1)){
            if(mazeCoord[xPos][yPos-1][1] === false){
                possibleRoutes.push([mazeCoord[xPos][yPos-1], 1]);
            }
        }
        else{
            if(mazeCoord[xPos][yPos+1][1] === false){
                possibleRoutes.push([mazeCoord[xPos][yPos+1], 4]);
            }
            if(mazeCoord[xPos][yPos-1][1] === false){
                possibleRoutes.push([mazeCoord[xPos][yPos-1], 1]);
            }
        }

        if(possibleRoutes.length !== 0){
            stack.push(currentCell);
            selectedIndex = Math.floor(Math.random() * possibleRoutes.length);
            possibleRoutes[selectedIndex][0][1] = true;
            xNew = possibleRoutes[selectedIndex][0][2];
            yNew = possibleRoutes[selectedIndex][0][3];
            direction = possibleRoutes[selectedIndex][1];
            sourceDirection = 0;
            if(direction === 1){sourceDirection = 4;}
            else if(direction === 2){sourceDirection = 8;}
            else if(direction === 4){sourceDirection = 1;}
            else if(direction === 8){sourceDirection = 2;}
            stack.push(possibleRoutes[selectedIndex][0]);
            mazeCoord[xPos][yPos][0] += direction;
            mazeCoord[xNew][yNew][1] = true;
            mazeCoord[xNew][yNew][0] += sourceDirection;
        }
    }
    console.log(mazeCoord);
}

function setEvents(){
    window.addEventListener("resize", function(){
        console.log(this.document.getElementById("wrapper").offsetWidth);
    });
}

window.addEventListener("load", init);