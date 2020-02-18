function simulator_start() {
    let b = 0;
    // alert("button was clicked");
    let short_cut = document.getElementById("stats1").innerHTML;
    console.log(short_cut);
    
    let thirst_start = document.getElementById("thirst").value;
    let hunger_start = document.getElementById("hunger").value;
    let speed_start = document.getElementById("speed").value;
    let hp_start = document.getElementById("hp").value;
    document.getElementById("stats1").innerHTML = thirst_start;
     
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