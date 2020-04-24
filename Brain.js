let ID = 1;

class Animal {
    constructor(x_cord, y_cord, map_height, map_width, ticks = 0){
        /* Sex means wether or not it wants to have the sex. if sex = 0, it doesn't want to have it 
        if sex = 1 it wants the D and if sex >= 2 it is pregnate. It will give birth when it reaches 10. */
        this.sex = 0;

        this.x_cord = x_cord;
        this.y_cord = y_cord;
        this.map_height = map_height;
        this.map_width = map_width;
        this.last_x = x_cord;
        this.last_y = y_cord;
        this.id = ID;
        this.birth = ticks;

        /* This is the objects internal watch, comparing to wether or not it is time for it move or not. */
        this.ticks = ticks;
        ID++;
    }

    make_visible_character(){
        /* console.log("Hello, I'm creating an animal " + this.y_cord + " is the y_cord")
        console.log("Hello, I'm creating an animal " + this.x_cord + " is the x_cord") */
        let RABBIT = 1; let KIT = 1.5; let FOX = 2; let PLANT = 3; let DEVIL = 666;
        let style_string = "transition: 0.6s; ";

        /* let elem = document.createElement("div"); */
        let elem = document.createElement("img");

        style_string += "width: " + (String(35/(this.map_width)) + "vw; ");
        style_string += "height: " + (String(32.5/(this.map_height)) + "vh; ");
        style_string += "position:" + "absolute; ";
        style_string += "user-select: none; ";
        style_string += "top:" + String(67/this.map_height * (this.x_cord + 0.25) + 1) + "vh; ";
        style_string += "left:" + String(72/(this.map_width) * (this.y_cord + 0.25) + 1) + "vw; ";
        style_string += "margin:" + "0; ";
        style_string += "padding:" + "0; ";
        elem.setAttribute("id", String(this.id));
        elem.setAttribute("style", style_string);
        switch(this.texture){
            case FOX:
                elem.setAttribute("src", "images/wolf.png");
                break;
            case RABBIT:
                elem.setAttribute("src", "images/rabbit2.png");
                break;
            case KIT:
                elem.setAttribute("src", "images/kit.png");
                break;
            case PLANT:
                elem.setAttribute("src", "images/clover.png");
                break
            case DEVIL:
                elem.setAttribute("src", "red_square.JPG");
                break;
            default:
                /*  Do nothing, this should not happen */
                console.log("This should not happen: WRONG TEXTURE FOR ELEMENT", this);
        } 
        document.getElementById("simulation").appendChild(elem);
    }

    look_around(view, reactive_board){
        let temp_x;
        let temp_y;

        let array2d = Array(view*2 + 1);
        for(let i = 0; i <= view*2; i++){
            array2d[i] = Array(view*2 + 1);
        } 
        for(let i = -3; i <= view; i++){
            for(let j = -3; j <= view; j++){
                if((i + this.x_cord >= 0) && (j + this.y_cord >= 0) && (i + this.x_cord < this.map_height) && (j + this.y_cord < this.map_width) && (normerisk(i) + normerisk(j) < 5)){
                    temp_x = i + 3;
                    temp_y = j + 3;
                    array2d[temp_x][temp_y] = reactive_board[i + this.x_cord][j + this.y_cord];
                }
            }
        }
        console.log(array2d);
        return array2d;
    }

    move_emoji(){
        let random = Math.random() * 0.2;
        let sigma_x = 0.15 + random;

        random = Math.random() * 0.2;
        let sigma_y = 0.15 + random;

        document.getElementById(String(this.id)).style.top  = String(67/this.map_height * (this.x_cord + sigma_x) + 1) + "vh";
        document.getElementById(String(this.id)).style.left = String(72/this.map_width  * (this.y_cord + sigma_y) + 1) + "vw";
    }

    my_priorities(){
        /* hungry = 1; thirsty = 2; horny = 3; discover = 4; */
        let largest = this.discover;
        let code_to_return = 4;

        if(this.sex == 1 && (this.hunger >= 25 || this.thirst >= 25)){
            this.sex = 0;
        }
        if(this.hunger > largest){
            largest = this.hunger;
            code_to_return = 1;
        }
        if(this.thirst > largest){
            largest = this.thirst;
            code_to_return = 2;
        }
        if(this.horny > largest && this.hunger < 25 && this.thirst < 25){
            largest = this.hunger;
            code_to_return = 3;
            this.sex = 1;
        }

        return code_to_return;
    }

