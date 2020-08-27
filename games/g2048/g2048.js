/*function build_the_board(){
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

  setInterval(function(){if(suppress == 1){
    let result = one_step_algorithm(board)
    if(result[0] == "LOOSE"){
      alert("The algorithm lost. Sorry Mate, better luck next time.\nYour best block was:" + result[1]);
    }
  }}, 50);

  document.onkeydown = (e) => {if(suppress == 0){
      let result = checkKey(e, board);
      if(result[0] == "LOOSE"){
        alert("Sorry mate, you seemed to have lost.\nYour best block was: " + result[1]);
      }
    }
  }

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
            return game_move("DOWN", board);
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
              return game_move(((k / 5) % 2 == 0) ? "LEFT" : "RIGHT", board);
            } else {
              let d = 20 - (rounds - 1) * 5;
              return game_move((((d / 5) % 2 == 0) && random_factor > 5) ? "LEFT" : "RIGHT", board);
            }
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
    return game_move("RIGHT", board);
  } else if(items_unique == 1 && random_num < 10){
    return game_move("LEFT", board);
  } else {
    return game_move("DOWN", board);
  }
}
*/
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
  //show_new_element_on_board(generate_on_field, value);
  return current_board;
} /*

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
      return game_move("UP", board);
    } else if(e.keyCode == 40){
      return game_move("DOWN", board);
  } else if(e.keyCode == 37){
      return game_move("LEFT", board);
  } else if(e.keyCode == 39){
      return game_move("RIGHT", board);
  }
  return "LIVE";
}
*/
function game_move(way_to_move, board, bot=0){
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
  if(bot == 0){
    //clear_board(board);
    for(let i = 0; i < board.length; i++){
      if(board[i] != undefined){
        //show_new_element_on_board(i, board[i]);
      }
    }
  }
  if(create_new_element(board) == "LOOSE"){
    let highest = 2;
    for(let i = 0; i < board.length; i++){
      if(board[i] > highest){
        highest = board[i];
      }
    }
    //clear_board(board);
    for(let i = 0; i < board.length; i++){
      board[i] = undefined;
    }
    return ["LOOSE", highest];
  }
  return "LIVE";
}

//function clear_board(board){
//    for(let i = 0; i < board.length; i++){
//      document.getElementById("box_"+String(i)).innerHTML = "";
//    }
//}

//game_controller();

/********               This is the Machine Inteligens              *********/
/***     Initiating weights arrays     ***/
// Input layer, 5x5 grid.           | 25
let input_layer_weight = Array(25);

// Middle layer,    25 - 4 * 3 =    | 13 Rule of Thumb: Neurons in inputlayer > neurons in middle layer > neurons in output layer
let middle_layer_weight = Array(13);


// "UP", "DOWN", "RIGHT" and "LEFT" | 4 (Doesn't really need any weights);
let output_layer_weight = Array(4);

/******             END             ******/
/*** Loading or generating new weights ***/
// Checking if a saved File exists
async function get_weights(num = 1){
  let weight = fetch("/basic_weights").then(async function(response){
    let weights = await response.json();
    if(weights.exist == true){
      return weights.weight.weights;
    } else {
      let new_weights = Array();
      for(let i = 0; i < num; i++){
        new_weights.push(generating_all_new_weights([input_layer_weight.length,
        middle_layer_weight.length, output_layer_weight.length]));
      }
      return new_weights
    }
  });
  return weight;
}

function save_weights(weights){
  let content = JSON.stringify({"weights":weights})

  let xhr = new XMLHttpRequest();
  let url = "/";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(content);
  return 200;
}

// Generating new weights
function generating_all_new_weights(length_of_arrays){
    let list_of_weights = [];
    for(let i = 0; i < length_of_arrays.length - 1; i++){
        list_of_weights.push(Array());
        for(let j = 0; j < length_of_arrays[i]; j++){
            list_of_weights[i].push(generating_new_weights(length_of_arrays[i + 1]));
        }
    }
    return list_of_weights;
}

function generating_new_weights(numbers_to_generate){
    let weights = [];
    for(let i = 0; i < numbers_to_generate; i++){
        weights.push(Math.random() * 10**12 % 10**4);
    }
    return weights;
} 

/******                 END                ******/
/*** Calculating the output, of a given input ***/
function make_it_a_move(input, array_of_weights){
  let powers = input_to_output_calc(input, array_of_weights);
  return highest(powers);
}

function input_to_output_calc(input, array_of_weights){
    // Itirates over each layer, except for the output layer.
    let this_shit = input;
    for(let i = 0; i < array_of_weights.length; i++){
        this_shit = layer_to_layer(this_shit, array_of_weights[i]);
    }
    return this_shit;
}

//let test_1 = (input_to_output_calc([5, 2, 3, 2, 4, 1, 0, 0, 0, 1, 8, 1, 1, 2024, 1, 1, 1, 4, 1, 1, 1, 1, 1, 3, 4], [input_layer_weight, middle_layer_weight]));
//console.log("HEY:", highest(test_1))
// Calc a layer transit
// Takes input as an array of the weights to transit from layer 1 to layer 2
// input is an array of currten value of the first layer
function layer_to_layer(input, weights){
    // Itirates over each
    let total = Array()
    for(let i = 0; i < weights[0].length; i++){
        total.push(0);
        for(let j = 0; j < input.length; j++){
            total[i] += weights[j][i] * input[j]
        }
        total[i] = bent_identity_activation(total[i]);
    }
    return total;
}

