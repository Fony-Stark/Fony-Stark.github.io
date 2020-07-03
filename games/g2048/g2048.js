function build_the_board(){
    let the_board = document.getElementById("board");

    for(let i = 0; i < 25; i++){
      let element = document.createElement("div");
      element.style.backgroundColor = (i % 2 == 0) ? "red" : "green";
      element.style.height = "15.2vh"
      element.style.width = "20%"
      element.style.float = "left";

      the_board.appendChild(element);
    }
}

build_the_board();
