//npm i -S simplex-noise

var SimplexNoise = require('simplex-noise');

//MAP
//var seed = Math.random;
var mapSeed = 666;
var mapSimplex = new SimplexNoise(mapSeed);

var itemSeed = 54;
var itemSimplex = new SimplexNoise(itemSeed);

var foliageSeed = 54;
var foliageSimplex = new SimplexNoise(foliageSeed);

//SCREEN
var screenWidth = 16;
var screenHeight = 16;

var fullscreen = false;
var fullscreenMarge = "";

//CAMERA
var minScale = 16;
var maxScale = 128;
var scale = maxScale;

var cameraX = 0;
var cameraY = 0;

//Sprites
var playerSprites;
var treeSprite;
var pineSprite;
var heartSprite;
var appleSprite;
var cactus = "🌵";
var womanFace = "\uD83D\uDC69";
var womanBody1 = "\uD83D\uDE4E";
var womanBody2 = "\uD83D\uDE4D";
var womanBlocked = "🙅";
var axe = "\uD83E\uDE93";

var emoji = true;

function getPlayerSprites() {
    if (playerBlocked){
        playerSprites = [womanBlocked];
    } else {
        playerSprites = [womanBody1,womanBody2];
    }
}


function initSprites() {
    if (emoji){
        //playerSprites = [womanBody1,womanBody2];
        treeSprite = "🌳";
        pineSprite = "🌲";
        heartSprite = " ❤";
        appleSprite = "🍎"
    } else {
        playerSprites = [red+"☺ "+reset,red+"☻ "+reset];
        heartSprite = red+"♥ ";
        treeSprite = darkGreen+"^^"+reset;
        pineSprite = darkGreen+"/\\"+reset;
        appleSprite = red+"● "+reset
    }
}

var requestCameraCenter = false;
function centerCamera() {
    cameraX = projectionPlayerX-(screenWidth/2);
    cameraY = projectionPlayerY-(screenHeight/2);
    requestCameraCenter = false;
}

function moveCamera() {
    var offset = 6; // if half screen, fully static
    if (projectionPlayerX-cameraX < offset){
        cameraX--;
    } else if (projectionPlayerX-cameraX > screenWidth - offset){
        cameraX++;
    }
    if (projectionPlayerY-cameraY < offset){
        cameraY--;
    } else if (projectionPlayerY-cameraY > screenHeight - offset){
        cameraY++;
    }
}

//PLAYER
var playerX = -0.25;
var playerY = -0.25;
var projectionPlayerX = 0;
var projectionPlayerY = 0;
var playerMoveApplied = true;

//RENDERING
var frame = 0;
var rendered = true;
var showMenu = true;
var introScroll = 0;
var showIntro = true; //true
var timeIntro = 2000; //ms
var showDialog = true;
var showGame = false;
var showEmojis = false;

//DIALOGS
var dialogIndex = 0;
var dialog = [];
var welcome = [];
welcome[0] = womanFace + " Hello ! My name is Jane, ";
welcome[1] = "let's discover this world ! ";
dialog.push(welcome);

var firstStep = [];
firstStep[0] = "Where do you want to go ?   ";
dialog.push(firstStep);


var mapTile;
function getScreenTile(x, y){ //get tile info from screen x y coord
    var mapTile = mapSimplex.noise2D((x+cameraX)/scale, (y+cameraY)/scale);
    mapTile += 0.5 * mapSimplex.noise2D(2*(x+cameraX)/scale, 2*(y+cameraY)/scale);
    mapTile += 0.25 * mapSimplex.noise2D(4*(x+cameraX)/scale, 2*(y+cameraY)/scale);
    if (mapTile < 0) { mapTile *= -1;}
    mapTile = Math.pow(mapTile, 0.4);
    return mapTile;
}

function getMapTile(x, y){ //get tile info from map x y coord
    var mapTile = mapSimplex.noise2D(x/scale, y/scale);
    mapTile += 0.5 * mapSimplex.noise2D(2*x/scale, 2*y/scale);
    mapTile += 0.25 * mapSimplex.noise2D(4*x/scale, 2*y/scale);
    if (mapTile < 0) { mapTile *= -1;}
    mapTile = Math.pow(mapTile, 0.4);
    return mapTile;
}