// Test: output should be [19.8, 13.5] before activation after [29.21.., 19.768..]
//console.log("This is out", layer_to_layer([1, 2, 3, 4], [[2.5, 3.5], [3.2, 1.2], [2.3,1.2], [1, 1]]));

// Activation functions
function bent_identity_activation(num){
    return ((Math.sqrt(num**2 + 1) - 1)/2 + num);
}

// Which directions to move
function highest(outputs){
    let highest_num_index = 0;
    let highest_num = 0;
    for(let i = 0; i < outputs.length; i++){
        if(outputs[i] > highest_num){
            highest_num = outputs[i];
            highest_num_index = i;
        }
    }

    switch(highest_num_index){
        case 0:
            return "UP";
        case 1:
            return "DOWN";
        case 2:
            return "LEFT";
        case 3:
            return "RIGHT";
        default:
            console.log("Error in 'function highest(outputs)' got more than 4 output nodes");
            return "ERROR";
    }
}

/******              END            ******/
/***        Playing a whole game       ***/
// This section is mainly for training the neural network. I'll look into making it visible on the platform after.
function start_a_player(weights){
  let board = Array(25);
  let old_board = Array(25);
  while(true){
    old_board = board.slice();
    let out_come = game_move(make_it_a_move(board, weights), board, 1);

    if(out_come[0] == "LOOSE"){
      //console.log("This is the best score:", out_come[1]);
      return [calc_score(old_board, out_come[1]), out_come[1]];
    }
  }
}

// Calc the score of a board
function calc_score(board, highest){
  let total = highest * 4;
  for(let i = 0; i < board.length; i++){
    total += board[i];
  }
  return total;
}
/******                 END                 ******/
/***   Create a population, and let them run   ***/
// A function which, creates a population from a starting point.
function population_from_starting_point(prototype_weights, pop){
  let big_family = Array();
  big_family.push(prototype_weights);
  for(let i = 0; i < pop; i++){
    big_family.push(reproducing(prototype_weights, 5));
  }
  return big_family;
}

// Make new weights for a new neurale network from an old one.
function reproducing(parent_weights, margin=0.2){
  let new_weights = Array();
  for(let j = 0; j < parent_weights.length; j++){
    new_weights.push(Array());
    for(let i = 0; i < parent_weights[j].length; i++){
      new_weights[j].push(Array());
      for(let d = 0; d < parent_weights[j][i].length; d++){
        let random_element = Math.random() * 2;
        random_element = (random_element > 1) ? random_element - 2 : random_element;
        new_weights[j][i].push(parent_weights[j][i][d] * margin * random_element + parent_weights[j][i][d]);
      }
    }
  }
  return new_weights;
}

/******                 END                 ******/
/*** Removing half the populations of Networks ***/
function perfectly_balanced(big_happy_family){
  for(let i = big_happy_family.length - 2; i > 0; i-=2){
    let unfortunate_soul = int_in_range(0.25*i + 1.6, big_happy_family.length);
    big_happy_family.splice(unfortunate_soul, 1);
  }
  return big_happy_family;
}

// Find integer between two other integers
function int_in_range(low, high){
  let random_num = Math.random() * (high - low);
  return Math.floor(random_num + low);
}

/******                         END                          ******/
/***  Let all algorithms still alive evovle into something new  ***/
function repropulate(survivors){
  let we_are_even = Array();
  for(let i = 0; i < survivors.length; i++){
    we_are_even.push(survivors[i]);
    we_are_even.push(reproducing(survivors[i]));
  }
  return we_are_even;
}


/******                  END                  ******/
/***              Put it all together            ***/
function start_training_NN(standard_weight){
  console.log("This is standard:", standard_weight);
  //let family = get_weights(200);
  let family = population_from_starting_point(standard_weight, 200);
  //console.log(family);
  let k = 0;

  while(true){
    k++;
    let s_scores = Array();
    for(let i = 0; i < family.length; i++){
      s_scores.push(start_a_player(family[i]));
    }
    let scores = [[], []];
    for(let i = 0; i < s_scores.length; i++){
      scores[0].push(s_scores[i][0]);
      scores[1].push(s_scores[i][1]);
    }

    bubbleSortAlgo(scores, family);
    let survivors = perfectly_balanced(family);
    family = repropulate(survivors);
    if(k % 20 == 0){
      console.log("This is k", k, "and the best NN in this family got:", scores[0][0], "The best block it got was: ", scores[1][0]);
    }
    if(k % 500 == 0){
      save_weights(family[0]);
    }
  }
}


// Start the training:
get_weights().then((res) => start_training_NN(res[0]));

/******                  END                  ******/
// Sort on, behalf of best score.
// I was tired at this point, so this function is coppied from https://www.educba.com/sorting-algorithms-in-javascript/
// I've placed a reminder for myself to go back and change this to a better sorting algorithm.
function swap(arr, arr2, firstIndex, secondIndex){
  let temp = arr[0][firstIndex];
  arr[0][firstIndex] = arr[0][secondIndex];
  arr[0][secondIndex] = temp;

  temp = arr[1][firstIndex];
  arr[1][firstIndex] = arr[1][secondIndex];
  arr[1][secondIndex] = temp;

  temp = arr2[firstIndex];
  arr2[firstIndex] = arr2[secondIndex];
  arr2[secondIndex] = temp;
}

function bubbleSortAlgo(arraaytest, reminder){
  let len = arraaytest[0].length,
  i, j, stop;
  for (i=0; i < len; i++){
    for (j=0, stop=len-i; j < stop; j++){
      if (arraaytest[0][j] < arraaytest[0][j+1]){
        swap(arraaytest, reminder, j, j+1);
      }
    }
  }
  return arraaytest[0];
}