    make_a_move(reactive_board){
        let HUNGRY = 1; let THIRSTY = 2; let HORNY = 3; let DISCOVER = 4;
        let NAUGHT = 0; let RABBIT = 1; let KIT = 1.5; let FOX = 2; let PLANT = 3; let WATER = 4;
        let higest_priority = this.my_priorities();
        let need; let road;
        let current_tile = reactive_board[this.x_cord][this.y_cord];
        switch(higest_priority){
            case HUNGRY:
                need = (this.texture == RABBIT || this.texture == KIT) ? PLANT : RABBIT;

                if(current_tile.plant.texture == PLANT && need == PLANT){
                    this.eat(reactive_board);
                    return 200;
                } else if(current_tile.free_animal_space(RABBIT) && need == RABBIT){
                    this.eat(reactive_board);
                    return 200;
                }

                break;
            case THIRSTY:
                if(this.next_to_water(this.x_cord, this.y_cord, reactive_board) == 200){
                    this.drink(reactive_board);
                    return 200;
                }

                need = WATER;
                break;
            case HORNY:
                if(current_tile.animal_1.sex == 1 && current_tile.animal_1.texture == this.texture && current_tile.animal_1.id != this.id){
                    this.reproduce(reactive_board);
                    this.ticks += 8;
                    return 200;
                } 
                else if(current_tile.animal_2.sex == 1 && current_tile.animal_2.texture == this.texture && current_tile.animal_2.id != this.id){
                    this.reproduce(reactive_board);
                    this.ticks += 8;
                    return 200;
                } 
                else if(current_tile.animal_3.sex == 1 && current_tile.animal_3.texture == this.texture && current_tile.animal_3.id != this.id){
                    this.reproduce(reactive_board);
                    this.ticks += 8;
                    return 200;
                }

                need = (this.texture == RABBIT) ? RABBIT : FOX;
                break;
            case DISCOVER:
                need = NAUGHT;
                break;
            default:
                /* Should not happen */
                console.log("SOmething wants something, which is not hard-coded");
        }
        if(need != NAUGHT){
            road = this.find_way(need, reactive_board);
        }

        if(need == NAUGHT || road == 400){
            let new_move = this.go_discover(reactive_board);
            this.move_actual_position(new_move[0], new_move[1], reactive_board);
            this.move_emoji();

        } else {
            let new_x = road[0][1];
            let new_y = road[1][1];
            this.move_actual_position(new_x, new_y, reactive_board);
            this.move_emoji();
        }

        if(this.last_x - this.x_cord != 0 && this.last_y - this.y_cord != 0){
            this.ticks += 8;
        } else {
            this.ticks += 5.65
        }

        return 200;
    }

    go_discover(reactive_board, iterations = 0){
        let DIRT = 1; let NAUGHT = 0;
        let x_direction = this.x_cord - this.last_x;
        let y_direction = this.y_cord - this.last_y;

        if((x_direction + this.x_cord < this.sight - 1 && x_direction < 0) || (x_direction + this.x_cord > (this.map_height - this.sight) && x_direction > 0)){
            x_direction = 0;
        }
        if((y_direction + this.y_cord < this.sight - 1 && y_direction < 0) || (y_direction + this.y_cord > (this.map_width - this.sight) && y_direction > 0)){
            y_direction = 0;
        }

        if((x_direction == 0 && y_direction == 0) || iterations == 1){
            while(true){
                if(Math.random() >= 0.5){
                    x_direction = (Math.random() >= 0.25) ? 1  : 0;
                } else {
                    x_direction = (Math.random() >= 0.25) ? -1 : 0;
                }

                if(Math.random() >= 0.5){
                    y_direction = (Math.random() >= 0.25) ? 1  : 0;
                } else {
                    y_direction = (Math.random() >= 0.25) ? -1 : 0;
                }
                if(this.x_cord + x_direction >= 0 && this.x_cord + x_direction < this.map_height && this.y_cord + y_direction >= 0 && this.y_cord + y_direction < this.map_width &&
                    reactive_board[this.x_cord + x_direction][this.y_cord + y_direction].basic == DIRT && !(y_direction == 0 && x_direction == 0 ) &&
                    reactive_board[this.x_cord + x_direction][this.y_cord + y_direction].free_animal_space(NAUGHT) == 200){
                    return [this.x_cord + x_direction, this.y_cord + y_direction];
                }
            }
        } else {
            if(this.x_cord + x_direction >= 0 && this.x_cord + x_direction < this.map_height && this.y_cord + y_direction >= 0 && this.y_cord + y_direction < this.map_width &&
                reactive_board[x_direction + this.x_cord][y_direction + this.y_cord].basic == DIRT && 
                reactive_board[x_direction + this.x_cord][y_direction + this.y_cord].free_animal_space(NAUGHT) == 200){
                    
                    return [this.x_cord + x_direction, this.y_cord + y_direction];
            }
            else if(this.y_cord + y_direction >= 0 && this.y_cord + y_direction < this.map_width &&
                reactive_board[this.x_cord][y_direction + this.y_cord].basic == DIRT && 
                reactive_board[this.x_cord][y_direction + this.y_cord].free_animal_space(NAUGHT) == 200){

                    return [this.x_cord, this.y_cord + y_direction];
            }
            else if(this.x_cord + x_direction >= 0 && this.x_cord + x_direction < this.map_height &&
                reactive_board[x_direction + this.x_cord][this.y_cord].basic == DIRT && 
                reactive_board[x_direction + this.x_cord][this.y_cord].free_animal_space(NAUGHT) == 200){
                    
                    return [this.x_cord + x_direction, this.y_cord];
            }
            else {
                return this.go_discover(reactive_board, iterations + 1);
            }
        }
    }

