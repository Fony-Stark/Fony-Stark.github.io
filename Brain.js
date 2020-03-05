let ID = 0;

class Animal {
    constructor(x_cord, y_cord, map_height, map_width){
        this.x_cord = x_cord;
        this.y_cord = y_cord;
        this.map_height = map_height;
        this.map_width = map_width;
    }

    make_visible_character(){
        console.log("Hello, I'm creating an animal " + this.y_cord + " is the y_cord")
        console.log("Hello, I'm creating an animal " + this.x_cord + " is the x_cord")
        let RABBIT = 1; let FOX = 2;
        let style_string = "transition: 0.6s; ";

        let elem = document.createElement("div");
        style_string += "font-size:" + (String(36/(this.map_height)) + "vh; ");
        style_string += "position:" + "absolute; ";
        style_string += "top:" + String(66/this.map_height * (this.x_cord+0.25)+1) + "vh; ";
        style_string += "left:" + String(72/(this.map_width) * (this.y_cord+0.25)+1) + "vw; ";
        style_string += "margin:" + "0; ";
        style_string += "padding:" + "0; ";
        elem.setAttribute("id", String(this.id));
        elem.setAttribute("style", style_string);
        switch(this.texture){
            case FOX:
                elem.innerHTML = "🐺";
                break;
            case RABBIT:
                elem.innerHTML = "🐰";
                break;
            default:
                /* Do nothing, this should not happen */
                console.log("This should not happen");
        }
        document.getElementById("simulation").appendChild(elem);
    }

    look_around(){
        console.log("I looked around")
    }

    move_emoji(){
        document.getElementById(String(this.id)).style.top = String(67/this.map_height * (this.x_cord + 1) - 2.3) + "vh";
        document.getElementById(String(this.id)).style.left = String(72/this.map_width * (this.y_cord + 1) - 0.6) + "vw";
    }
}

/*  In the animal list, the texture of the Rabbit is 1 and the texture of the Fox is 2. */
class naught extends Animal{
    constructor(x_cord, y_cord, map_height, map_width){
        super(x_cord, y_cord, map_height, map_width)
        this.texture = 0;
        this.id = 0;
    }
}

class rabbit extends Animal{
    constructor(x_cord, y_cord, map_height, map_width){
        super(x_cord, y_cord, map_height, map_width);
        this.texture = 1;
        this.id = ID++;
        this.hunger = 0;
        this.thirst = 0;
    }
    
    my_priorities(){

    }
}

class fox extends Animal{
    constructor(x_cord, y_cord, map_height, map_width){
        super(x_cord, y_cord, map_height, map_width);
        this.texture = 2;
        this.id = ID++;
    }

    my_priorities(){

    }
}

class tile {
    constructor(basic_value, plant_or_not, A1, A2, A3){
        this.basic = basic_value;
        this.plant = plant_or_not;
        this.animal_1 = A1;
        this.animal_2 = A2;
        this.animal_3 = A3;
    }
}

function main(){
    event_listeners();
    /* document.getElementById("simulation").addEventListener("mouseover", () => {console.log("hey")}); */
}

let reactive_board;
function simulator_start() {
    let HappyFace = [[1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1,1,1], [1,1,1,0,1,1,0,1,1,1], [1,1,1,0,1,1,0,1,1,1], 
    [1,1,1,1,1,1,1,1,1,1], [1,1,1,0,1,1,0,1,1,1], [1,1,1,1,0,0,1,1,1,1], [1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1,1,1]]

    /* Rabbit 🐰 
       Fox   &#x1F43A;
    */
    document.getElementById("simulation").innerHTML = "";

    /* This reads the information, which the user can parse into the input-boxes. */
    let thirst_start = parseInt(document.getElementById("thirst").value);
    let hunger_start = parseInt(document.getElementById("hunger").value);
    let speed_start = parseInt(document.getElementById("speed").value);
    let hp_start = parseInt(document.getElementById("hp").value);
    let map_width = parseInt(document.getElementById("horizontel").value);
    let map_height = parseInt(document.getElementById("vertical").value);
    let game_speed = parseInt(document.getElementById("game_speed").value);
    let number_foxes = parseInt(document.getElementById("foxes").value);
    let when_foxes = parseInt(document.getElementById("when_foxes").value);

    /* This set the value of the variables to the default, if an invalid or no value has been given by the user. */
    thirst_start = check_for_empty(thirst_start, 10);
    hunger_start = check_for_empty(hunger_start, 10);
    speed_start = check_for_empty(speed_start, 10);
    hp_start = check_for_empty(hp_start, 10);
    map_width = check_for_empty(map_width, 40);
    map_height = check_for_empty(map_height, 20);
    game_speed = check_for_empty(game_speed, 100);
    number_foxes = check_for_empty(number_foxes, 1);
    when_foxes = check_for_empty(when_foxes, 20);

    /* This is just a test, to see how to write to the stats bar. */
    document.getElementById("stats1").innerHTML = "Maximum HP on rabbits: " + hp_start;
    document.getElementById("stats2").innerHTML = "Maximum speed for rabbits: " + speed_start;
    document.getElementById("stats3").innerHTML = "minimum hunger limit: " + hunger_start;
    document.getElementById("stats4").innerHTML = "minimum thirst limit: " + thirst_start;

    /* This creates the board. too see more details, please look into the function
       It takes 4 parameters, the height of the map, the width of the map, how many random water blocks should
       be enterd in the first place and how many times it should try to place a new water block. */
    let board_array = create_board(map_width, map_height, (map_width*map_height)/(25), (map_height*map_width)/(0.5));
    
    /* Now, the basic board is written into the DOM in the form of images, in the simulation container. */
    print_board_to_doc(board_array, map_height, map_width);

    /* The reactive map is made. */
    reactive_board = create_reactive_board(map_height, map_width, board_array);
    for(let i = 0; i < map_height; i++){
        for(let j = 0; j < map_width; j++){
            if(reactive_board[i][j].animal_1.texture == 1){
                reactive_board[i][j].animal_1.look_around();
                reactive_board[i][j].animal_1.make_visible_character();

            }
        }
    }
    one_step_simulation(reactive_board, map_height, map_width);
}

