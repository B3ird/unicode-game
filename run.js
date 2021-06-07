//npm i -S simplex-noise

var SimplexNoise = require('simplex-noise');

//MAP
var mapSeed = Math.random;
// var mapSeed = 666;
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

var gradientGreen0 = "\u001b[48;5;150m";
var gradientGreen1 = "\u001b[48;5;113m";
var gradientGreen2 = "\u001b[48;5;70m";
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

//Sprites
var treeSprite = "🌳";
var pineSprite = "🌲";
var appleSprite = "🍎"
var cactusSprite = "🌵";

//player sprites
var playerSprites;
var playerFace = "🧑";
var playerBody1 = "\uD83D\uDE4E";
var playerBody2 = "\uD83D\uDE4D";
var playerMap = "🧍";
var playerMap2 = "🚶";
var playerRefusing = "🙅";
var playerGreeting = "🙋";
var playerUsing = "🙇";
var playerAsking = "💁";

var axe = "\uD83E\uDE93";

var emoji = true;

var playerTalk = true;
var playerAsk = false;
var playerUse = false;

var windDirection = 0;

function getPlayerSprites() {
    if (currentScreen == MAPSCREEN) {
        playerSprites = [playerMap,playerMap2];
    } else if (playerBlocked) {
        playerSprites = [playerRefusing];
    } else if (playerUse) {
        playerSprites = [playerUsing];
    } else if (playerAsk) {
        playerSprites = [playerAsking];
    } else if (playerTalk) {
        playerSprites = [playerGreeting];
    } else {
        playerSprites = [playerBody1,playerBody2];
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
var playerMoveAllowed = false;
var playerMoveApplied = false;
var use = false;

//RENDERING
var frame = 0;
var rendered = true;
var introScroll = 0;
var timeIntro = 2000; //ms
var showDialog = false;

//SCREENS
const INTROSCREEN = "introduction_screen";

const HOMESCREEN = "home_screen";
var homeCursor = 0;

const GAMESCREEN = "game_screen";
const OPTIONSCREEN = "option_screen";
const ABOUTSCREEN = "about_screen";

const DETAILSCREEN = "details_screen";
var detailsItem = "unknown";

const INVENTORYSCREEN = "inventory_screen"; 
var inventoryCursor = 0;
var inventoryMaxRows = 14; //max lines displayed
var inventoryScroll = 0; //index of first visible item from list
var inventoryItems = [
        { "name": "leaf", "sprite":"🍂", "count": 0, "craftable": false },
        { "name": "wood", "sprite":"🌲", "count": 0, "craftable": false }, 
        { "name": "rock", "sprite":"🗿", "count": 0, "craftable": false }, 
        { "name": "metal", "sprite":"🔩", "count": 0, "craftable": false },
        { "name": "boat", "sprite":"🚣", "count": 0, "craftable": false },
        { "name": "tent", "sprite": "⛺", "count": 0, "craftable": true, "required": [{"name":"wood","count":3},{"name":"leaf","count":10}] },
        { "name": "fishing rod", "sprite": "🎣", "count": 0, "craftable": true, "required": [{"name":"wood","count":2},{"name":"metal","count":1}] }
        
    ];
//var inventoryItems = ["apple", "rock", "wood", "water"];//, "sand", "car", "boat", "bike", "shovel", "pickaxe", "porc", "chicken", "bee", "bear", "fire"];
var inventorySelectedItem;

const COMPATSCREEN = "compatibilty_screen"
const MAPSCREEN = "map_screen"
var currentScreen = HOMESCREEN;//INTROSCREEN;

//DIALOGS
var dialogIndex = 0;
var dialog = [];
var welcome = [];
welcome[0] = playerFace + " Hello ! My name is Sam,  ";
welcome[1] = "let's discover this world ! ";
dialog.push(welcome);
showDialog = true;

var mapTile;
function getScreenTile(x, y) { //get tile info from screen x y coord
    var mapTile = mapSimplex.noise2D((x+cameraX)/scale, (y+cameraY)/scale);
    mapTile += 0.5 * mapSimplex.noise2D(2*(x+cameraX)/scale, 2*(y+cameraY)/scale);
    mapTile += 0.25 * mapSimplex.noise2D(4*(x+cameraX)/scale, 2*(y+cameraY)/scale);
    if (mapTile < 0) { mapTile *= -1;}
    mapTile = Math.pow(mapTile, 0.4);
    return mapTile;
}

function getMapTile(x, y) { //get tile info from map x y coord
    var mapTile = mapSimplex.noise2D(x/scale, y/scale);
    mapTile += 0.5 * mapSimplex.noise2D(2*x/scale, 2*y/scale);
    mapTile += 0.25 * mapSimplex.noise2D(4*x/scale, 2*y/scale);
    if (mapTile < 0) { mapTile *= -1;}
    mapTile = Math.pow(mapTile, 0.4);
    return mapTile;
}

function getMapFoliage(x, y) {
    var mapFoliage = itemSimplex.noise2D((x+cameraX)/scale, (y+cameraY)/scale);
    if (mapFoliage < 0) { mapFoliage *= -1;}
    return mapFoliage;
}

var logs = "";
var test = "";
var renderScreen = true;
function render(){
    if (renderScreen) {
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

            switch(currentScreen) {
                case INTROSCREEN :
                    for (var i=0; i<screenHeight;i++){
                        if (i==Math.floor(introScroll)){
                            lines.push(black+gradientWhite0+"             B3IRD ®            "+fullscreenMarge);        
                        } else {
                            lines.push(gradientWhite0+"                                "+fullscreenMarge);        
                        }
                    }
                    if (introScroll<screenHeight/2) {
                        introScroll+=0.4;
                    } else {
                        if (timeIntro<=0){
                            currentScreen = HOMESCREEN;
                        }
                        timeIntro -= 1000/fps;
                    }
                    break;
                case COMPATSCREEN : //display emojis test
                    lines.push(white+gradientBlack+"╔══════════"+green+"COMPATIBILITY"+white+"═══════╗"+fullscreenMarge);
                    lines.push(gradientBlack+"║                              ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║Player                        ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║👩 🙍‍ 🙎 🙅 🙆 💁 🙋 🤦 🤷 🙇 ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║Items                         ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║🪓 ⛏ 🔨                       ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║Interface                     ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║❤️ 💔                          ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║Animals                       ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║🐈 🐖 🐟                      ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║Environment                   ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║🌳 🌲 🌴 🌵 🎄                ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║                              ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║                              ║"+fullscreenMarge);
                    lines.push(gradientBlack+"║                              ║"+fullscreenMarge);
                    lines.push(gradientBlack+"╚════════════════════════Escape╝"+fullscreenMarge+reset);
                    break;
                case HOMESCREEN:
                    lines.push(gradientBlue2+"                                "+fullscreenMarge);
                    lines.push(white+gradientBlue2+"     ☁️                       🌤️  "+fullscreenMarge);
                    lines.push(brightWhite+gradientBlue1+"            UNIWORLD            "+fullscreenMarge);
                    lines.push(gradientBlue1+"                        ☁️       "+fullscreenMarge);
                    lines.push(gradientBlue0+"                                "+fullscreenMarge);
                    lines.push(gradientBlue0+" 🌲🌳🌲  🌲    🌲🌲  🌳  🌲🌲   "+fullscreenMarge);
                    lines.push(gradientGreen4+" 🌲              🌲🌲  🏕️   🌲🌲 "+fullscreenMarge);
                    lines.push(gradientGreen4+" 🌲🌲                           "+fullscreenMarge);
                    lines.push(gradientGreen3+"                                "+fullscreenMarge);

                    if (homeCursor == 0) {
                        lines.push(gradientGreen3+"          👉 "+black+"Play               "+fullscreenMarge);
                    } else {
                        lines.push(gradientGreen3+"          🧒 "+white+"Play               "+fullscreenMarge);
                    }
                    if (homeCursor == 1) {
                        lines.push(gradientGreen2+"          👉 "+black+"Options            "+fullscreenMarge);
                    } else {
                        lines.push(gradientGreen2+"          ⚙️  "+white+"Options            "+fullscreenMarge);
                    }
                    if (homeCursor == 2) {
                        lines.push(gradientGreen2+"          👉 "+black+"About              "+fullscreenMarge);
                    } else {
                        lines.push(gradientGreen2+"          📄 "+white+"About              "+fullscreenMarge);
                    }
                    if (homeCursor == 3) {
                        lines.push(gradientGreen1+"          👉 "+black+"Exit               "+fullscreenMarge);
                    } else {
                        lines.push(gradientGreen1+"          🚪 "+white+"Exit               "+fullscreenMarge);
                    }
                    lines.push(gradientGreen1+"                                "+fullscreenMarge);
                    lines.push(gradientGreen0+"                                "+fullscreenMarge);
                    lines.push(gradientGreen0+"      "+green+"© '20.'21  B3IRD inc.     "+fullscreenMarge+reset);
                    break;
                case INVENTORYSCREEN:
                    lines.push(white+gradientBrown1+"╔═══════════"+black+"BACKPACK"+white+"═══════════╗"+fullscreenMarge);
                    for(var i=0; i<inventoryMaxRows; i++) {
                        var line = "";
                        if(i+inventoryScroll == inventoryCursor) {
                            inventorySelectedItem = inventoryItems[i+inventoryScroll];
                            line += black;
                        } else {
                            line += white;
                        }

                        var itemName = "";
                        if(inventoryItems.length >i+inventoryScroll) {
                            itemName += " "+inventoryItems[i+inventoryScroll]["sprite"]+" "+inventoryItems[i+inventoryScroll]["name"]+" x"+inventoryItems[i+inventoryScroll]["count"]
                        }
                        line += itemName;
                        if (itemName.length > 0){
                            line = formatLine(line, 34);
                        } else {
                            line = formatLine(line, 35);
                        }
                        //end line with ui
                        line += fullscreenMarge;

                        lines.push(white+gradientBrown1+"║"+gradientBrown0+line+white+gradientBrown1+"║");
                    }

                    lines.push(white+gradientBrown1+"╚══════════════════════════════╝"+fullscreenMarge+reset);
                    break;
                case DETAILSCREEN:
                    logs += "details of "+detailsItem["name"];
                    lines.push(white+gradientBrown1+"╔═══════╦════"+black+"DETAILS"+white+"═══════════╗"+fullscreenMarge);
                    lines.push(gradientBrown1+"║       ║"+gradientBrown0+"                      "+gradientBrown1+"║"+fullscreenMarge);

                    var title = formatLine("  "+detailsItem["sprite"]+"   ║"+gradientBrown0+black+" Name : "+white+detailsItem["name"], 50);
                    lines.push(gradientBrown1+"║"+title+gradientBrown1+"║"+fullscreenMarge);
                    lines.push(gradientBrown1+"║       ║"+gradientBrown0+"                      "+gradientBrown1+"║"+fullscreenMarge);
                    lines.push(gradientBrown1+"╠═══════╝"+gradientBrown0+"                      "+gradientBrown1+"║"+fullscreenMarge);

                    if (detailsItem["required"] != undefined) {
                        lines.push(gradientBrown1+"║"+gradientBrown0+black+" Required :"+white+"                   "+gradientBrown1+"║"+fullscreenMarge);
                        for (var i=0; i<detailsItem["required"].length; i++) {
                            const itemDetails = inventoryItems.find( item => item.name === detailsItem["required"][i]["name"]);
                            var requirement = formatLine(" ⮡ "+itemDetails["sprite"]+" "+detailsItem["required"][i]["name"]+" x"+detailsItem["required"][0]["count"], 29);
                            lines.push(gradientBrown1+"║"+gradientBrown0+formatLine(requirement, 29)+gradientBrown1+"║"+fullscreenMarge);
                        }
                        for (var i=0; i<(9-detailsItem["required"].length); i++){
                            lines.push(gradientBrown1+"║"+gradientBrown0+"                              "+gradientBrown1+"║"+fullscreenMarge);
                        }
                    } else {
                        for (var i=0; i<10; i++){
                            lines.push(gradientBrown1+"║"+gradientBrown0+"                              "+gradientBrown1+"║"+fullscreenMarge);
                        }
                    }
                    
                    if (detailsItem["required"] != undefined) {
                        lines.push(gradientBrown1+"╚═Escape══════════EnterToCraft═╝"+fullscreenMarge+reset);
                    } else {
                        lines.push(gradientBrown1+"╚═Escape═══════════════════════╝"+fullscreenMarge+reset);
                    }
                    break;
                case OPTIONSCREEN:
                    lines.push(white+backgroundMagenta+"╔════════════"+black+"OPTIONS"+white+"═══════════╗"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ "+black+"INGAME"+white+"                       ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Use arrows to move player   ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press enter to validate     ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press escape to back        ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press space to do something ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press 'M' to show the map   ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press 'I' to show inventory ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║                              ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ "+black+"DEBUG"+white+"                        ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press 'F' for fullscreen    ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Use numpad to move camera   ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press '5' to center camera  ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press '-/+' for camera zoom ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"║ -Press 'I' to check compat   ║"+fullscreenMarge);
                    lines.push(backgroundMagenta+"╚════════════════════════Escape╝"+fullscreenMarge+reset);
                    break;
                case ABOUTSCREEN:
                    lines.push(white+backgroundBlue+"╔═════════════"+black+"ABOUT"+white+"════════════╗"+fullscreenMarge);
                    lines.push(backgroundBlue+"║                              ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ 🙋 Hello and welcome on this ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ small open world. I'm B3ird  ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ the developer of this game.  ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║                              ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ It was a challenge for me to ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ make a colorfull 2D playable ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ world in a terminal.         ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║                              ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ I hope you will like it !    ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║                              ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║ Stay tuned for next update ! ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║                              ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"║                              ║"+fullscreenMarge);
                    lines.push(backgroundBlue+"╚════════════════════════Escape╝"+fullscreenMarge+reset);
                    break;
                case GAMESCREEN:
                case MAPSCREEN:
                    var windChange = getRandomInt(20);
                    if (windChange==1){
                        if (windDirection == 0){
                            windDirection = 1;
                        } else {
                            windDirection = 0;
                        }
                    }
                    

                    for(var y = 0; y < screenHeight; y++) { 
                        var line="";
                        for(var x = 0; x < screenWidth; x++) {
                            line += renderScreenPixel(x, y);
                        }
                        lines.push(line);
                    }

                    //HUD
                    var clocks = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"]
                    var hour = Math.floor((frame/100) % 12);
                    logs+=hour;
                    var clock = clocks[hour];

                    var windIndicator = "";
                    if (windDirection == 0){
                        windIndicator = "🌬️ ⬅️ ";
                    } else {
                        windIndicator = "🌬️ ➡️ ";
                    }

                    if (currentScreen != MAPSCREEN) {
                        if (fullscreen){
                            lines[0] = gradientBlack+"❤️ ❤️ 💔                         "+clock+"                           "+windIndicator;
                        } else {
                            lines[0] = gradientBlack+"❤️ 💔💔         "+clock+"           "+windIndicator;
                        }
                    }

                    frame++;
        // 
                    if (currentScreen != MAPSCREEN && showDialog){
                        if (dialogIndex<=dialog.length-1) {
                            playerMoveAllowed = false;
                            var message = dialog[dialogIndex];
                            //footer
                            var footerLines = 1;
                            if (fullscreen){
                                lines[lines.length-1] = gradientBlack+"╚═════════════════════════════════════════════════════════"+green+"Enter"+white+"╝";
                            } else {
                                lines[lines.length-1] = gradientBlack+"╚═════════════════════════"+green+"Enter"+white+"╝";
                            }

                            //body
                            for (var d=0; d<message.length;d++){
                                lines[lines.length-1-d-footerLines] = gradientBlack+"║ "+message[message.length-1-d]+fullscreenMarge+" ║";
                            }

                            //header
                            if (fullscreen){
                                lines[lines.length-1-message.length-1] = gradientBlack+"╔══════════════════════════════════════════════════════════════╗";    
                            } else {
                                lines[lines.length-1-message.length-1] = gradientBlack+"╔══════════════════════════════╗";    
                            }
                            
                        } else {
                            showDialog = false;
                            playerMoveAllowed = true;
                            playerTalk = false;
                            playerBlocked = false;
                            playerAsk = false;
                            playerUse = false;
                            use = false;
                        }
                    }
                    break;
            }

            playerMoveApplied = true;

            //display screen
            for (var l=0; l<lines.length;l++){
                ui += gradientGrey0+"  "+gradientGrey103+"  "+lines[l]+gradientGrey103+"  "+gradientGrey0+"  \n";   
            }

            if (!fullscreen){
                ui += gradientGrey0+"  "+gradientGrey103+"                                    "+gradientGrey0+"  \n";
                ui += gradientGrey0+"  "+blue+"GAME B3IRD™                           \n";
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
                ui += gradientGrey0+"  "+blue+"GAME B3IRD™                                                           \n";
            }
            ui += reset;

            console.clear();
            // console.log(logs+screen+hud);

            // console.log(logs);

            console.log(ui);

            setTimeout(function(){
                rendered = true;
            }, 1000/fps);
        }
    }
}

var renderClock;
var clock = 0;
var fps = 10;
function start(){
    clearInterval(renderClock);
    renderClock = setInterval(render,clock);
}

start();


function getTileType(x, y){
    var mapTile = getScreenTile(x,y);
    var mapFoliage = getMapFoliage(x, y);
    var foliageType = getFoliageType(mapTile, mapFoliage);
    return foliageType;//TODO check other types no foliage
}

function renderScreenPixel(x, y, showPlayer = true) { //all layers
    //deep map
    var mapTile = getScreenTile(x,y);

    //inventoryItems map
    // var mapItem = itemSimplex.noise2D((x+cameraX)/scale, (y+cameraY)/scale);
    // if (mapItem < 0) { mapItem *= -1;}

    //foliage
    var mapFoliage = getMapFoliage(x, y);
    // var mapFoliage = itemSimplex.noise2D((x+cameraX)/scale, (y+cameraY)/scale);
    // if (mapFoliage < 0) { mapFoliage *= -1;}

    if (showPlayer && projectionPlayerX == (x+cameraX) && projectionPlayerY == (y+cameraY)){
        return renderMap(mapTile, true)+playerSprites[frame%playerSprites.length]+reset;
    } else {
        var f = renderFoliage(getFoliageType(mapTile, mapFoliage));
        if (f != ""){
            return renderMap(mapTile, true)+f+reset;
        } else {
            return renderMap(mapTile, false)+reset;
        }
    }
}

function getFoliageType(mapTile, mapFoliage){
    var foliage = "";
    if (0.65 <= mapTile && mapTile < 0.75){
        if (mapFoliage < 0.1){ //10%
            foliage = "tree";    
        }
    } else if (0.75 <= mapTile && mapTile < 0.85) {
        if (mapFoliage < 0.3){ //30%
            foliage = "pine";
        }
    } else if (0.4 <= mapTile && mapTile < 0.55) {
        if (mapFoliage < 0.05){ //5%
            foliage = "cactus";
        }
    }
    return foliage;
}

function renderFoliage(type){
    var sprite = "";
    switch(type){
        case "tree":
            sprite = treeSprite;
            break;
        case "pine":
            sprite = pineSprite;
            break;
        case "cactus":
            sprite = cactusSprite;
            break;
    }
    return sprite;
}

function renderItem(val){
    var item = "";
    if (val>=0.95){
        item = appleSprite;
    }
    return item;
}

function renderMap(val, background){
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
    var waterBackgrounds = [gradientBlue0/*,gradientBlue1*/];
    var waterBackgroundId = getRandomInt(waterBackgrounds.length-1);
    var waterBackground = waterBackgrounds[waterBackgroundId];

    var waterSprites = [" ˞", "  "];
    var waterSpriteId = getRandomInt(waterSprites.length-1);
    var waterSprite = waterSprites[waterSpriteId];

    //animated grass
    var grassSprites = [" ˎ", " ˏ"];
    animatedGrass = grassSprites[windDirection];

    var grassSprites2 = [" ◝", " ◜"];
    animatedGrass2 = grassSprites2[windDirection];

    var snow = backgroundWhite;
    var glace = backgroundBrightWhite;

    //Map specifications
    //water
    if (val < 0.35) {
        pixel = blue+waterSprite;
        color = waterBackground;
    } else if (0.35 <= val && val < 0.4) {
        color = backgroundBrightBlue;
    } 
    //sand
    else if (0.4 <= val && val < 0.55) {
        pixel = yellow+"⋅ "
        color = gradientYellow0;
    } 
    //grass
    else if (0.55 <= val && val < 0.65) {
        pixel = green+animatedGrass;
        color = gradientGreen0;
    } 
    else if (0.65 <= val && val < 0.75) {
        pixel = green+animatedGrass2;
        color = gradientGreen2;
    } 
    else if (0.75 <= val && val < 0.85) {
        pixel = green+"⋎ ";
        color = gradientGreen4;
    } 
    //dirt
    else if (0.85 <= val && val < 0.90) {
        pixel = yellow+"∴ ";
        color = gradientBrown0;
    } 
    else if (0.90 <= val && val < 0.95) {
        pixel = yellow+"⋱ ";
        color = gradientBrown1;
    } 
    //rock
    else if (0.95 <= val && val < 0.96) {
        pixel = white+"▚▙";
        color = gradientGrey1;
    } 
    else {
        pixel = white+"▟▛";
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

function playerAction() {
    if(!use){
        use = true;
        //get player screen pixel coordinate
        var x = projectionPlayerX-cameraX;
        var y = projectionPlayerY-cameraY;

        

        var pixelType = getTileType(x,y);
        switch(pixelType){
            case "tree":
                var useDialog = [];
                useDialog[0] = " 🍂 Sam took a leaf and put ";
                useDialog[1] = " it in the bag !            ";
                dialog.push(useDialog);
                showDialog = true;
                var leafItem = getItem("leaf")
                leafItem["count"]++;
                break;
            default:
                //talk about it
                var useDialog = [];
                useDialog[0] = " What can I do with "+renderScreenPixel(x,y, false)+gradientBlack+" ?    ";
                useDialog[1] = "                            ";
                dialog.push(useDialog);
                playerAsk = true;
                showDialog = true;
        }
    }
}

var playerBlocked = false;
function playerCanMoveTo(direction) {
    var canMove = false;
    if (playerMoveAllowed && playerMoveApplied && currentScreen == GAMESCREEN) {
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
        
        var val = getMapTile(x,y);
        
        test = x+","+y+" -> "+val;
        if (0.35 <= val && val <= 0.96){
            canMove = true;
        } else {
            playerBlocked = true;
            //talk about it
            playerMoveAllowed = false;
            var firstBlock = [];
            firstBlock[0] = playerFace + " Oh, the way is blocked   ";
            firstBlock[1] = "I can't go further...       ";
            dialog.push(firstBlock);
            showDialog = true;
        }
    }
    return canMove;
}

function inputListener(key) {
    var factor = 1/scale;
    switch(key) {
        case space:
            playerAction()
            break;
        case ctrlc:
            process.exit();
            break;
        case enter:
            switch(currentScreen){
                case HOMESCREEN:
                    switch (homeCursor) {
                        case 0:
                            currentScreen = GAMESCREEN;
                            break;
                        case 1:
                            currentScreen = OPTIONSCREEN;
                            break;
                        case 2:
                            currentScreen = ABOUTSCREEN;
                            break;
                        case 3:
                            process.exit(1);
                    }
                    break;
                case GAMESCREEN :
                    if (showDialog) {
                        dialogIndex++;
                    }
                    break;
                case INVENTORYSCREEN :
                    currentScreen = DETAILSCREEN;
                    detailsItem = inventoryItems[inventoryCursor];
            }
            break;
        case esc:
            switch(currentScreen){
                case COMPATSCREEN:
                    currentScreen = OPTIONSCREEN;
                    break;
                case INVENTORYSCREEN:
                    currentScreen = GAMESCREEN;
                    break;
                case DETAILSCREEN:
                    currentScreen = INVENTORYSCREEN;
                    break;
                default :
                    currentScreen = HOMESCREEN;
                    break;
            }
            break;
        //player
        case up:
            switch (currentScreen) {
                case HOMESCREEN:
                    if (homeCursor > 0){
                        homeCursor--;
                    }
                    break;
                case GAMESCREEN:
                    if (playerCanMoveTo("up")){
                        playerY -= factor;
                        playerMoveApplied = false;
                    }
                    break;
                case INVENTORYSCREEN:
                    if (inventoryCursor > 0){
                        inventoryCursor--;
                    }
                    if (inventoryCursor < inventoryScroll) {
                        inventoryScroll--;
                    }
                    break;
            }
            break;
        case down:
            switch (currentScreen) {
                case HOMESCREEN:
                    if (homeCursor < 3){
                        homeCursor++;
                    }
                    break;
                case GAMESCREEN:
                    if (playerCanMoveTo("down")){
                        playerY += factor;
                        playerMoveApplied = false;
                    }
                    break;
                case INVENTORYSCREEN:
                    if (inventoryCursor < inventoryItems.length-1){
                        inventoryCursor++;
                    }
                    if (inventoryCursor >= inventoryScroll+inventoryMaxRows) {
                        inventoryScroll++;
                    }
                    break;
                case CRAFTSCREEN:
                    if (craftCursor < craftItems.length-1){
                        craftCursor++;
                    }
                    if (craftCursor >= craftScroll+craftMaxRows) {
                        craftScroll++;
                    }
                    break;
            }
            break;
        case left:
            if (playerCanMoveTo("left")){
                playerX -= factor;
                playerMoveApplied = false;
            }
            break;
        case right:
            if (playerCanMoveTo("right")){
                playerX += factor;
                playerMoveApplied = false;
            }
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
        case "i":
            switch(currentScreen){
                case OPTIONSCREEN:
                    currentScreen = COMPATSCREEN;
                    break;
                case GAMESCREEN :
                    currentScreen = INVENTORYSCREEN;
                    break;
                case INVENTORYSCREEN :
                    currentScreen = GAMESCREEN;
                    break;
            }
            break;
        case "p": //pause
            //renderScreen = !renderScreen;
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
            switch(currentScreen){
                case GAMESCREEN:
                    scale = minScale;
                    requestCameraCenter = true;
                    currentScreen = MAPSCREEN;
                    break;
                case MAPSCREEN :
                    scale = maxScale;
                    requestCameraCenter = true;
                    currentScreen = GAMESCREEN;
                    break;
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

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

//complete line to end screen
function formatLine(startLine, maxCharacters) {
    var endLine = "";
    var charToAdd = maxCharacters - countCodePoints(startLine);//startLine.length;//
    for (var j=0; j<charToAdd; j++) {
        endLine += " ";
    }
    return startLine+endLine;
}

function countCodePoints(str) {
  var point;
  var index;
  var width = 0;
  var len = 0;
  for (index = 0; index < str.length;) {
      point = str.codePointAt(index);
      width = 0;
      while (point) {
          width += 1;
          point = point >> 8;
      }
      index += Math.round(width/2);
      len += 1;
  }
  return len;
}

function getItem(name) {
    var item = inventoryItems.find( item => item.name === name);
    return item;
}