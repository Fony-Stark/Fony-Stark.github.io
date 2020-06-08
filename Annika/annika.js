let ID = 1;

class object{
    constructor(x_cord, y_cord){
        this.id = ID;
        this.x_cord = x_cord;
        this.y_cord = y_cord;
        this.last_x = x_cord;
        this.last_y = y_cord;
        ID++;
    }
}

function create_new_gift(x_cord, y_cord, ID_code){
    let left = 37.5;
    let top = 8;
    let left_change = 3.35;
    let top_change = 6.35;
    /* let elem = document.createElement("div"); */
    let elem = document.createElement("img");
    let style_string;

    style_string += "width: " + String(100/8  + "%; ");
    style_string += "height: " + String(100/16 + "%; ");
    style_string += "position:" + "absolute; ";
    style_string += "user-select: none; ";
    style_string += "transition: 0.6s; ";
    style_string += "top:" + String(top + (y_cord - 1) * top_change) + "%; ";
    style_string += "left:" + String(left + (x_cord - 1) * left_change) + "%; ";
    style_string += "margin:" + "0; ";
    style_string += "padding:" + "0; ";
    elem.setAttribute("id", String(ID_code));
    elem.setAttribute("style", style_string);
    elem.setAttribute("src", "images/Bunde.JPG");
    document.getElementById("board").appendChild(elem);
}

function print_board_to_doc(height, width){
    for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
            let elem = document.createElement("img");
            elem.setAttribute("src", ("images/dirt.jpg"));
            elem.setAttribute("height", String(100/height + "%"));
            elem.setAttribute("width", String(100/width  + "%"));
            elem.setAttribute("margin", "0");
            elem.setAttribute("padding", "0");
            elem.setAttribute("display", "flex");
            elem.setAttribute("flex-grow", "1");
            elem.setAttribute("alt", "dirt");
            document.getElementById("board").appendChild(elem);
        }
    }
}

function move_emoji(x_cord, y_cord, ID_code){
    let left = 37.5;
    let top = 8;
    let left_change = 3.35;
    let top_change = 6.35;

    if(ID_code == 0){
        document.getElementById("hende_den_flotte").style.top  = String(top + (y_cord - 1) * top_change) + "%";
        document.getElementById("hende_den_flotte").style.left = String(left + (x_cord - 1) * left_change) + "%";
    }
    else{
        document.getElementById(String(ID_code)).style.top  = String(top + (y_cord - 1) * top_change) + "%";
        document.getElementById(String(ID_code)).style.left = String(left + (x_cord - 1) * left_change) + "%";
    }
}

function update_positions(old_x, old_y){
    if(objects.length >= 1){
        objects[0].last_x = objects[0].x_cord;
        objects[0].last_y = objects[0].y_cord;
        objects[0].x_cord = old_x;
        objects[0].y_cord = old_y;
        move_emoji(old_x, old_y, objects[0].id)
    }
    for(let i = 1; i < objects.length; i++){
        objects[i].last_x = objects[i].x_cord;
        objects[i].last_y = objects[i].y_cord;
        objects[i].x_cord = objects[i - 1].last_x;
        objects[i].y_cord = objects[i - 1].last_y;
        move_emoji(objects[i - 1].last_x, objects[i - 1].last_y, objects[i].id)
    }
}

print_board_to_doc(13, 8);

let objects = [];

let x_cordinate = 1;
let y_cordinate = 1;

function checkKey(e){
    e = e || window.event;

    let old_y = y_cordinate;
    let old_x = x_cordinate;

    if(e.keyCode == 38){
        y_cordinate = decrease_y(y_cordinate);
        if(y_cordinate == old_y){
            return 1;
        }
    } else if(e.keyCode == 40){
        y_cordinate = increass_y(y_cordinate);
        if(y_cordinate == old_y){
            return 1;
        }
    } else if(e.keyCode == 37){
        x_cordinate = decrease_x(x_cordinate);
        if(x_cordinate == old_x){
            return 1;
        }
    } else if(e.keyCode == 39){
        x_cordinate = increass_x(x_cordinate);
        if(x_cordinate == old_x){
            return 1;
        }
    }

    move_emoji(x_cordinate, y_cordinate, 0);
    if(objects.length >= 1){
        update_positions(old_x, old_y);
    }

    if(x_cordinate == find.x_cord && y_cordinate == find.y_cord){
        document.getElementById("amount").innerHTML = " Amount: " + (objects.length + 1);
        objects.push(find);
        
        spawn_gift();
    
        objects[objects.length - 1].x_cord = objects[objects.length - 2].last_x;
        objects[objects.length - 1].y_cord = objects[objects.length - 2].last_y;

        move_emoji(objects[objects.length - 1].x_cord, objects[objects.length - 1].y_cord, objects[objects.length - 1].id)
    }

    for(let i = 0; i < objects.length; i++){
        if(x_cordinate == objects[i].x_cord && y_cordinate == objects[i].y_cord){
            alert("I'm sorry, you unfortunatly lost. refresh the page to play again or just cheat and continue")
        }
    }
}


let find = new object(0, 0);
function spawn_gift(){
    let new_x = Math.ceil(Math.random() * 8);
    let new_y = Math.ceil(Math.random() * 13);

    create_new_gift(new_x, new_y, ID);
    find = new object(new_x, new_y);
}
spawn_gift();

document.onkeydown = checkKey;

function increass_x(x){
    return (x < 8) ? x + 1 : x;
}

function decrease_x(x){
    return (x > 1) ? x - 1 : x;
}

function increass_y(y){
    return (y < 13) ? y + 1 : y;
}

function decrease_y(y){
    return (y > 1) ? y - 1 : y;
}