function one_step_simulation(reactive_board, map_height, map_width){
    /* reactive_animals(reactive_board, map_height, map_width);
    
    
    */
}

function create_reactive_board(map_height, map_width, basic_board){
    let DIRT = 1; 
    /* Starts by creating a 2d Array, with the proper dimensions. */
    let reactive_board = new Array(map_height);
    for(let i = 0; i < map_height; i++){
        reactive_board[i] = new Array(map_width);
    }

    /* I start refering to the tile, class made at the top of this script. */
    for(let i = 0; i < map_height; i++){
        for(let j = 0; j < map_width; j++){
            reactive_board[i][j] = new tile(basic_board[i][j], 0, new naught(i, j), new naught(i, j), new naught(i, j))
        }
    }

    for(let i = 0; i < 3; i++){
        while(true){
            let x = give_random_int(map_height);
            let y = give_random_int(map_width);

            console.log(x, y)

            if(reactive_board[x][y].basic == DIRT){
                console.log("Please don't!");
                reactive_board[x][y].animal_1 = new rabbit(x, y, map_height, map_width);
                break;
            }
        }
    }

    return reactive_board;
}

function check_for_empty(value, default_value){
    /* This function checks if any of the input fields, are empty. */
    if(value > 0){
        return value;
    } else {
        return default_value;
    }
}

function print_board_to_doc(board, height, width){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            let elem = document.createElement("img");
            elem.setAttribute("src", (board[i][j] == 1) ? ("images/dirt.jpg") : ("images/water.jpg"));
            elem.setAttribute("height", String(100/height + "%"));
            elem.setAttribute("width", String(100/width  + "%"));
            elem.setAttribute("margin", "0");
            elem.setAttribute("padding", "0");
            elem.setAttribute("display", "flex");
            elem.setAttribute("flex-grow", "1");
            elem.setAttribute("alt", (board[i][j] == 1) ? "dirt" : "water");
            document.getElementById("simulation").appendChild(elem);
        }
    }
}

function create_board(board_size_width, board_size_height, random_water, close_water_tiles){
    /* This function will take two whole numbers, board_size_width and board_size_height. and return a n X m array.
    The board_array can be seen as a n X m array, where n is the board_size_width and m is the board size height.

    If this function should be upgraded, look into, make different water creation patternes.

    the board_array, will exist of 1's and 0's, the 1's is a representation of the tile being dirt and a 0 is a representation
    of the tile being water.
    */
    let WATER = 0;
    let DIRT = 1;

    /* I start by making all the tiles in the board_array to be dirt tiles. */
    let board_array = new Array(board_size_height);
    for(let i = 0; i < board_size_height; i++){
        board_array[i] = new Array(board_size_width);
    }

    for(let i = 0; i < board_size_height; i++){
        for(let j = 0; j < board_size_width; j++){
            board_array[i][j] = DIRT;
        }
    }

    console.log(board_array);

    let x_cord;
    let y_cord;
    /* next I randomly place a number of water tiles in the array. */
    for(let i = 0; i < random_water; i++){
        do{
        x_cord = give_random_int(board_size_height);
        y_cord = give_random_int(board_size_width);
        } while(board_array[x_cord][y_cord] == WATER);
            board_array[x_cord][y_cord] = WATER;
    }

    /* I than start finding random places on the map, and depending on how many water blocks is near the tile, it has a higher
    chance of be changed to a water block. 
     */
    for(let i = 0; i < close_water_tiles; i++){
        make_new_tile(board_size_width, board_size_height, board_array)
    }

    board_array = no_single_islands(board_array, board_size_height, board_size_width);

    return board_array;
}

function no_single_islands(board, height, width){
    let WATER = 0;

    for(let k = 0; k < 8; k++){
        for(let i = 0; i < height; i++){
            for(let j = 0; j < width; j++){
                if(water_value(width, height, i, j, board) >= (0.55)){
                    board[i][j] = WATER;
                }
            }
        }
    }

    return board;
}

function give_random_int(high){
    return parseInt(Math.random() * (high));
}

function make_new_tile(board_size_width, board_size_height, board_array){
    /* x, and y, are the cords, for where the new tile should be.
    */
    let WATER = 0;

    let x_cord = give_random_int(board_size_height);
    let y_cord = give_random_int(board_size_width);

    /* the value returned from water_value is between 0 and 1. where 1 is if there is water all around it, and 0 is 
    if there is no water pressented in the adjacent tiles. Each adjacent  */
    let closeness_to_water = water_value(board_size_width, board_size_height, x_cord, y_cord, board_array);

    if(closeness_to_water * 100 + random_diviation() > 50){
        board_array[x_cord][y_cord] = WATER;
        console.log("I made water!")
    }
}

function random_diviation(){
    return Math.random() * 40;
}

function water_value(board_size_width, board_size_height, x, y, board_array){
    let true_water_value = 0;
    let valid = -1;
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            if(valid_tile(i + x, j + y, board_size_height, board_size_width) == true){
                valid += 1;
                if(is_tile_water(i + x, j + y, board_array) == true){
                    true_water_value += 1;
                }
            }
        }
    }
    if(true_water_value > 0 && valid > 0){
        return (true_water_value/valid);
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