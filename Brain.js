function simulator_start() {
    let b = 0;
    // alert("button was clicked");
    let short_cut = document.getElementById("stats1").innerHTML;
    console.log(short_cut);
    if(b == 0){
        document.getElementById("stats1").innerHTML = "I don't like this anymore.";
        b = 1;
    }
    else if (b == 1){
        document.getElementById("stats1").innerHTML = "I still don't like this.";
        b = 2;
    } else {
        document.getElementById("stats1").innerHTML = "This is shit";
        b = 0;
    }
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