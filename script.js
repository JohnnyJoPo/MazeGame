// Written by JohnnyJoPo -- https://github.com/JohnnyJoPo
// On behalf of: N/A (personal hobby project for use as a web development portfolio piece)
// July 19, 2021
// JavaScript file for Maze Game

"use strict"

// Global variables
var mazeCoord = [];
var renderCoord = [];
var divGrid = [];
var nav = [1, 1];
var maze = document.getElementById("maze");
var width = document.getElementById("columnsIn");
var height = document.getElementById("rowsIn");
var routeChk = document.getElementById("routeChk");
var upBtn = document.getElementById("up");
var rightBtn = document.getElementById("right");
var downBtn = document.getElementById("down");
var leftBtn = document.getElementById("left");

// Main startup function that sets up functionality
function init(){
    setEvents();
    upBtn.disabled = true;
    rightBtn.disabled = true;
    downBtn.disabled = true;
    leftBtn.disabled = true;
    document.getElementById("scriptCheck").remove();
}

// Startup function that sets up the main event listeners
function setEvents(){
    let genBtn = document.getElementById("genBtn");
    let focusMsg = document.getElementById("focusMsg");

    window.addEventListener("resize", resizeMaze);
    routeChk.addEventListener("change", updateRouteDisplay);
    genBtn.addEventListener("click", validateInput);
    upBtn.addEventListener("click", function(){
        moveDot(0);
    });
    rightBtn.addEventListener("click", function(){
        moveDot(1);
    });
    downBtn.addEventListener("click", function(){
        moveDot(2);
    });
    leftBtn.addEventListener("click", function(){
        moveDot(3);
    });
    window.addEventListener("keydown", function(event){
        let keyCheck = ["w", "d", "s", "a", "ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
        let focusCheck = [];
        let focusNodes = document.querySelectorAll("input, button");
        for(let i=0; i<focusNodes.length; i++){
            focusCheck.push(focusNodes[i]);
        }
        if(divGrid.length !== 0){
            if(keyCheck.includes(event.key)){
                if(!focusCheck.includes(document.activeElement)){
                    event.preventDefault();
                    focusMsg.style.visibility = "hidden";
                    switch(event.key){
                        case "w":
                        case "ArrowUp":
                            upBtn.click();
                            break;
                        case "d":
                        case "ArrowRight":
                            rightBtn.click();
                            break;
                        case "s":
                        case "ArrowDown":
                            downBtn.click();
                            break;
                        case "a":
                        case "ArrowLeft":
                            leftBtn.click();
                            break;
                    }
                }
                else{
                    focusMsg.style.visibility = "visible";
                }
            }
        }
    });
    maze.addEventListener("click", function(){
        focusMsg.style.visibility = "hidden";
    });
}

// Checks the integrity of data input into the form
// Returns if any of the checks fail
// If a check fails, the problematic input field is highlighted red and an error message is shown
// If all entered data is valid, a new maze is generated
function validateInput(){
    let errorMsg = document.getElementById("error");
    let regex = new RegExp("^[0-9]+$");
    errorMsg.style.visibility = "hidden";
    width.style.backgroundColor = "white";
    height.style.backgroundColor = "white";
    width.value = width.value.trim();
    height.value = height.value.trim();
    
    // Checks the "Rows" input
    // Fails if the input contains anything besides a numeric value between 5 and 101
    if (!(regex.test(height.value)) || height.value === "" || height.value < 5 || height.value > 101){
        height.style.backgroundColor = "#ffafaf";
        height.focus();
        errorMsg.style.visibility = "visible";
        return;
    }
    
    // Checks the "Columns" input
    // Fails if the input contains anything besides a numeric value between 5 and 101
    if (!(regex.test(width.value)) || width.value === "" || width.value < 5 || width.value > 101) {
        width.style.backgroundColor = "#ffafaf";
        width.focus();
        errorMsg.style.visibility = "visible";
        return;
    }

    generateMaze(height.value, width.value);
}

// Creates a new maze with the dimensions of the input parameters
function generateMaze(row, col){
    if(row % 2 === 0){
        row++;
    }
    if(col % 2 === 0){
        col++;
    }

    width.value = col;
    height.value = row;
    mazeCoord = [];
    let genWidth = (col-1) / 2;
    let genHeight = (row-1) / 2;

    for(let x=0; x < genWidth; x++){
        mazeCoord.push([]);    
        for(let y=0; y < genHeight; y++){
            mazeCoord[x].push([]);
            mazeCoord[x][y] = [0, false, false, x, y] // [Valid directions, visited flag, correct route, X coord, Y coord]
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
        xPos = currentCell[3];
        yPos = currentCell[4];
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
            xNew = possibleRoutes[selectedIndex][0][3];
            yNew = possibleRoutes[selectedIndex][0][4];
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
    calculateRoute();
    expandArray();
    drawMaze();
}

// Analyzes the created maze, and charts a route that leads to the goal
// Likely to be merged into generateMaze in a future update due to similar code (likely redundancy)
function calculateRoute(){
    let stack = [];
    let currentCell;
    let possibleRoutes;
    let direction;
    let xPos;
    let yPos;
    let selectedIndex;
    let xNew;
    let yNew;

    for(let x=0; x < mazeCoord.length; x++){
        for(let y=0; y < mazeCoord[0].length; y++){
            mazeCoord[x][y][1] = false; // Reset all visited flags to false
        }
    }

    mazeCoord[0][0][1] = true;
    mazeCoord[0][0][2] = true;
    mazeCoord[mazeCoord.length-1][mazeCoord[0].length-1][2] = true;
    stack.push(mazeCoord[0][0]);

    while(true){
        possibleRoutes = [];
        currentCell = stack[stack.length-1];
        direction = currentCell[0];
        xPos = currentCell[3];
        yPos = currentCell[4];
        stack.pop();
        if(direction >= 8){
            direction -= 8;
            if(mazeCoord[xPos-1][yPos][1] === false){
                possibleRoutes.push(mazeCoord[xPos-1][yPos]);
            }
        }
        if(direction >= 4){
            direction -= 4;
            if(mazeCoord[xPos][yPos+1][1] === false){
                possibleRoutes.push(mazeCoord[xPos][yPos+1]);
            }
        }
        if(direction >= 2){
            direction -= 2;
            if(mazeCoord[xPos+1][yPos][1] === false){
                possibleRoutes.push(mazeCoord[xPos+1][yPos]);
            }
        }
        if(direction === 1){
            if(mazeCoord[xPos][yPos-1][1] === false){
                possibleRoutes.push(mazeCoord[xPos][yPos-1]);
            }
        }

        if(possibleRoutes.length !== 0){
            for(let i=0; i < possibleRoutes.length; i++){
                if(possibleRoutes[i] === mazeCoord[mazeCoord.length-1][mazeCoord[0].length-1]){
                    return;
                }
            }
            stack.push(currentCell);
            selectedIndex = Math.floor(Math.random() * possibleRoutes.length);
            stack.push(possibleRoutes[selectedIndex]);
            xNew = possibleRoutes[selectedIndex][3];
            yNew = possibleRoutes[selectedIndex][4];
            mazeCoord[xNew][yNew][1] = true;
            mazeCoord[xNew][yNew][2] = true;
        }
        else{
            mazeCoord[xPos][yPos][2] = false;
        }
    }
}

// Doubles the size of the mazeCoord array to add buffer spaces between each cell
// Values stored into a new global array called renderCoord
// This is necessary to render the maze properly later in the creation sequence
function expandArray(){
    renderCoord = [];
    let row = mazeCoord[0].length;
    let col = mazeCoord.length;

    for(let x=0; x < col; x++){
        renderCoord.push([], []);
        for(let y=0; y < row; y++){
            renderCoord[x*2].push([0, false], [0, false]);
            renderCoord[(x*2)+1].push([0, false]);
            renderCoord[(x*2)+1].push([mazeCoord[x][y][0], mazeCoord[x][y][2]]);
        }
        renderCoord[x*2].push([0, false]);
        renderCoord[(x*2)+1].push([0, false]);
    }
    renderCoord.push([]);
    for(let i=0; i < (row*2)+1; i++){
        renderCoord[renderCoord.length-1].push([0, false]);
    }
    
    let direction;
    let validRoute;
    for(let x=1; x < renderCoord.length; x+=2){
        for(let y=1; y < renderCoord[0].length; y+=2){
            direction = renderCoord[x][y][0];
            validRoute = renderCoord[x][y][1];
            if(direction >= 8){
                direction -= 8;
                renderCoord[x-1][y][0] = 10; // Enable left and right for the cell to the left
                if(validRoute && renderCoord[x-2][y][1]){
                    renderCoord[x-1][y][1] = true;
                }
            }
            if(direction >= 4){
                direction -= 4;
                renderCoord[x][y+1][0] = 5; // Enable up and down for the cell below
                if(validRoute && renderCoord[x][y+2][1]){
                    renderCoord[x][y+1][1] = true;
                }
            }
            if(direction >= 2){
                direction -= 2;
                renderCoord[x+1][y][0] = 10; // Enable left and right for the cell to the right
                if(validRoute && renderCoord[x+2][y][1]){
                    renderCoord[x+1][y][1] = true;
                }
            }
            if(direction === 1){
                renderCoord[x][y-1][0] = 5; // Enable up and down for the cell above
                if(validRoute && renderCoord[x][y-2][1]){
                    renderCoord[x][y-1][1] = true;
                }
            }
        }
    }
}

// Takes values from the renderCoord array to create HTML div elements to build the maze
// Div elements placed into a new global array called divGrid to update styling via class modification
function drawMaze(){
    let row = renderCoord[0].length;
    let col = renderCoord.length;
    divGrid = [];

    while(maze.firstChild){ // Erases all div elements used for the previous maze
        maze.removeChild(maze.firstChild);
    }
    
    for(let x=0; x < col; x++){ // Creates a new div element for each cell in the maze
        divGrid.push([]);
        for(let y=0; y < row; y++){
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.direction = renderCoord[x][y][0];
            if(cell.direction === 0){
                cell.classList.add("wall");
            }
            else{
                cell.classList.add("path");
            }
            if(renderCoord[x][y][1]){
                cell.classList.add("route");
            }
            cell.style.gridRow = y + 1;
            cell.style.gridColumn = x + 1;
            maze.appendChild(cell);
            divGrid[x][y] = cell;
        }
    }

    divGrid[1][1].classList.add("dot");
    divGrid[col-2][row-2].style.backgroundColor = "#00ff00";
    nav = [1, 1];
    updateControlButtons();
    resizeMaze();
}

// Enables or disables the directional buttons at the top of the screen depending on which moves are valid
function updateControlButtons(){
    let directionSwitch = divGrid[nav[0]][nav[1]].direction;
    upBtn.disabled = true;
    rightBtn.disabled = true;
    downBtn.disabled = true;
    leftBtn.disabled = true;
    
    if(directionSwitch >= 8){ // If there is an open path to the left of the current location
        directionSwitch -= 8;
        leftBtn.disabled = false;
    }
    if(directionSwitch >= 4){ // If there is an open path below the current location
        directionSwitch -= 4;
        downBtn.disabled = false;
    }
    if(directionSwitch >= 2){ // If there is an open path to the right of the current location
        directionSwitch -= 2;
        rightBtn.disabled = false;
    }
    if(directionSwitch === 1){ // If there is an open path above the current location
        upBtn.disabled = false;
    }
}

// Resizes the maze to fit within the window
// Calculates the space needed by using the window dimensions and number of rows/columns in the maze
function resizeMaze(){
    if(divGrid.length === 0){
        return;
    }
    let winWidth = window.innerWidth;
    let formHeight = document.getElementsByTagName("form")[0].offsetHeight;
    let winHeight = window.innerHeight - formHeight;
    let hSize = divGrid.length;
    let vSize = divGrid[0].length;
    if((winWidth/hSize) <= (winHeight/vSize)){
        document.documentElement.style.setProperty("--cell-size", `${(winWidth*0.9)/hSize}px`);
    }
    else{        
        document.documentElement.style.setProperty("--cell-size", `${(winHeight*0.95)/vSize}px`);    
    }
}

// Updates the current location (what cell is currently red), hence moving the "dot"
// Generates a new maze if the goal is reached
// Updates the route to the goal as the player moves the dot
function moveDot(direction){
    let oldDot = document.getElementsByClassName("dot")[0];
    let oldX = nav[0];
    let oldY = nav[1];
    oldDot.classList.remove("dot");
    
    // Direction parameter
    // 0 = Up
    // 1 = Right
    // 2 = Down
    // 3 = Left

    if(direction === 0){nav[1]--;}
    else if(direction === 1){nav[0]++;}
    else if(direction === 2){nav[1]++;}
    else{nav[0]--;}
    if(nav[0] === (divGrid.length-2) && nav[1] === (divGrid[0].length-2)){ // If goal is reached -> Generate new maze
        let newWidth = divGrid.length + 2;
        let newHeight = divGrid[0].length + 2;
        if(newWidth > 101){
            newWidth = 101;
        }
        if(newHeight > 101){
            newHeight = 101;
        }
        width.value = newWidth;
        height.value = newHeight;
        generateMaze(newHeight, newWidth);
    }

    else{ // If goal is not reached -> Update current location and route to goal
        divGrid[nav[0]][nav[1]].classList.add("dot");
        if(divGrid[oldX][oldY].classList.contains("route") && divGrid[nav[0]][nav[1]].classList.contains("route")){
            divGrid[oldX][oldY].classList.remove("route");
        }
        else{
            divGrid[nav[0]][nav[1]].classList.add("route");
        }
        updateControlButtons();
    }
}

// Shows/hides the route that leads to the goal
function updateRouteDisplay(){
    if(routeChk.checked){
        document.documentElement.style.setProperty("--route-color", "#ffff00");
    }
    else{
        document.documentElement.style.setProperty("--route-color", "#cfcfcf");
    }
}

window.addEventListener("load", init);