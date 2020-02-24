function main(){
    event_listeners();
    document.getElementById("simulation").addEventListener("mouseover", () => {console.log("hey")});
}

function simulator_start() {
    let thirst_start = Number(document.getElementById("thirst").value);
    let hunger_start = Number(document.getElementById("hunger").value);
    let speed_start = Number(document.getElementById("speed").value);
    let hp_start = Number(document.getElementById("hp").value);

    document.getElementById("stats1").innerHTML = "Maximum HP on rabbits: " + (hp_start > 0 ? hp_start : 10);
    document.getElementById("stats2").innerHTML = "Maximum speed for rabbits: " + (speed_start > 0 ? speed_start : 10);
    document.getElementById("stats3").innerHTML = "minimum hunger limit: " + (hunger_start > 0 ? hunger_start : 10);
    document.getElementById("stats4").innerHTML = "minimum thirst limit: " + (thirst_start > 0 ? thirst_start : 10);

    let height = 20;
    let width = 40;
    let board_array = create_board(height, width, 10, 40);
    
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            let elem = document.createElement("img")
            elem.setAttribute("src", (board_array[i][j] == 1) ? ("images/dirt.jpg") : ("images/water.jpg"));
            elem.setAttribute("height", String(90/height + "%"));
            elem.setAttribute("width", String(100/width  + "%"));
            elem.setAttribute("margin", "0");
            elem.setAttribute("padding", "0");
            elem.setAttribute("display", "inline");
            elem.setAttribute("alt", (board_array[i][j] == 1) ? "dirt" : "water");
            document.getElementById("simulation").appendChild(elem)
        }
    }
}

function create_board(board_size_width, board_size_height, random_water, close_water_tiles){
    /* This function will take two whole numbers, board_size_width and board_size_height. and return a n X m array.
    The board_array can be seen as a n X m array, where n is the board_size_width and m is the board size height.

    If this function should be upgraded, look into, make different water creation patternes.

    the board_array, will exist of 1's and 0's, the 1's is a representation of the tile being grass and a 0 is a representation
    of the tile being water.
    */
    let WATER = 0;
    let GRASS = 1;

    /* I start by making all the tiles in the board_array to be grass tiles. */
    let board_array = new Array(board_size_height);
    for(let i = 0; i < board_size_height; i++){
        board_array[i] = new Array(board_size_width);
    }

    for(let i = 0; i < board_size_height; i++){
        for(let j = 0; j < board_size_width; j++){
            board_array[i][j] = GRASS;
        }
    }

    /* next I randomly place a number of water tiles in the array. */
    for(let i = 0; i < random_water; i++){
        board_array[give_random_int(board_size_height)][give_random_int(board_size_width)] = WATER;
    }

    /* I than start finding random places on the map, and depending on how many water blocks is near the tile, it has a higher
    chance of be changed to a water block. 
     */
    for(let i = 0; i < close_water_tiles; i++){
        make_new_tile(board_size_width, board_size_height, board_array)
    }

    return board_array;
}

function give_random_int(high){
    return parseInt(Math.random() * (high - 1));
}

function make_new_tile(board_size_width, board_size_height, board_array){
    /* x, and y, are the cords, for where the new tile should be.
    */
    let GRASS = 1;
    let WATER = 0;

    let x_cord = give_random_int(board_size_height);
    let y_cord = give_random_int(board_size_width);

    /* the value returned from water_value is between 0 and 1. where 1 is if there is water all around it, and 0 is 
    if there is no water pressented in the adjacent tiles. Each adjacent  */
    let closeness_to_water = water_value(board_size_width, board_size_height, x_cord, y_cord, board_array);

    if(closeness_to_water * 100 * Math.random > 60){
        board_array[x_cord][y_cord] = WATER;
    } else {
        board_array[x_cord][y_cord] = GRASS;
    }
}

function water_value(board_size_width, board_size_height, x, y, board_array){
    let water_value = 0;
    let valid = 0;
    for(let i = -1; i < 1; i++){
        for(let j = -1; j < 1; j++){
            if(valid_tile(i + x, j + y, board_size_height, board_size_width) == true){
                valid += 1;
                if(is_tile_water(i + x, j + y, board_array) == true){
                    water_value += 1;
                }
            }
        }
    }
    if(water_value > 0 && valid > 0){
        return (water_value/valid);
    }
    else {
        return 0;
    }
}
function is_tile_water(x, y, board){
    let WATER = 0;

    if(board[x][y] == WATER){
        return true;
    } else {
        return false;
    }
}

function valid_tile(x, y, board_size_height, board_size_width){
    if((x >= 0) && (x < board_size_height) && (y >= 0) && (y < board_size_width)){
        return true;
    } else {
        return false;
    }
}

function event_listeners(){
    function mouse_over(){
        toggle_left_bar = 1;
        document.getElementById("left_side_bar").style.width = "17vw";
        document.getElementById("head_side_bar").style.display = "block";
        document.getElementById("body_side_bar").style.display = "block";
        document.getElementById("foot_side_bar").style.display = "block";
    }

    function mouse_away(){
        toggle_left_bar = 0;
        document.getElementById("left_side_bar").style.width = "4vw"
        document.getElementById("head_side_bar").style.display = "none";
        document.getElementById("body_side_bar").style.display = "none";
        document.getElementById("foot_side_bar").style.display = "none";
    }

    function open_advanced_settings(){
        if(toggle_settings == 0){
            toggle_settings = 1
            document.getElementById("user_modification").style.height = "27vh";
            document.getElementById("advanced_seetings_bar").style.height = "12.5vh";
            document.getElementById("bottom_facts").style.height = "0px";
            document.getElementById("container").style.height = "70vh";
            /* document.getElementById("advanced_hidden").style.display = "block"; */
        } else {
            toggle_settings = 0;
            document.getElementById("user_modification").style.height = "15.5vh";
            document.getElementById("advanced_seetings_bar").style.height = "0";
            document.getElementById("bottom_facts").style.height = "10vh";
            document.getElementById("container").style.height = "81vh";
            /* document.getElementById("advanced_hidden").style.display = "none"; */
        }

    }
    let toggle_left_bar = 0;
    let toggle_settings = 0;

    document.getElementById("left_side_bar").addEventListener("mouseover", () => mouse_over());
    document.getElementById("left_side_bar").addEventListener("mouseout", () => mouse_away());
    document.getElementById("left_side_bar").addEventListener("click", () => (toggle_left_bar == 0 ? mouse_over() : mouse_away()));
    document.getElementById("settings_logo_box").addEventListener("click", () => open_advanced_settings());
}



main();