    find_way(wanted_texture, reactive_board){
        let DIRT = 1;
        let NAUGHT = 0; let RABBIT = 1; let FOX = 2; let PLANT = 3; let WATER = 4;
        let posible_roads = [[[this.x_cord], [this.y_cord]]];
        let found = 0;
        let iterations = 0;
        let dublicate = 0;
        let new_path;

        while(true){
            if(posible_roads.length == 0){
                return 400;
            }

            let new_path_2 = give_me_a_copy(posible_roads[0]);
            let last_cordinate = new_path_2[0].length - 1;
            let last_x = new_path_2[0][last_cordinate];
            let last_y = new_path_2[1][last_cordinate];
            let i_and_j = [[0,1],[1,0],[0,-1],[-1,0], [1,1],[1,-1],[-1,1],[-1,-1]];
            let i, j;

            for(let k = 0; k < i_and_j.length; k++){
                i = i_and_j[k][0];
                j = i_and_j[k][1];

                new_path = [];
                new_path = give_me_a_copy(new_path_2);

                dublicate = 0;
                for(let k = 0; k < new_path[0].length; k++){
                    if(new_path[0][k] == (last_x + i) && new_path[1][k] == (last_y + j)){
                        dublicate = 1;
                    }
                }

                if(dublicate == 0 && last_x + i >= 0 && last_y + j >= 0 && last_x + i < this.map_height && last_y + j < this.map_width &&
                        reactive_board[last_x + i][last_y + j].basic == DIRT && reactive_board[last_x + i][last_y + j].free_animal_space(NAUGHT) == 200){
                    new_path[0].push(last_x + i);
                    new_path[1].push(last_y + j);
                    posible_roads.push(new_path);
                    // console.log("This is last_x + i:", last_x + i, "And this is last_y + j:", last_y + j);
                    // console.log("This is new:", new_path);
                    // console.log("This is posible:", posible_roads);

                    switch(wanted_texture){
                        case RABBIT:
                            if((this.texture == RABBIT) ? (this.avaliable_sex_partner(last_x + i, last_y + j, reactive_board)  == 200) : (reactive_board[last_x + i][last_y + j].free_animal_space(RABBIT) == 200)){
                                found = 1;
                            }
                            break;
                        case FOX:
                            if(reactive_board[last_x + i][last_y + j].free_animal_space(FOX) == 200 && (this.texture == FOX) ? (this.avaliable_sex_partner(last_x + i, last_y + j, reactive_board)  == 200) : true){
                                found = 1;
                            }
                            break;
                        case PLANT:
                            if(reactive_board[last_x + i][last_y + j].plant.texture == PLANT){
                                found = 1;
                            }
                            break;
                        case WATER:
                            if(this.next_to_water(last_x + i, last_y + j, reactive_board) == 200){
                                found = 1;
                            }
                            break;
                        default:
                            console.log("This should not happen, something wanted something that doesn't have a texture which is not defined.");
                            console.log("ID of object:", this.id, "  texture of object:", this.texture);
                    }

                    if(found == 1){
                        //console.log("I actually found a way to", wanted_texture);
                        /*
                        console.log(new_path);
                        console.log(posible_roads);
                        for(let s = 0; s < new_path[0].length; s++){
                            let me_die_x = new_path[0][s];
                            let me_die_y = new_path[1][s];
                            let me_die = reactive_board[me_die_x][me_die_y];
                            me_die.animal_1 = new REDALERT(me_die_x, me_die_y, this.map_height, this.map_width);
                            me_die.animal_1.make_visible_character();
                        }
                        return 3;
                        */
                        return new_path;
                    }
                }
            }
            posible_roads = remove_first_element(posible_roads);
            iterations += 1;
            if(iterations >= 10){
                break;
            }
        }
        // console.log("I failed to find a way to ", wanted_texture);
        return 400;
    }

