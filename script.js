"use strict"

let mazeCoord = [];
let renderCoord = [];
let divGrid = [];
let nav = [1, 1];
let winWidth = document.getElementById("wrapper").offsetWidth;
let maze = document.getElementById("maze");

function init(){
    setEvents();
    // generateMaze(20, 40);
    // expandArray();
    // drawMaze();
    document.getElementById("scriptCheck").remove();
}

function validateInput(){
    let width = document.getElementById("columns");
    let height = document.getElementById("rows");
    let errorMsg = document.getElementById("error");
    let regex = new RegExp("^[0-9]+$");
    errorMsg.innerText = ""
    width.style.backgroundColor = "white";
    height.style.backgroundColor = "white";
    width.value = width.value.trim();
    height.value = height.value.trim();
    
    if (!(regex.test(height.value)) || height.value === "" || height.value < 4){
        height.style.backgroundColor = "#ffafaf";
        height.focus();
        errorMsg.innerText = "Please enter a positive integer greater than 4";
        return;
    }
    
    if (!(regex.test(width.value)) || width.value === "" || width.value < 4) {
        width.style.backgroundColor = "#ffafaf";
        width.focus();
        errorMsg.innerText = "Please enter a positive integer greater than 4";
        return;
    }

    generateMaze(width.value, height.value);
}


function expandArray(){
    let row = mazeCoord[0].length;
    let col = mazeCoord.length;

    for(let x=0; x < col; x++){
        renderCoord.push([], []);
        for(let y=0; y < row; y++){
            renderCoord[x*2].push(0, 0);
            renderCoord[(x*2)+1].push(0);
            renderCoord[(x*2)+1].push(mazeCoord[x][y][0]);
        }
        renderCoord[x*2].push(0);
        renderCoord[(x*2)+1].push(0);
    }
    renderCoord.push([]);
    for(let i=0; i < (row*2)+1; i++){
        renderCoord[renderCoord.length-1].push(0);
    }

    // renderCoord.push(bufferCol);
    
    let direction;
    for(let x=1; x < renderCoord.length; x+=2){
        for(let y=1; y < renderCoord[0].length; y+=2){
            direction = renderCoord[x][y];
            if(direction >= 8){
                direction -= 8;
                renderCoord[x-1][y] = 10; // Enable left and right for the cell to the left
            }
            if(direction >= 4){
                direction -= 4;
                renderCoord[x][y+1] = 5; // Enable up and down for the cell below
            }
            if(direction >= 2){
                direction -= 2;
                renderCoord[x+1][y] = 10; // Enable left and right for the cell to the right
            }
            if(direction === 1){
                renderCoord[x][y-1] = 5; // Enable up and down for the cell above
            }
        }
    }
    drawMaze();
}

function drawMaze(){
    let row = renderCoord[0].length;
    let col = renderCoord.length;
    divGrid = [];
    maze.style.gridTemplateRows = `repeat(${row}, auto)`;
    maze.style.gridTemplateColumns = `repeat(${col}, auto)`;
    while(maze.firstChild){
        maze.removeChild(maze.firstChild);
    }
    for(let x=0; x < col; x++){
        divGrid.push([]);
        for(let y=0; y < row; y++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.direction = renderCoord[x][y];
            if(cell.direction === 0){
                cell.classList.add("wall");
            }
            else{
                cell.classList.add("path");
            }
            cell.style.gridRow = y + 1;
            cell.style.gridColumn = x + 1;
            maze.appendChild(cell);
            divGrid[x][y] = cell;
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

    mazeCoord = [];
    renderCoord = [];

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
    expandArray();
}

function setEvents(){
    let genBtn = document.getElementById("genBtn");

    genBtn.addEventListener("click", validateInput);
}

window.addEventListener("load", init);