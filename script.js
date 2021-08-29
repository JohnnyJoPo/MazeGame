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
var moves = 0;
var clearMoves = 0;
var score = 0;
var maze = document.getElementById("maze");
var width = document.getElementById("columnsIn");
var height = document.getElementById("rowsIn");
var routeChk = document.getElementById("routeChk");
var upBtn = document.getElementById("up");
var rightBtn = document.getElementById("right");
var downBtn = document.getElementById("down");
var leftBtn = document.getElementById("left");
var movesMsg = document.getElementById("moves");
var clearMovesMsg = document.getElementById("clearMoves");
var scoreMsg = document.getElementById("score");

// Constructor function for the object "Cell"
function Cell(x, y){
    this.dir = 0;
    this.visited = false;
    this.route = false;
    this.x = x;
    this.y = y;
}

// Constructor function for the object "Node"
function Node(directions = 0, route = false){
    this.dir = directions;
    this.route = route;
}

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

    score = 0;
    scoreMsg.innerText = score;
    createMaze(height.value, width.value);
}

// Creates and displays a new maze with the dimensions of the input parameters
function createMaze(row, col){
    generateMaze(row, col);
    expandArray();
    drawMaze();
}

// Uses dimension values passed through createMaze to generate new maze data
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
            mazeCoord[x][y] = new Cell(x, y); // directions, visited, route, x, y
        }
    }
    
    let stack = [];
    let currentCell;
    let possibleRoutes;
    let selectedIndex;
    let direction;
    let sourceDirection;
    let x;
    let y;
    let xNew;
    let yNew;
    let xMax = mazeCoord.length - 1;
    let yMax = mazeCoord[0].length - 1;
    let routingFlag = false;
    
    while(true){

        // Loop makes two iterations
        // First iteration generates maze data, routingFlag set to TRUE at end
        // Second iteration uses maze data to find the route from beginning to end, returns out of function when the end point is found

        if(routingFlag){ // Reset all visited flags to false
            for(let x=0; x <= xMax; x++){
                for(let y=0; y <= yMax; y++){
                    mazeCoord[x][y].visited = false;
                }
            }
            mazeCoord[0][0].route = true; // Add start point to route
            mazeCoord[xMax][yMax].route = true; // Add end point to route
        }

        mazeCoord[0][0].visited = true; // Set start point as visited
        stack.push(mazeCoord[0][0]);

        while(stack.length !== 0 || routingFlag){
            possibleRoutes = [];
            if(Math.random() < 0.85 || routingFlag){ // 85% chance to select the last added cell; 100% chance if searching for route
                currentCell = stack.pop();
            }
            else{ // 15% chance to select a random cell
                currentCell = stack.splice(Math.floor(Math.random() * stack.length), 1)[0];
            }
            x = currentCell.x;
            y = currentCell.y;

            if(!routingFlag){ // First iteration: Generates directional data for cells adjacent to the current cell
                if(x !== xMax && mazeCoord[x+1][y].visited === false){
                    possibleRoutes.push([mazeCoord[x+1][y], 2]);
                }
                if(x !== 0 && mazeCoord[x-1][y].visited === false){
                    possibleRoutes.push([mazeCoord[x-1][y], 8]);
                }
                if(y !== yMax && mazeCoord[x][y+1].visited === false){
                    possibleRoutes.push([mazeCoord[x][y+1], 4]);
                }
                if(y !== 0 && mazeCoord[x][y-1].visited === false){
                    possibleRoutes.push([mazeCoord[x][y-1], 1]);
                }
            }
            else{ // Second iteration: Uses existing directional data to find potential routes
                direction = currentCell.dir;
                if(direction >= 8){
                    direction -= 8;
                    if(mazeCoord[x-1][y].visited === false){
                        possibleRoutes.push([mazeCoord[x-1][y], 0]);
                    }
                }
                if(direction >= 4){
                    direction -= 4;
                    if(mazeCoord[x][y+1].visited === false){
                        possibleRoutes.push([mazeCoord[x][y+1], 0]);
                    }
                }
                if(direction >= 2){
                    direction -= 2;
                    if(mazeCoord[x+1][y].visited === false){
                        possibleRoutes.push([mazeCoord[x+1][y], 0]);
                    }
                }
                if(direction === 1){
                    if(mazeCoord[x][y-1].visited === false){
                        possibleRoutes.push([mazeCoord[x][y-1], 0]);
                    }
                }
            }
            if(possibleRoutes.length !== 0){
                for(let i=0; i < possibleRoutes.length; i++){
                    if(routingFlag && possibleRoutes[i][0] === mazeCoord[xMax][yMax]){ // If endpoint is adjacent to current cell & loop is in second iteration
                        return;
                    }
                }
                stack.push(currentCell);
                selectedIndex = Math.floor(Math.random() * possibleRoutes.length);
                stack.push(possibleRoutes[selectedIndex][0]);
                xNew = possibleRoutes[selectedIndex][0].x;
                yNew = possibleRoutes[selectedIndex][0].y;
                mazeCoord[xNew][yNew].visited = true;
                if(!routingFlag){
                    direction = possibleRoutes[selectedIndex][1];
                    sourceDirection = 0;

                    // Directions; Any combination of the below values makes a number from 0 (no directions are valid) to 15 (all directions are valid)
                    // 1 = up
                    // 2 = right
                    // 4 = down
                    // 8 = left

                    if(direction === 1){sourceDirection = 4;} // If up is a valid direction, set down as valid for adjacent cell
                    else if(direction === 2){sourceDirection = 8;} // If right is a valid direction, set left as valid for adjacent cell
                    else if(direction === 4){sourceDirection = 1;} // If down is a valid direction, set up as valid for adjacent cell
                    else if(direction === 8){sourceDirection = 2;} // If left is a valid direction, set right as valid for adjacent cell
                    
                    mazeCoord[x][y].dir += direction;
                    mazeCoord[xNew][yNew].dir += sourceDirection;
                }
                else{
                    mazeCoord[xNew][yNew].route = true;
                }
            }
            else if(routingFlag){
                mazeCoord[x][y].route = false;
            }
        }
        routingFlag = true;
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
            renderCoord[x*2].push(new Node(), new Node());
            renderCoord[(x*2)+1].push(new Node());
            renderCoord[(x*2)+1].push(new Node(mazeCoord[x][y].dir, mazeCoord[x][y].route));
        }
        renderCoord[x*2].push(new Node());
        renderCoord[(x*2)+1].push(new Node());
    }
    renderCoord.push([]);
    for(let i=0; i < (row*2)+1; i++){
        renderCoord[renderCoord.length-1].push(new Node());
    }
    
    let direction;
    let validRoute;
    for(let x=1; x < renderCoord.length; x+=2){
        for(let y=1; y < renderCoord[0].length; y+=2){
            direction = renderCoord[x][y].dir;
            validRoute = renderCoord[x][y].route;
            if(direction >= 8){
                direction -= 8;
                renderCoord[x-1][y].dir = 10; // Enable left and right for the cell to the left
                if(validRoute && renderCoord[x-2][y].route){
                    renderCoord[x-1][y].route = true;
                }
            }
            if(direction >= 4){
                direction -= 4;
                renderCoord[x][y+1].dir = 5; // Enable up and down for the cell below
                if(validRoute && renderCoord[x][y+2].route){
                    renderCoord[x][y+1].route = true;
                }
            }
            if(direction >= 2){
                direction -= 2;
                renderCoord[x+1][y].dir = 10; // Enable left and right for the cell to the right
                if(validRoute && renderCoord[x+2][y].route){
                    renderCoord[x+1][y].route = true;
                }
            }
            if(direction === 1){
                renderCoord[x][y-1].dir = 5; // Enable up and down for the cell above
                if(validRoute && renderCoord[x][y-2].route){
                    renderCoord[x][y-1].route = true;
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
            let divCell = document.createElement("div");
            divCell.classList.add("cell");
            divCell.direction = renderCoord[x][y].dir;
            if(divCell.direction === 0){
                divCell.classList.add("wall");
            }
            else{
                divCell.classList.add("path");
            }
            if(renderCoord[x][y].route){
                divCell.classList.add("route");
            }
            divCell.style.gridRow = y + 1;
            divCell.style.gridColumn = x + 1;
            maze.appendChild(divCell);
            divGrid[x][y] = divCell;
        }
    }

    moves = 0;
    clearMoves = document.getElementsByClassName("route").length - 1;
    movesMsg.innerText = moves;
    clearMovesMsg.innerText = clearMoves;
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

    moves++;
    if(direction === 0){nav[1]--;}
    else if(direction === 1){nav[0]++;}
    else if(direction === 2){nav[1]++;}
    else{nav[0]--;}
    if(nav[0] === (divGrid.length-2) && nav[1] === (divGrid[0].length-2)){ // If goal is reached -> Generate new maze
        score += Math.floor((clearMoves / moves) * 100);
        scoreMsg.innerText = score;
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
        createMaze(newHeight, newWidth);
    }

    else{ // If goal is not reached -> Update current location and route to goal
        divGrid[nav[0]][nav[1]].classList.add("dot");
        if(divGrid[oldX][oldY].classList.contains("route") && divGrid[nav[0]][nav[1]].classList.contains("route")){
            divGrid[oldX][oldY].classList.remove("route");
        }
        else{
            divGrid[nav[0]][nav[1]].classList.add("route");
        }
        movesMsg.innerText = moves;
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