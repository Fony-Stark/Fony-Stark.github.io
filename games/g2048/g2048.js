function build_the_board(){
    let the_board = document.getElementById("board");

    for(let i = 0; i < 25; i++){
      let element = document.createElement("div");
      element.style.backgroundColor = (i % 2 == 0) ? "red" : "green";
      element.style.height = "15.2vh"
      element.id = "box_" + String(i);
      element.style.width = "20%"
      element.style.float = "left";
      element.style.overflowWrap = "break-word";

      the_board.appendChild(element);
    }
}
build_the_board();

function game_controller(){
  let board = Array(25);
  let suppress = 0;

  create_new_element(board);

  document.getElementById("run_algorithm").addEventListener("click", () => {suppress = (suppress == 1) ? 0 : 1;
    if(suppress == 1){
      document.getElementById("run_algorithm").innerHTML = "Stop algorithm";
    } else {
      document.getElementById("run_algorithm").innerHTML = "Run algorithm";
    }
  });

  setInterval(function(){if(suppress == 1)one_step_algorithm(board)}, 50);

  document.onkeydown = (e) => {if(suppress == 0)checkKey(e, board); }

  document.getElementById("up_arrow").addEventListener("click", () => {if(suppress == 0)game_move("UP", board)});
  document.getElementById("down_arrow").addEventListener("click", () => {if(suppress == 0)game_move("DOWN", board)});
  document.getElementById("right_arrow").addEventListener("click", () => {if(suppress == 0)game_move("RIGHT", board)});
  document.getElementById("left_arrow").addEventListener("click", () => {if(suppress == 0)game_move("LEFT", board)});
}

function one_step_algorithm(board){
  let items_unique = 1;
  let best_bottom = 1;
  let rounds = 0;
  let k = 20;
  for(k = 20; k >= 0; k = k - 5){
    let smallest = board[k + 4];
    for(let i = k + 5; i < k+10; i++){
      if(rounds > 0 && (k / 5) % 2 == 0){
        if(i < k + 4){
          if(board[i] > board[i + 1]){
            best_bottom = 0;
          }
        }
        if(board[i] < smallest){
          smallest = board[i];
        }
      } else if(rounds > 0) {
        if(i != k){
          if(board[i] < board[i + 1]){
            best_bottom = 0;
          }
        }
      }
    }
    if(rounds > 0 && k > 0){
      for(let i = k; i < k+5; i++){
        if(board[i - 5] > smallest){
          best_bottom = 0;
        }
      }
    }
    for(let i = k; i < k+5; i++){
      if(board[i] == undefined){
        items_unique = 0;
      }
      if(i > k && items_unique == 1){
        items_unique = (board[i] != board[i - 1]) ? 1 : 0;
      }
      if(i < k + 4 && items_unique == 1 ){
        items_unique = (board[i] != board[i + 1]) ? 1 : 0;
      }
      if(i >= 5){
        let f = i;
        for(let j = i - 5; j >= 0; j= j - 5){
          if(board[j] == board[f] && board[j] != undefined){
            //console.log("I'm going motherfucking down!");
            game_move("DOWN", board);
            return;
          }
          else if (board[j] != undefined){
            if(j > (k < 10) ? 0 : (k - 10)){
              f = j;
            } else {
              break;
            }
          }
        }
      }
      if(i > k){
        for(let j = i - 1; j >= k; j--){
          if(board[j] == board[i] && board[j] != undefined){
            let random_factor = Math.random() * 10;
            let smallest = board[k];
            if((best_bottom == 1 && (rounds == 0 || random_factor > 8)) || random_factor < 2.5){
              game_move(((k / 5) % 2 == 0) ? "LEFT" : "RIGHT", board);
            } else {
              let d = 20 - (rounds - 1) * 5;
              game_move(((d / 5) % 2 == 0) ? "LEFT" : "RIGHT", board);
            }
            return;
          }
          else if(board[j] != undefined){
            break;
          }
        }
      }
    }
    if(items_unique == 0){
      break;
    }
    if(best_bottom == 1){
      rounds += 1;
    }
    //console.log(rounds);
  }
  //console.log("I'm down here");
  let random_num = Math.random() * 10;
  if(items_unique == 1 && (random_num < ((k / 5) % 2 == 0) ? 3 : 7)){
    game_move("RIGHT", board);
  } else if(items_unique == 1 && random_num < 10){
    game_move("LEFT", board);
  } else {
    game_move("DOWN", board);
  }
}