    next_to_water(x_cord, y_cord, reactive_board){
        let WATER = 0;
        let new_x = 0;
        let new_y = 0;
        for(let i = -1; i <= 1; i++){
            for(let j = -1; j <= 1; j++){
                new_x = x_cord + i;
                new_y = y_cord + j;
                if(new_x >= 0 && new_x < this.map_height && new_y >= 0 && new_y < this.map_width && reactive_board[new_x][new_y].basic == WATER){
                    return 200;
                }
            }
        }
        return 400;
    }

    move_actual_position(new_x, new_y, reactive_board){
        let save_object;
        let old_tile = reactive_board[this.x_cord][this.y_cord];
        switch(this.id){
            case old_tile.animal_1.id:
                save_object = old_tile.animal_1;
                old_tile.animal_1 = new naught(this.x_cord, this.y_cord, this.map_height, this.map_width);
                break;
            case old_tile.animal_2.id: 
                save_object = old_tile.animal_2;
                old_tile.animal_2 = new naught(this.x_cord, this.y_cord, this.map_height, this.map_width);
                break;
            case old_tile.animal_3.id:
                save_object = old_tile.animal_3;
                old_tile.animal_3 = new naught(this.x_cord, this.y_cord, this.map_height, this.map_width);
                break;
            default:
                /* Should not happen */
                console.log("WARNING: Someone tried to move a object from a tile, which it is not currently on.")
        }

        this.last_x = this.x_cord;
        this.last_y = this.y_cord;
        this.x_cord = new_x;
        this.y_cord = new_y;

        reactive_board[new_x][new_y].insert_obejct(save_object);
    }
    
    avaliable_sex_partner(x_cord, y_cord, reactive_board){
        let WILLING = 1;
        let field = reactive_board[x_cord][y_cord];
        if(field.animal_1.texture == this.texture && field.animal_1.sex == WILLING && field.animal_1.id != this.id){
            return 200;
        } else if(field.animal_2.texture == this.texture && field.animal_2.sex == WILLING && field.animal_2.id != this.id){
            return 200;
        } else if(field.animal_3.texture == this.texture && field.animal_3.sex == WILLING && field.animal_3.id != this.id){
            return 200;
        } else {
            return 400;
        }
    }

    reproduce(reactive_board){
        let sex_animal; 
        let sex_field = reactive_board[this.x_cord][this.y_cord];
        if(this.avaliable_sex_partner(this.x_cord, this.y_cord, reactive_board) == 200){
            //console.log("I just had sex!!!!", this.id, "by the way.")

            if(sex_field.animal_1.texture == this.texture && sex_field.animal_1.id != this.id){
                sex_animal = sex_field.animal_1;
            } else if(sex_field.animal_2.texture == this.texture && sex_field.animal_2.id != this.id){
                sex_animal = sex_field.animal_2;
            } else if(sex_field.animal_3.texture == this.texture && sex_field.animal_3.id != this.id){
                sex_animal = sex_field.animal_3;
            }

            sex_animal.sex = 2;
            sex_animal.horny = 0;
            this.horny = 0;
            this.sex = 0;

            return 200;
        }
        else {
            console.log("This should never have happened, a Rabbit tried to have sex, but there were no avaliable, mates on the same fied.")
            return 400;
        }
    }

    drink(reactive_board){
        //console.log("Hey, I'm ", this.id, " and I just drank");
        if(this.next_to_water(this.x_cord, this.y_cord, reactive_board) == 200){
            this.thirst = 0;
            return 200;
        } else {
            return 400;
        }
    }
}

function normerisk(number){
    if(number < 0){
        return -number;
    } else{
        return number;
    }
}