var logs = "";
var test = "";
function render(){
    if (rendered) {
        rendered = false;

        getPlayerSprites();

        projectionPlayerX = Math.floor(playerX * scale);
        projectionPlayerY = Math.floor(playerY * scale);

        moveCamera();

        if (requestCameraCenter){
            centerCamera();
        }

        logs = "";
        logs += "real player coord (" + playerX+","+playerY+")\n";
        logs += "map projection coord (" + projectionPlayerX+","+projectionPlayerY+")\n";
        logs += "scale "+scale+"\n";
        logs += "frame  "+frame+"\n";
        logs += "test : "+test+"\n";

        var ui = "";
        if (!fullscreen){
            ui += gradientGrey1+"                                        \n";
            ui += gradientGrey0+"                                        \n";
            ui += gradientGrey0+"  "+gradientGrey103+magenta+"════════════════════"+white+"UNICODE MATRIX"+magenta+"══"+gradientGrey0+"  \n";
        } else {
            ui += gradientGrey0+"                                                                        \n";
            ui += gradientGrey0+"  "+gradientGrey103+magenta+"════════════════════════════════════════════════════"+white+"UNICODE MATRIX"+magenta+"══"+gradientGrey0+"  \n";
        }

        var lines = [];

        if (showIntro) { //display animated intro
            for (var i=0; i<screenHeight;i++){
                if (i==Math.floor(introScroll)){
                    lines.push(black+gradientWhite0+"          UNICODE GAME®         "+fullscreenMarge);        
                } else {
                    lines.push(gradientWhite0+"                                "+fullscreenMarge);        
                }
            }
            if (introScroll<screenHeight/2) {
                introScroll+=0.4;
            } else {
                if (timeIntro<=0){
                    showIntro = false;
                    showMenu = true;
                }
                timeIntro -= 1000/fps;
            }
        } else if (showEmojis) { //display emojis
            lines.push(green+gradientBlack+"                                "+fullscreenMarge);
            lines.push(gradientBlack+"             EMOJIS             "+fullscreenMarge);
            lines.push(red+gradientBlack+"check your terminal compatibilty"+fullscreenMarge);
            lines.push(gradientBlack+"╔══════════════════════════════╗"+fullscreenMarge);
            lines.push(gradientBlack+"║👩 🙍‍ 🙎 🙅 🙆 💁 🙋 🤦 🤷   ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🛏 🚪                          ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🪓 ⛏ 🔨                        ║"+fullscreenMarge);
            lines.push(gradientBlack+"║📘 📃                         ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🎒 👕 👖 🧤 🧥 🧦             ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🎁                            ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🔥 💧 🩸                       ║"+fullscreenMarge);
            lines.push(gradientBlack+"║⛵ 🛶 🚗 🚚                    ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🥩                            ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🌳 🌲 🌴 🌵 🎄                ║"+fullscreenMarge);
            lines.push(gradientBlack+"║🐈 🐖 🐟                      ║"+fullscreenMarge);
            lines.push(gradientBlack+"╚══════════════════════════════╝"+fullscreenMarge+reset);
        } else if (showMenu) { //display menu
            lines.push(green+gradientBlack+"                                "+fullscreenMarge);
            lines.push(gradientBlack+"           UNICODE GAME         "+fullscreenMarge);
            lines.push(red+gradientBlack+"         by B3ird 22.03.20      "+fullscreenMarge);
            lines.push(white+gradientBlack+"╔══════════════════════════════╗"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Press escape to show menu   ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Use arrow to move player    ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Press 'F' for fullscreen    ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Press 'P' to show the map   ║"+fullscreenMarge);
            lines.push(gradientBlack+"║                              ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ Debug                        ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Press '5' to center camera  ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Press 'O' to disable emojis ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Press '-/+' for camera zoom ║"+fullscreenMarge);
            lines.push(gradientBlack+"║ -Use numpad to move camera   ║"+fullscreenMarge);
            lines.push(gradientBlack+"║                        Enter ║"+fullscreenMarge);
            lines.push(gradientBlack+"╚══════════════════════════════╝"+fullscreenMarge+reset);
        } else if (showGame) { //display game
            for(var y = 0; y < screenHeight; y++) { 
                var line="";
                for(var x = 0; x < screenWidth; x++) {
                    
                    //deep map
                    mapTile = getScreenTile(x,y);

                    //items map
                    var mapItem = itemSimplex.noise2D((x+cameraX)/scale, (y+cameraY)/scale);
                    if (mapItem < 0) { mapItem *= -1;}

                    //foliage
                    var mapFoliage = itemSimplex.noise2D((x+cameraX)/scale, (y+cameraY)/scale);
                    if (mapFoliage < 0) { mapFoliage *= -1;}

                    if (projectionPlayerX == (x+cameraX) && projectionPlayerY == (y+cameraY)){
                        frame++;
                        line += renderPixel(mapTile, true)+playerSprites[frame%playerSprites.length]+reset;
                    } else {
                        var i = renderItem(mapItem);
                        if (i != ""){
                            line += renderPixel(mapTile, true)+i+reset;
                        } else {
                            var f = renderFoliage(mapTile, mapFoliage);
                            if (f != ""){
                                line += renderPixel(mapTile, true)+f+reset;
                            } else {
                                line += renderPixel(mapTile, false)+reset;
                            }
                        }
                    }
                }
                lines.push(line);
            }

            if (showDialog){
                if (dialogIndex<=dialog.length-1){
                    var message = dialog[dialogIndex];
                    //footer
                    var footerLines = 2;
                    if (fullscreen){
                        lines[lines.length-2] = gradientBlack+"║                                                        Enter ║";
                        lines[lines.length-1] = gradientBlack+"╚══════════════════════════════════════════════════════════════╝";
                    } else {
                        lines[lines.length-2] = gradientBlack+"║                        Enter ║";
                        lines[lines.length-1] = gradientBlack+"╚══════════════════════════════╝";
                    }

                    //body
                    for (var d=0; d<message.length;d++){
                        lines[lines.length-1-d-footerLines] = gradientBlack+"║ "+message[message.length-1-d]+fullscreenMarge+" ║";
                    }

                    //header
                    if (fullscreen){
                        lines[lines.length-1-message.length-1-1] = gradientBlack+"╔══════════════════════════════════════════════════════════════╗";    
                    } else {
                        lines[lines.length-1-message.length-1-1] = gradientBlack+"╔══════════════════════════════╗";    
                    }
                    
                }
            }
        }

        //display screen
        for (var l=0; l<lines.length;l++){
            ui += gradientGrey0+"  "+gradientGrey103+"  "+lines[l]+gradientGrey103+"  "+gradientGrey0+"  \n";   
        }

        playerMoveApplied = true;
        //console.log(screen);

        if (!fullscreen){
            ui += gradientGrey0+"  "+gradientGrey103+"                                    "+gradientGrey0+"  \n";
            ui += gradientGrey0+"  "+blue+"Unicode GAME TUX™                     \n";
            ui += gradientGrey0+"                                        \n";
            ui += gradientGrey0+"      "+white+gradientBlack+"    "+gradientGrey0+"                      "+gradientMagenta+"    "+gradientGrey0+"    \n";
            ui += gradientGrey0+"    "+gradientBlack+"        "+gradientGrey0+"                    "+gradientMagenta+"    "+gradientGrey0+"    \n";
            ui += gradientGrey0+"    "+gradientBlack+"        "+gradientGrey0+"              "+gradientMagenta+"    "+gradientGrey0+blue+"    A     \n";
            ui += gradientGrey0+"      "+white+gradientBlack+"    "+gradientGrey0+"                "+gradientMagenta+"    "+gradientGrey0+"          \n";
            ui += gradientGrey0+blue+"                            B           \n";
            ui += gradientGrey0+"              "+gradientGrey103+"    "+gradientGrey0+"  "+gradientGrey103+"    "+gradientGrey0+"              "+gradientGrey1+"  \n";
            ui += gradientGrey0+blue+"             START SELECT           "+gradientGrey1+"  "+backgroundBlack+"\n";
            ui += gradientGrey0+blue+"                                  "+gradientGrey1+"  "+backgroundBlack+"\n";
            ui += gradientGrey1+"                                "+gradientGrey1+"  "+backgroundBlack+"\n";
        } else {
            ui += gradientGrey0+"  "+gradientGrey103+"                                                                    "+gradientGrey0+"  \n";
            ui += gradientGrey0+"  "+blue+"Unicode GAME TUX™                                                     \n";
        }
        ui += reset;

        console.clear();
        // console.log(logs+screen+hud);

        //console.log(logs);

        console.log(ui);

        setTimeout(function(){
            rendered = true;
        }, 1000/fps);
    }
}

var renderClock;
var clock = 0;
var fps = 10;
function start(){
    initSprites();
    clearInterval(renderClock);
    renderClock = setInterval(render,clock);
}

start();

//16 colors
var black = "\u001b[30m";
var red = "\u001b[31m";
var green = "\u001b[32m";
var yellow = "\u001b[33m";
var blue = "\u001b[34m";
var magenta = "\u001b[35m";
var cyan = "\u001b[36m";
var white = "\u001b[37m";
var brightBlack = "\u001b[30;1m";
var brightRed = "\u001b[31;1m";
var brightGreen = "\u001b[32;1m";
var brightYellow = "\u001b[33;1m";
var brightBlue = "\u001b[34;1m";
var brightMagenta = "\u001b[35;1m";
var brightCyan = "\u001b[36;1m";
var brightWhite = "\u001b[37;1m";
//background
var backgroundBlack = "\u001b[40m";
var backgroundRed = "\u001b[41m";
var backgroundGreen = "\u001b[42m";
var backgroundYellow = "\u001b[43m";
var backgroundBlue = "\u001b[44m";
var backgroundMagenta = "\u001b[45m";
var backgroundCyan = "\u001b[46m";
var backgroundWhite = "\u001b[47m";
var backgroundBrightBlack = "\u001b[40;1m";
var backgroundBrightRed = "\u001b[41;1m";
var backgroundBrightGreen = "\u001b[42;1m";
var backgroundBrightYellow = "\u001b[43;1m";
var backgroundBrightBlue = "\u001b[44;1m";
var backgroundBrightMagenta = "\u001b[45;1m";
var backgroundBrightCyan = "\u001b[46;1m";
var backgroundBrightWhite = "\u001b[47;1m";
//256 colors
var darkGreen = "\u001b[38;5;22m";

var gradientGrey0 = "\u001b[48;5;254m";
var gradientGrey1 = "\u001b[48;5;252m";
var gradientGrey2 = "\u001b[48;5;250m";
var gradientGrey3 = "\u001b[48;5;248m";
var gradientGrey4 = "\u001b[48;5;246m";

var gradientGrey103 = "\u001b[48;5;103m";

var gradientMagenta = "\u001b[48;5;88m"

var gradientRed3 = "\u001b[48;5;124m";

var gradientGreen0 = "\u001b[48;5;10m";
var gradientGreen1 = "\u001b[48;5;2m";
var gradientGreen2 = "\u001b[48;5;34m";
var gradientGreen3 = "\u001b[48;5;2m";
var gradientGreen4 = "\u001b[48;5;28m";

var gradientBlue0 = "\u001b[48;5;21m";
var gradientBlue1 = "\u001b[48;5;20m";
var gradientBlue2 = "\u001b[48;5;19m";
var gradientBlue3 = "\u001b[48;5;18m";
var gradientBlue4 = "\u001b[48;5;17m";

var gradientYellow0 = "\u001b[48;5;222m";
var gradientYellow1 = "\u001b[48;5;221m";
var gradientYellow2 = "\u001b[48;5;220m";

var gradientBrown0 = "\u001b[48;5;136m";
var gradientBrown1 = "\u001b[48;5;94m";

var gradientWhite0 = "\u001b[48;5;255m";
var gradientWhite1 = "\u001b[48;5;253m";
var gradientWhite2 = "\u001b[48;5;251m";
var gradientWhite3 = "\u001b[48;5;249m";

var gradientBlack = "\u001b[48;5;232m";
//reset color
var reset = "\u001b[0m";

function renderFoliage(mapTile, mapFoliage){
    var foliage = "";
    if (0.65 <= mapTile && mapTile < 0.75){
        if (mapFoliage < 0.1){ //10%
            foliage = treeSprite;    
        }
    } else if (0.75 <= mapTile && mapTile < 0.95) {
        if (mapFoliage < 0.3){ //30%
            foliage = pineSprite;
        }
    } else if (0.4 <= mapTile && mapTile < 0.55) {
        if (mapFoliage < 0.05){ //5%
            foliage = cactus;
        }
    }

    return foliage;
}

function renderItem(val){
    var item = "";
    if (val>=0.95){
        item = appleSprite;
    }
    return item;
}

function renderPixel(val, background){
    var color = "";

    //0 to +99
    //var formatedValue = val;
    var formatedValue = parseFloat(val*100).toFixed(0);
    if (formatedValue.length<2){
        formatedValue += "  ";
    } else if (formatedValue.length<3){
        formatedValue += " ";
    }
    var pixel = formatedValue;
    pixel = "  ";

    //animated water
    var deepWater = backgroundBlue;
    var waterSprites = [gradientBlue0,gradientBlue1];
    var waterType = getRandomInt(waterSprites.length-1);
    deepWater = waterSprites[waterType];

    var snow = backgroundWhite;
    var glace = backgroundBrightWhite;

    //Map specifications
    //water
    if (val < 0.35) {
        color = deepWater;
    } else if (0.35 <= val && val < 0.4) {
        color = backgroundBrightBlue;
    } 
    //sand
    else if (0.4 <= val && val < 0.55) {
        color = gradientYellow0;
    } 
    //grass
    else if (0.55 <= val && val < 0.65) {
        color = gradientGreen0;
    } 
    else if (0.65 <= val && val < 0.75) {
        color = gradientGreen2;
    } 
    else if (0.75 <= val && val < 0.85) {
        color = gradientGreen4;
    } 
    //dirt
    else if (0.85 <= val && val < 0.90) {
        color = gradientBrown0;
    } 
    else if (0.90 <= val && val < 0.95) {
        color = gradientBrown1;
    } 
    //rock
    else if (0.95 <= val && val < 1.0) {
        color = gradientGrey0;
    } 
    else {
        color = gradientWhite0;
    }

    //obtain pixel or background
    if (background) {
        return color;
    } 
    return color+pixel+reset;
}

//INPUTS
var up = "\033[A";
var down = "\033[B";
var left = "\033[D";
var right = "\033[C";
var ctrlc = "\u0003";
var space = "\u0020";
var enter = "\u000D";
var plus = "+";
var minus = "-";
var esc = "\u001B";

var displayMap = false;

function catchKeys(){
    var stdin = process.stdin;
    stdin.setRawMode( true );
    stdin.resume();
    stdin.setEncoding( 'utf8' );
    stdin.on( 'data', function(key){ 
        inputListener(key);
    });
}
catchKeys();

var playerBlocked = false;
function playerCanMoveTo(direction) {
    playerBlocked = false;
    var x = projectionPlayerX;
    var y = projectionPlayerY;
    switch (direction){
        case "up":
            y--;
            break;
        case "left":
            x--;
            break;
        case "right":
            x++;
            break;
        case "down":
            y++;
            break;
    }
    var canMove = false;
    var val = getMapTile(x,y);
    
    test = x+","+y+" -> "+val;
    if (0.35 <= val && val <= 0.95){
        canMove = true;
    } else {
        playerBlocked = true;
    }
    return canMove;
}

function inputListener(key) {
    var factor = 1/scale;
    switch(key) {
        case space:
            break;
        case ctrlc:
            process.exit();
            break;
        case enter:
            if (showMenu) {
                showMenu = false;
                showGame = true;
            } else if (showGame) {
                if (showDialog) {
                    dialogIndex++;
                    //showDialog = false;
                }
            }
            break;
        case esc:
            showMenu = !showMenu;
            break;
        //player
        case up:
            if (playerCanMoveTo("up")){
                if (!displayMap && playerMoveApplied){
                    playerY -= factor;
                    playerMoveApplied = false;
                }
            }
            break;
        case down:
            if (playerCanMoveTo("down")){
                if (!displayMap && playerMoveApplied){
                    playerY += factor;
                    playerMoveApplied = false;
                }
            }
            break;
        case left:
            if (playerCanMoveTo("left")){
                if (!displayMap && playerMoveApplied){
                    playerX -= factor;
                    playerMoveApplied = false;
                }
            }
            break;
        case right:
            if (playerCanMoveTo("right")){
                if (!displayMap && playerMoveApplied){
                    playerX += factor;
                    playerMoveApplied = false;
                }
            }
            break;
        //settings
        case "o":
            emoji = !emoji;
            initSprites();
            break;
        //camera
        case "4"://left
            cameraX--;
            break;
        case "8"://up
            cameraY--;
            break;
        case "6": //right
            cameraX++;
            break;
        case "2": //down
            cameraY++;
            break;
        case "f":
            fullscreen = !fullscreen;
            if (fullscreen) {
                fullscreenMarge = "                                ";
                screenWidth = 32;
                screenHeight = 32;
            } else {
                fullscreenMarge = "";
                screenWidth = 16;
                screenHeight = 16;
            }
            break;
        case "m"://map
            if (!displayMap){
                //show map from sky
                displayMap = true;
                requestCameraCenter = true;
                scale = minScale;
            } else {
                //return to move game
                scale = maxScale;
                displayMap = false;
                requestCameraCenter = true;
            }
            break;
        case "5": //center
            requestCameraCenter = true;
            break;
        //zoom
        case minus:
            if (scale > minScale){
                requestCameraCenter = true;
                scale--;
            }
            break;
        case plus:
            if (scale < maxScale){
                requestCameraCenter = true;
                scale++;
            }
            break;
        default: return; // exit this handler for other keys
    }
}

//utils
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max+1));
}