function create_new_element(current_board){
  let free_fields = [];
  for(let i = 0; i < 25; i++){
    if(current_board[i] == undefined){
      free_fields.push(i);
    }
  }
  if(free_fields.length == 0){
    return "LOOSE";
  }
  let generate_on_field = free_fields[Math.floor(Math.random() * (free_fields.length))];
  let value = (Math.random() * 10 > 9) ? 4 : 2;
  current_board[generate_on_field] = value;
  show_new_element_on_board(generate_on_field, value);
  return current_board;
}

function show_new_element_on_board(position, value){
  //console.log("This is position:", position, "and this is value:", value);
  let element = document.getElementById("box_" + String(position));

  let new_element = document.createElement("p");
  new_element.style.fontSize = "4vw";
  new_element.style.margin = "0";

  new_element.innerHTML = value;

  element.appendChild(new_element);
}

function checkKey(e, board){
  //console.log(board);
  if(e.keyCode == 38){
      game_move("UP", board);
    } else if(e.keyCode == 40){
      game_move("DOWN", board);
  } else if(e.keyCode == 37){
      game_move("LEFT", board);
  } else if(e.keyCode == 39){
      game_move("RIGHT", board);
  }
  return undefined;
}

function game_move(way_to_move, board){
  //console.log(way_to_move);
  switch(way_to_move){
    case "UP":
      for(let i = 0; i < 5; i++){
        let column = [];
        for(let j = 0; j < 25; j++){
          if(j % 5 == i){
            column.push(j);
          }
        }
        for(let k = 0; k < 5; k++){
          for(let d = k; d > 0; d--){
            if(board[column[d - 1]] == undefined){
              board[column[d - 1]] = board[column[d]];
              board[column[d]] = undefined
            } else if(board[column[d]] == board[column[d - 1]]){
              board[column[d - 1]] = board[column[d - 1]] * 2;
              board[column[d]] = undefined;
            }
          }
        }
      }
      break;
    case "DOWN":
      for(let i = 0; i < 5; i++){
        let column = [];
        for(let j = 0; j < 25; j++){
          if(j % 5 == i){
            column.push(j);
          }
        }
        for(let k = 4; k >= 0; k--){
          for(let d = k; d < 4; d++){
            if(board[column[d + 1]] == undefined){
              board[column[d + 1]] = board[column[d]];
              board[column[d]] = undefined
            } else if(board[column[d]] == board[column[d + 1]]){
              board[column[d + 1]] = board[column[d + 1]] * 2;
              board[column[d]] = undefined;
            }
          }
        }
      }
      break;
    case "RIGHT":
      for(let i = 0; i < 5; i++){
        let row = [];
        for(let j = 0; j < 5; j++){
          row.push(i*5 + j);
        }
        for(let k = 4; k >= 0; k--){
          for(let d = k; d < 4; d++){
            if(board[row[d + 1]] == undefined){
              board[row[d + 1]] = board[row[d]];
              board[row[d]] = undefined
            } else if(board[row[d]] == board[row[d + 1]]){
              board[row[d + 1]] = board[row[d + 1]] * 2;
              board[row[d]] = undefined;
            }
          }
        }
      }
      break;
    case "LEFT":
      for(let i = 0; i < 5; i++){
        let row = [];
        for(let j = 0; j < 5; j++){
          row.push(i*5 + j);
        }
        for(let k = 0; k < 5; k++){
          for(let d = k; d > 0; d--){
            if(board[row[d - 1]] == undefined){
              board[row[d - 1]] = board[row[d]];
              board[row[d]] = undefined
            } else if(board[row[d]] == board[row[d - 1]]){
              board[row[d - 1]] = board[row[d - 1]] * 2;
              board[row[d]] = undefined;
            }
          }
        }
      }
      break;
    default:
      console.log("Game mode, got a wrong input:", way_to_move);
      return undefined;
  }
  clear_board(board);
  for(let i = 0; i < board.length; i++){
    if(board[i] != undefined){
      show_new_element_on_board(i, board[i]);
    }
  }
  if(create_new_element(board) == "LOOSE"){
    alert("You lost, sorry:");
    clear_board(board);
    for(let i = 0; i < board.length; i++){
      board[i] = undefined;
    }
  };
}

function clear_board(board){
    for(let i = 0; i < board.length; i++){
      document.getElementById("box_"+String(i)).innerHTML = "";
    }
}

game_controller();