/*  In the animal list, the texture of the Rabbit is 1 and the texture of the Fox is 2. */
class naught extends Animal{
    constructor(x_cord, y_cord, map_height, map_width){
        super(x_cord, y_cord, map_height, map_width)
        this.texture = 0;
        this.id = 0;
    }

    check_for_spread(reactive_board){
        return [400];
    }
}

class REDALERT extends Animal{
    constructor(x_cord, y_cord, map_height, map_width){
        super(x_cord, y_cord, map_height, map_width)
        this.texture = 666;
        this.id = 0;
    }
}

class rabbit extends Animal{
    constructor(x_cord, y_cord, map_height, map_width, ticks=0, thirst_basic = 10, hunger_basic = 10, horny_basic = 20, discover_basic = 5){
        super(x_cord, y_cord, map_height, map_width, ticks);
        this.texture = 1;
        this.hunger  = 0;
        this.thirst  = 0;
        this.horny   = 0;
        this.sight   = 3;
        this.min_thirst = thirst_basic;
        this.min_hunger = hunger_basic;
        this.min_horny  = horny_basic;
        this.discover   = discover_basic;
    }

    die(reactive_board){
        let tile = reactive_board[this.x_cord][this.y_cord];
        document.getElementById(String(this.id)).remove();
        if(tile.animal_1.id == this.id){
            tile.animal_1 = new naught(this.x_cord, this.y_cord, this.map_height, this.map_width);
        } else if(tile.animal_2.id == this.id){
            tile.animal_2 = new naught(this.x_cord, this.y_cord, this.map_height, this.map_width);
        } else if(tile.animal_3.id == this.id){
            tile.animal_3 = new naught(this.x_cord, this.y_cord, this.map_height, this.map_width);
        } else {
            console.log("I tried to kill an annimal, which is not me.");
        }
        //console.log("I just died!");
    }

    dieQuestionmark(reactive_board){
        if(this.hunger > 35 || this.thirst > 35 || this.ticks - this.birth >= 1000){
            this.die(reactive_board);
            return 400;
        } else {
            return 200;
        }
    }

    age(reactive_board){
        if(this.dieQuestionmark(reactive_board) == 400){
            return 400;
        }
        this.hunger++;
        this.thirst++;
        if(this.sex <= 1){
            this.horny++;
        } else if(this.sex > 1){
            this.sex++;
        }
        return 200
    }

    eat(reactive_board){
        let plant_to_eat = reactive_board[this.x_cord][this.y_cord].plant;
        // console.log("Hey, I'm ", this.id, " and I just ate");
        if(plant_to_eat.texture == 3){
            document.getElementById(String(plant_to_eat.id)).remove();
            reactive_board[this.x_cord][this.y_cord].plant = new naught(this.x, this.y, this.map_height, this.map_width);
            this.hunger = 0;
            return 200;
        } else {
            return 400;
        }
    }

    give_birth(reactive_board, game_ticks){
        let current_tile = reactive_board[this.x_cord][this.y_cord];
        let NAUGHT = 0;
        let small_rabbits = [];

        this.sex = 0;
        if(current_tile.animal_1.texture == NAUGHT){
            reactive_board[this.x_cord][this.y_cord].animal_1 = new kit(this.x_cord, this.y_cord, this.map_height, this.map_width, game_ticks + 4);
            current_tile.animal_1.make_visible_character();
            small_rabbits.push(current_tile.animal_1);
            // console.log("I made a baby");
        }
        if(current_tile.animal_2.texture == NAUGHT){
            reactive_board[this.x_cord][this.y_cord].animal_2 = new kit(this.x_cord, this.y_cord, this.map_height, this.map_width, game_ticks + 4);
            current_tile.animal_2.make_visible_character();
            small_rabbits.push(current_tile.animal_2);
            // console.log("I made a baby");
        }
        if(current_tile.animal_3.texture == NAUGHT){
            reactive_board[this.x_cord][this.y_cord].animal_3 = new kit(this.x_cord, this.y_cord, this.map_height, this.map_width, game_ticks + 4);
            current_tile.animal_3.make_visible_character();
            small_rabbits.push(current_tile.animal_3);
            // console.log("I made a baby");
        }
        // console.log("I gave birth");
        return small_rabbits;
    }
}

