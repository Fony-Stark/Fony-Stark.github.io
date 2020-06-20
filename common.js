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

document.getElementById("left_side_bar").addEventListener("mouseover", () => mouse_over());
document.getElementById("left_side_bar").addEventListener("mouseout", () => mouse_away());
document.getElementById("left_side_bar").addEventListener("click", () => (toggle_left_bar == 0 ? mouse_over() : mouse_away()));