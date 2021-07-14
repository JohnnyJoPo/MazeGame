"use strict"

var mazeCoord = [];
var renderCoord = [];
var divGrid = [];
var nav = [1, 1];
var maze = document.getElementById("maze");
var upBtn = document.getElementById("up");
var rightBtn = document.getElementById("right");
var downBtn = document.getElementById("down");
var leftBtn = document.getElementById("left");

function init(){
    setEvents();
    // generateMaze(20, 40);
    // expandArray();
    // drawMaze();
    document.getElementById("scriptCheck").remove();
    upBtn.disabled = true;
    rightBtn.disabled = true;
    downBtn.disabled = true;
    leftBtn.disabled = true;
}

function validateInput(){
    let width = document.getElementById("columnsIn");
    let height = document.getElementById("rowsIn");
    let errorMsg = document.getElementById("error");
    let regex = new RegExp("^[0-9]+$");
    errorMsg.innerText = ""
    width.style.backgroundColor = "white";
    height.style.backgroundColor = "white";
    width.value = width.value.trim();
    height.value = height.value.trim();
    
    if (!(regex.test(height.value)) || height.value === "" || height.value < 4 || height.value > 100){
        height.style.backgroundColor = "#ffafaf";
        height.focus();
        errorMsg.innerText = "Please enter a positive integer between 4 and 100";
        return;
    }
    
    if (!(regex.test(width.value)) || width.value === "" || width.value < 4 || width.value > 100) {
        width.style.backgroundColor = "#ffafaf";
        width.focus();
        errorMsg.innerText = "Please enter a positive integer between 4 and 100";
        return;
    }

    generateMaze(height.value, width.value);
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

function updateControlButtons(){
    let directionSwitch = divGrid[nav[0]][nav[1]].direction;
    upBtn.disabled = true;
    rightBtn.disabled = true;
    downBtn.disabled = true;
    leftBtn.disabled = true;
    
    if(directionSwitch >= 8){
        directionSwitch -= 8;
        leftBtn.disabled = false;
    }
    if(directionSwitch >= 4){
        directionSwitch -= 4;
        downBtn.disabled = false;
    }
    if(directionSwitch >= 2){
        directionSwitch -= 2;
        rightBtn.disabled = false;
    }
    if(directionSwitch === 1){
        upBtn.disabled = false;
    }
}

function moveDot(direction){
    let oldDot = document.getElementsByClassName("dot")[0];
    oldDot.classList.remove("dot");
    
    if(direction === 0){nav[1]--;}
    else if(direction === 1){nav[0]++;}
    else if(direction === 2){nav[1]++;}
    else{nav[0]--;}
    divGrid[nav[0]][nav[1]].classList.add("dot");
    updateControlButtons();
}

function drawMaze(){
    let row = renderCoord[0].length;
    let col = renderCoord.length;
    divGrid = [];
    // maze.style.gridTemplateRows = `repeat(${row}, auto)`;
    // maze.style.gridTemplateColumns = `repeat(${col}, auto)`;
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
    divGrid[1][1].classList.add("dot");
    nav = [1, 1];
    updateControlButtons();
    resizeMaze();
}

function resizeMaze(){
    if(divGrid.length === 0){
        return;
    }
    let winWidth = window.innerWidth;
    let formHeight = document.getElementsByTagName("form")[0].offsetHeight;
    let winHeight = window.innerHeight - formHeight;
    let hSize = divGrid.length;
    let vSize = divGrid[0].length;
    // console.log(formHeight);
    // console.log(`${hSize} ${winWidth} ${winWidth/hSize}`);
    // console.log(`${vSize} ${winHeight} ${winHeight/vSize}`);
    if((winWidth/hSize) <= (winHeight/vSize)){
        // console.log("Height is greater or equal");
        document.documentElement.style.setProperty("--cell-size", `${(winWidth*0.9)/hSize}px`);
    }
    else{
        // console.log("Width is greater");
        document.documentElement.style.setProperty("--cell-size", `${(winHeight*0.95)/vSize}px`);    
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

    window.addEventListener("resize", resizeMaze);
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
        if(event.key === "w"){
            upBtn.click();
        }
        else if(event.key === "d"){
            rightBtn.click();
        }
        else if(event.key === "s"){
            downBtn.click();
        }
        else if(event.key === "a"){
            leftBtn.click();
        }
    });
}

window.addEventListener("load", init);