class kit extends rabbit{
    constructor(x_cord, y_cord, map_height, map_width, ticks=0, thirst_basic = 10, hunger_basic = 10, horny_basic = 20, discover_basic = 5){
        super(x_cord, y_cord, map_height, map_width, ticks, thirst_basic, hunger_basic, horny_basic, discover_basic);
        this.texture = 1.5
        this.plants_eaten = 0;
        this.hunger  = 0;
        this.thirst  = 0;
        this.horny   = 0;
        this.sight   = 3;
        this.min_thirst = thirst_basic;
        this.min_hunger = hunger_basic;
        this.min_horny  = horny_basic;
        this.discover   = discover_basic;
    }

    age(reactive_board){
        if(this.dieQuestionmark(reactive_board) == 400){
            return 400;
        }
        this.hunger++;
        this.thirst++;
        return 200
    }

    grow_up(reactive_board){
        document.getElementById(String(this.id)).remove();
        let tile = reactive_board[this.x_cord][this.y_cord];
        let new_rabbit = new rabbit(this.x_cord, this.y_cord, this.map_height, this.map_width, this.ticks + 4, this.thirst_basic,
            this.hunger_basic, this.horny_basic, this.discover_basic);

        switch(this.id){
            case tile.animal_1.id:
                reactive_board[this.x_cord][this.y_cord].animal_1 = new_rabbit;
                reactive_board[this.x_cord][this.y_cord].animal_1.make_visible_character();    
                break;
            case tile.animal_2.id:
                reactive_board[this.x_cord][this.y_cord].animal_2 = new_rabbit;
                reactive_board[this.x_cord][this.y_cord].animal_2.make_visible_character();    
                break;
            case tile.animal_3.id:
                reactive_board[this.x_cord][this.y_cord].animal_3 = new_rabbit;
                reactive_board[this.x_cord][this.y_cord].animal_3.make_visible_character();    
                break;
            default:
                console.log("A kit tried to grow up on a tile, which it is not currently on!");
       }
       return new_rabbit;
    }

    grow_up_maybe(reactive_board){
        if(this.plants_eaten >= 3){
            return this.grow_up(reactive_board);
        }
        else {
            return 400;
        }
    }

    eat(reactive_board){
        let plant_to_eat = reactive_board[this.x_cord][this.y_cord].plant;
        // console.log("Hey, I'm ", this.id, " and I just ate");
        if(plant_to_eat.texture == 3){
            document.getElementById(String(plant_to_eat.id)).remove();
            reactive_board[this.x_cord][this.y_cord].plant = new naught(this.x, this.y, this.map_height, this.map_width);
            this.hunger = 0;
            this.plants_eaten += 1;
            return 200;
        } else {
            return 400;
        }
    }
}

class plant extends Animal{
    constructor(x_cord, y_cord, map_height, map_width){
        super(x_cord, y_cord, map_height, map_width);
        this.texture = 3;
    }

    check_for_spread(reactive_board){
        if(reactive_board[this.x_cord][this.y_cord].plant.texture == 0){
            return [400];
        }
        let WATER = 0;
        let water_val = 0;
        let x; let y;
        for(let i = -1; i < 1; i++){
            for(let j = -1; j < 1; j++){
                x = this.x_cord + i; y = this.y_cord + j;
                if(x >= 0 && x < this.map_height && y >= 0 && y < this.map_width && reactive_board[x][y].basic == WATER){
                    water_val += 2.5;
                }
            }
        }

        let new_plant;
        if(Math.random()*100 > 99.8 - (water_val)*0.1){
            new_plant = this.spread(reactive_board);
        }
        if(new_plant === undefined){
            new_plant = 400;
        }
        return [200, new_plant];
    }

    spread(reactive_board){
        let DIRT = 1;
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                if(!(i == 0 && j == 0 ) && (i + this.x_cord >= 0 && i + this.x_cord < this.map_height) && 
                (j + this.y_cord >= 0 && j + this.y_cord < this.map_width) && reactive_board[this.x_cord + i][this.y_cord+j].basic == DIRT
                && reactive_board[this.x_cord + i][this.y_cord+j].plant.texture == 0){
                    let new_plant = new plant(this.x_cord + i, this.y_cord+j, this.map_height, this.map_width);
                    reactive_board[this.x_cord + i][this.y_cord+j].plant = new_plant;
                    reactive_board[this.x_cord + i][this.y_cord+j].plant.make_visible_character();
                    return new_plant;
                }
            }
        }

        return 400;
    }
}

class fox extends Animal{
    constructor(x_cord, y_cord, map_height, map_width, ticks=0){
        super(x_cord, y_cord, map_height, map_width, ticks);
        this.texture = 2;
        this.sight = 3;
    }
}

