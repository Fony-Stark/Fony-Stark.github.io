function simulator_start() {
    let thirst_start = Number(document.getElementById("thirst").value);
    let hunger_start = Number(document.getElementById("hunger").value);
    let speed_start = Number(document.getElementById("speed").value);
    let hp_start = Number(document.getElementById("hp").value);

    document.getElementById("stats1").innerHTML = "Maximum HP on rabbits: " + (hp_start > 0 ? hp_start : 10);
    document.getElementById("stats2").innerHTML = "Maximum speed for rabbits: " + (speed_start > 0 ? speed_start : 10);
    document.getElementById("stats3").innerHTML = "minimum hunger limit: " + (hunger_start > 0 ? hunger_start : 10);
    document.getElementById("stats4").innerHTML = "minimum thirst limit: " + (thirst_start > 0 ? thirst_start : 10);
     
    /*
    if(short_cut == "her kan du analyser på hvad du har"){
        document.getElementById("stats1").innerHTML = "I don't like this anymore.";
    } else if(short_cut == "I don't like this anymore.") {
        document.getElementById("stats1").innerHTML = "I still dont like this!";
    }
    else{
        document.getElementById("stats1").innerHTML = "her kan du analyser på hvad du har";
    }
    */
};

function main(){
    event_listeners();
    document.getElementById("simulation").addEventListener("mouseover", () => {console.log("hey")});
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
            document.getElementById("advanced_seetings_bar").style.height = "10vh";
            document.getElementById("bottom_facts").style.height = "0px";
            document.getElementById("container").style.height = "70vh";
        } else {
            toggle_settings = 0;
            document.getElementById("user_modification").style.height = "15.5vh";
            document.getElementById("advanced_seetings_bar").style.height = "0";
            document.getElementById("bottom_facts").style.height = "10vh";
            document.getElementById("container").style.height = "81vh";
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