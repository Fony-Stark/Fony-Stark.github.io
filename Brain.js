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