class tile {
    constructor(basic_value, plant, A1, A2, A3){
        this.basic = basic_value;
        this.plant = plant;
        this.animal_1 = A1;
        this.animal_2 = A2;
        this.animal_3 = A3;
    }

    place_object(object){
        let RABBIT = 1; let FOX = 2; let NAUGHT = 0; let PLANT = 3;
        if(object.texture == PLANT){
            if(this.plant.texture == 0){
                this.plant = object;
                return 200;
            } else {
                return 400;
            }
        }

        return this.insert_obejct(object);        
    }

    insert_obejct(object){
        let NAUGHT = 0; let RABBIT = 1; let FOX = 2; let PLANT = 3;
        if(this.animal_1.texture == NAUGHT){
            this.animal_1 = object;
        }
        else if(this.animal_2.texture == NAUGHT){
            this.animal_2 = object;
        }
        else if(this.animal_3.texture == NAUGHT){
            this.animal_3 = object;
        } else {
            return 400;
        }
        return 200;
    }

    free_animal_space(texture){
        if(this.animal_1.texture == texture){
            return 200;
        }
        else if(this.animal_2.texture == texture){
            return 200;
        }
        else if(this.animal_3.texture == texture){
            return 200;
        } else {
            return 400;
        }
    }
}

function main(){
    event_listeners();
    /* document.getElementById("simulation").addEventListener("mouseover", () => {console.log("hey")}); */
}

function simulator_start() {
    let reactive_board;
    let NAUGHT = 0; let RABBIT = 1; let FOX = 2; let PLANT = 3;
    ID = 1;
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
    
    // board_array = HappyFace; map_height = 9; map_width = 10;

    /* Now, the basic board is written into the DOM in the form of images, in the simulation container. */
    print_board_to_doc(board_array, map_height, map_width);

    /* The reactive map is made. */
    reactive_board = create_reactive_board(map_height, map_width, board_array);
    for(let i = 0; i < map_height; i++){
        for(let j = 0; j < map_width; j++){
            if(reactive_board[i][j].animal_1.texture == 1){
                reactive_board[i][j].animal_1.look_around(3, reactive_board);
                reactive_board[i][j].animal_1.make_visible_character();
            }
        }
    }

    let rabbits = Array(); let plants = Array();

    rabbits = create_object_random(RABBIT, map_height/3, map_height, map_width, reactive_board);
    plants = create_object_random(PLANT, map_height*1.5, map_height, map_width, reactive_board);

    let time = new Date;
    time = time.getTime();

    console.log("I'm starting the simulation");
    setTimeout(one_step_simulation, 3000, reactive_board, map_height, map_width, rabbits, [], plants, 0, time);
}

function one_step_simulation(reactive_board, map_height, map_width, rabbits, foxes, plants, game_ticks, starting_time, time_each_tick=176){
    /* reactive_animals(reactive_board, map_height, map_width);
     *
     * this should move all the rabits, one by one. */
    let PLANT = 3; KIT = 1.5;

    let mad_max = [];
    for(let i = 0; i < rabbits.length; i++){
        if(rabbits[i].ticks <= game_ticks){
            if(rabbits[i].sex == 2){
                this.ticks += 8
            }
            if(rabbits[i].sex >= 10){
                if(rabbits[i].texture == KIT){
                    console.log("a kit managed to have a high sex level");
                    return 400;
                }
                let new_rabbits = rabbits[i].give_birth(reactive_board, game_ticks);
                rabbits[i].ticks += 12;
                for(let j = 0; j < new_rabbits.length; j++){
                    rabbits.push(new_rabbits[j]);
                }
            } else {
                rabbits[i].make_a_move(reactive_board);

                if(rabbits[i].texture == KIT){ 
                    let output_grow = rabbits[i].grow_up_maybe(reactive_board);
                    if(output_grow != 400){
                        rabbits[i] = output_grow;
                    }
                }
            }
            if(rabbits[i].age(reactive_board) == 400){
                mad_max.push(i);
            }
        }
    }

    if(mad_max.length > 0){
        for(let i = mad_max.length - 1; i >= 0; i--){
            rabbits.splice(mad_max[i], 1);
        }
    }

    update_sidebar_statistics(rabbits.length);
    update_timer(starting_time, game_ticks);

    for(let i = 0; i < foxes.length; i++){
        foxes[i].make_a_move(reactive_board);
    }

    let temp_plant;
    let new_plants = [];
    let made_max = [];
    for(let i = 0; i < plants.length; i++){
        temp_plant = plants[i].check_for_spread(reactive_board);
        if(temp_plant[0] == 400){
            made_max.push(i);
        } else if(temp_plant[0] == 200 && temp_plant[1].constructor === plant){
            new_plants.push(temp_plant[1]);
        } else {
            //console.log("Wanted to spread, but didn't have any avaliable tiles.");
        }
    }

    if(game_ticks % 4 == 0){
        plants.push(create_object_random(PLANT,1,map_height,map_width,reactive_board)[0]);
    }

    if(made_max.length > 0){
        for(let i = made_max.length - 1; i >= 0; i--){
            plants.splice(made_max[i], 1);
        }
    }

    if(new_plants.length > 0){
        for(let i = 0; i < new_plants.length; i++){
            plants.push(new_plants[i]);
        }
    }

    setTimeout(one_step_simulation, time_each_tick, reactive_board, map_height, map_width, rabbits, foxes, plants, game_ticks + 1, starting_time, time_each_tick);
    // console.log("Game ticks:", game_ticks);
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
            reactive_board[i][j] = new tile(basic_board[i][j], new naught(i, j), new naught(i, j), new naught(i, j), new naught(i, j))
        }
    }

    return reactive_board;
}

function create_object_random(texture, number_of_objects, map_height, map_width, reactive_board){
    /* This function has a bit too many nested loops and if-statements. But it works fine, and should be fairly
       readable, so you are welcome!! */
    let NAUGHT = 0; let RABBIT = 1; let FOX = 2; let PLANT = 3;
    let object;
    let objects = Array();

    for(let i = 0; i < number_of_objects; i++){
        while(true){
            let x_cord = give_random_int(map_height);
            let y_cord = give_random_int(map_width);
            let current_tile = reactive_board[x_cord][y_cord];

            if(current_tile.basic == 1){
                switch(texture){
                    case NAUGHT:
                        object = new naught(x_cord, y_cord, map_height, map_width);
                        break;
                    case RABBIT:
                        object = new rabbit(x_cord, y_cord, map_height, map_width);
                        break;
                    case FOX:
                        object = new fox(x_cord, y_cord, map_height, map_width);
                        break;
                    case PLANT:
                        object = new plant(x_cord, y_cord, map_height, map_width);
                        break;
                    default:
                        /* THis should not happen */
                        console.log("function create_object_random(), was given a texture which it doesn't support");
                }

                objects.push(object);

                if(reactive_board[x_cord][y_cord].place_object(object) == 200){
                    object.make_visible_character();
                    break;
                }
            }
        }
    }

    return objects;
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

function remove_first_element(listen){
    let return_list = [];
    for(let i = 1; i < listen.length; i++){
        return_list.push(listen[i]);
    }
    return return_list;
}

function give_me_a_copy(listen){
    let return_list = [];
    if(listen[0].constructor === Array){
        return_list = [[], []];
        for(let i = 0; i < listen[0].length; i++){
            return_list[0].push(listen[0][i]);
            return_list[1].push(listen[1][i]);
        }
    } else {
        for(let i = 0; i < listen.length; i++){
            return_list.push(listen[i]);
        }
    }
    return return_list;
}

function update_sidebar_statistics(rabbits){
    document.getElementById("stats1").innerHTML = "Current number of rabbits = " + rabbits.toString();
}

function update_timer(starting_time, game_ticks = 0){
    let k = new Date()
    let mili_seconds = k.getTime() - starting_time;
    let seconds = Math.floor(mili_seconds * 10**-3);

    let game_time_in_seconds = Math.floor(seconds % 60);
    let game_time_in_minutes = Math.floor((seconds / 60) % (60));
    let game_time_in_hours   = Math.floor((seconds / (60 * 60)) % 24);

    let seconds_beauty = ("0" + game_time_in_seconds.toString()).slice(-2);
    let minutes_beauty = ("0" + game_time_in_minutes.toString()).slice(-2);
    let hours_beauty = ("0" + game_time_in_hours.toString()).slice(-2);
    
    let running_clock = hours_beauty + ":" + minutes_beauty + ":" + seconds_beauty;

    document.getElementById("stats12").innerHTML = "The simulation has been running for (h:m:s):\n" + running_clock + " (" + game_ticks.toString() + " ticks)";
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