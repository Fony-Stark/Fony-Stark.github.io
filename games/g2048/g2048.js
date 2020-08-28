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

async function game_controller(){
  let board = Array(25);
  let suppress = 0;

  create_new_element(board);

  document.getElementById("run_algorithm").addEventListener("click", () => {
    switch(suppress){
      case 0:
        suppress = 1;
        break;
      case 1:
        suppress = 0;
        break;
      default:
        // Do nothing
    }
    if(suppress == 1){
      document.getElementById("run_algorithm").innerHTML = "Stop hardcoded-algorithm";
    } else {
      document.getElementById("run_algorithm").innerHTML = "Run hardcoded-algorithm";
    }
  });

  setInterval(function(){
    if(suppress == 1){
      let result = one_step_algorithm(board)
      if(result[0] == "LOOSE"){
        alert("The algorithm lost. Sorry Mate, better luck next time.\nYour best block was:" + result[1]);
      }
    } else if(suppress == 2){
      try{
        let move = make_it_a_move(board, weights[0]);
        console.log("Move: ", move);
        let result = game_move(move, board);
        if(result[0] == "LOOSE"){
          alert("The ANN is not better than it still can loose... Best block:" + result[1]);
        }
      } catch(err){
        console.log(err);
      }
    }
  }, 100);

  document.onkeydown = (e) => {if(suppress == 0){
      let result = checkKey(e, board);
      if(result[0] == "LOOSE"){
        alert("Sorry mate, you seemed to have lost.\nYour best block was: " + result[1]);
      }
    }
  }

  let weights = await get_weights();
  document.getElementById("NN_algorithm").addEventListener("click", () => {
    switch(suppress){
      case 0:
        suppress = 2;
        break;
      case 2:
        suppress = 0;
        break;
      default:
        // Do nothing
    }
    if(suppress == 2){
      document.getElementById("NN_algorithm").innerHTML = "Stop Neurale Network algorithm";
      //get_weights().then((res) => start_a_player(res[0], 0));
    } else {
      document.getElementById("NN_algorithm").innerHTML = "Run Neural Network algorithm";
    }
  });
  //get_weights().then((res) => start_training_NN(res[0]));

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
        }//{"weights":[[[15252.738474590185,5336.8223915217295,-1531.823387006681,-15882.752865001046,2486.444817183602,774.2144978429023,-704275.9331207612,4775.015094370126,-222.8267600798461,738482.6269717201,-32635.095000593028,-3.2947024374212988,-8620.550289345727],[-2346.2193045650492,-27267.84517779021,126173.6369553657,431702.84340312926,79451.82794001789,5868394.317077924,-1696.7523171680693,-34636.07305010118,101576.9806751955,6664.431701564617,31997.772095372566,61477.985801671355,-141.03539037461073],[1377928.7472379517,127099.09041669824,50819.19384555592,-310429.50334961247,4709.56435510181,144660.94566864634,2163.9626668951373,1642.6697529125902,62253.32248464002,-63078.80538535312,-16370.916030776201,-11737.714712615922,-99503.31925825482],[272346.4668508547,-123.21179090309059,-43678.565952540856,8188.182282867035,-1692.061488801643,1176.521743397992,-540.1618174791844,68431.39852982076,-234653.09844107667,-1360040.381925112,-448.3089235718884,-1335433.829739873,71005.11538163947],[-338017.2880576221,196067.539682645,-11760.552590928204,-3459.960614423576,1640.4493163580867,-286961.8213326607,-1130099.8605396599,471.50186421319364,12884.955358869305,1378900.320621667,-59420.72665571109,42104.8360586606,-998396.1707564929],[4750.869721394188,318.1718429214643,974848.3241557234,149108.90448570147,112153.54315380595,81176.57099763391,1634.6960717646768,-943303.2646011708,3052.9397173189923,-4050.9951337885836,290538.645495054,-54350.573993026635,-71158.5313523587],[-725932.5788686576,48628.156897942485,249175.86069101587,19841.89484473811,-118613.72202945195,-6091.49123720234,42812.183335586655,-9203.74445534084,16403.717893409805,5978.611581021478,-233981.21010379997,-62328.523914915786,1782830.6444414768],[-4405.361594056337,-44060.29678382982,66636.61323867996,-12201.951890871687,-146770.30210433053,42356.193551594195,15287.600291598827,33011.426455131324,142.60706479453174,32363.183073599528,-100606.2833224741,-93546.05934458437,-966473.7231761642],[-33390.7317312634,94588.55269013885,3075.485455600262,2852.119980449698,21880.941288985705,2.368830004846689,35519.54833943679,1780.4753107548613,-773.9692594854669,104937.47352247854,26349863.295072325,1045002.1706731184,13805.196884184195],[-111412.86647212369,181956.27253058512,-48.04077736676351,2582260.680530595,-1056.386626546374,-181236.92619172897,-7380.951607863065,-60223.47075010832,-9129.228525749098,223384.16485026508,25594.269743490728,10072.29221987112,135.1544114174463],[206835.01272964416,5747.337707273664,-596547.4097403783,-47005.08130386341,-13719.529808662764,-155918.2678125188,23725.454344446916,-282346.6475473465,250233.67008277978,-4140.670700690647,346302.36492058175,-674553.6726595213,-2902.1320262569297],[96988.86674083285,-144779.74075994108,-49999.32481087169,-534878.2643704212,16077.906786235993,-20286.875875392467,758.3103854457859,-5246.839957888878,-33060.95273847133,-601.8182639478907,13991.230988576168,-7642.847779885503,-8625.78440059749],[-35594.87748742263,210410.55313706482,42647.89411368855,-13268.46695623584,47227.87435081623,424552.8637220343,-107350.5269178249,-8899.56871358089,10603.680498353284,356451.5795218166,-85.64259514089392,-220749.72036926867,-7482.557495555623],[3844.301476728007,-876000.3755905367,-864832.1500358571,-192365.71857990578,-83976.60553279676,-1144.883458005892,75390.63483047695,-207384.53508071954,262986.1576213666,324082.499583339,-358213.77788368013,420041.19902949897,28553.364308543445],[3562.1983312663947,232641.98068257535,82075.51567221542,-76328.5851546335,-232217.03016216497,4577.114950808784,-41.3893114354954,2191.548812367663,169798.79850846517,145639.94338827932,-93475.52050963308,532898.6134222631,39324.485146787534],[-340207.6699832969,24096.713530272184,15.850920289807151,16404.109879704443,124516.62757097352,20694.550417419858,520015.1470795807,-143275.72062737122,-56098.60068224838,-11352.172388846548,-17744.75614602688,92054.25228426789,6208.26863087362],[287422.18433680263,809041.3863806557,95775.42457550146,3022.938922281885,4915.721473182077,-304501.22334510396,37168.511750260965,17370.20340741983,-10980.22618344548,463.6293509441482,225968.98210429933,391.66092486874317,948.469984076298],[787023.6414415056,-4179392.4177142903,9880.302303060042,23579.46232871552,159392.23356503167,7692.597657764786,605.476862644741,85508.23026924471,-133324.923764776,10084.811280098551,-535584.0225377675,-12388.764740999643,-453384.9260785273],[2483830.891886217,261493.51305531352,-1922.579057987,-5138.126856949994,-63091.90778437356,947.1288632410636,-1024610.3538269099,-21203.01797056141,-67618.91196587427,27283.27467893631,-7526.163013655194,-4146.693092917382,3747986.7787891477],[-1531.4259164336038,917.4463732127201,-103067.37689354602,400105.3350251175,-81999.20709231922,21705.73471991845,218.0571382347791,321108.4290774093,3915.916814064871,385077.1051123784,-12814.406725048573,134039.54607278653,5665.80960220625],[-43750.166986406875,-167.76934506625756,44061.71526333462,3892.911880993875,-415.1989800638782,-71480.11991515358,-184481.8484261078,-339.66035462024433,29983.678297314786,-505899.92187021597,352606.249096245,-81789.89323157277,-5812.437788209855],[-162466.74397065304,-46010.33855477552,-207706.71030334156,6157.560396908019,75384.01300547413,141447.32016171233,-1335353.1976944155,-98670.79066842039,1718.4079809573943,-98868.22322888355,-448473.14571101405,-82469.79935823579,-86672.28812022733],[660.3447587841778,-366663.64610827103,124.42154006560975,-2892078.532503058,-15103.210412009987,1968.8595218275514,-18451.339929588048,14681.525454451556,-705.1779012590147,-151.95787276529245,75663.59572541254,9874.0690166676,0.0843119967303197],[17466.72334046699,-9528.27311785099,-17936.7385093151,11983.790977066723,1635999.507686768,-22103.793257111214,-1807112.2363040007,4546.710445944326,2507.1852673286403,-10281.289603732617,-419028.60926753364,-53686.91740054323,-20413.32494842418],[25258.78522425633,19693.964369085887,-73657.76625550656,-220603.7806554533,-18317.50949822619,78053.9339352122,-33584.08574381323,147812.23573968787,640.6327956012187,7404.56922900042,4.129457249490612,377530.1772754296,-195045.53992007495]],[[-21644.60772390521,-82228.22412185729,7157.750504606181,-1739.1770549106004],[-1145378.7603003709,-24082.78267488427,67899.03955480758,-16670.637768119646],[-682947.9203509325,-61346.24947613035,192.46078499408563,-914.3323325110148],[-14434.108045663574,53381.542324435344,-3534.465420144235,3642.714104894914],[-11079.09288275995,-122443.8752003446,162813.37823608052,133.4036175130383],[-53819.20682303633,6117.681587601511,-472.03762255322795,-42949.35090578532],[-822.8411414363278,47167.87258409806,4973.314006561427,30.90186674380819],[-208510.62070284746,14022.759051074769,-58432.958921328514,49221.54520844885],[789.5326349012447,106722.16202121314,-3175.4224547317654,67578.67278482189],[25884.45877046934,-256.99168213071437,-389.40447177655403,-29087.820076733486],[-1676.7077922088777,75692.16766074287,-181207.8780434347,9770013.045364084],[2576.1808170440004,-15424.235002337406,-114894.29621589805,209809.9579246105],[399707.45973785414,8972.256798468881,-340624.1339081319,96868.79344633769]]]}
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

function create_new_element(current_board, bot = 0){
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
  if(bot === 0){
    show_new_element_on_board(generate_on_field, value);
  }
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
    clear_board(board);
    for(let i = 0; i < board.length; i++){
      if(board[i] != undefined){
        show_new_element_on_board(i, board[i]);
      }
    }
  }
  if(create_new_element(board, bot) == "LOOSE"){
    let highest = 2;
    for(let i = 0; i < board.length; i++){
      if(board[i] > highest){
        highest = board[i];
      }
    }
    if(bot === 0){
      clear_board(board);
    }
    for(let i = 0; i < board.length; i++){
      board[i] = undefined;
    }
    return ["LOOSE", highest];
  }
  return "LIVE";
}

function clear_board(board){
    for(let i = 0; i < board.length; i++){
      document.getElementById("box_"+String(i)).innerHTML = "";
    }
}

game_controller();

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
      return [weights.weight.weights];
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
function start_a_player(weights, bot){

  console.log("This is the weights, I was given.", weights);
  let old_board = Array(25);
  let board = Array(25);

  while(true){
    old_board = board.slice();
    let out_come = game_move(make_it_a_move(board, weights), board, bot);

    if(out_come[0] == "LOOSE"){
      //console.log("This is the best score:", out_come[1]);
      return [calc_score(old_board, out_come[1]), out_come[1]];
    }
  }
}

// Calc the score of a board
function calc_score(board, highest){
  let total = highest;
  for(let i = 0; i < board.length; i++){
    total += board[i];

    if(i % 5 < 4){
      if(board[i] === board[i + 1]){
        total += Math.round(board[i] * 0.2);
      }
    }
    if(i < 20){
      if(board[i] === board[i + 5]){
        total += Math.round(board[i] * 0.2);
      }
    }
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
function reproducing(parent_weights, margin=0.005){
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
function perfectly_balanced(big_happy_family, amount=0){
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
      s_scores.push(start_a_player(family[i]), 1);
    }
    let scores = [[], []];
    for(let i = 0; i < s_scores.length; i++){
      scores[0].push(s_scores[i][0]);
      scores[1].push(s_scores[i][1]);
    }

    bubbleSortAlgo(scores, family);

    if(k % 500 === 0){
      save_weights(family[0]);
    }

    let survivors = perfectly_balanced(family, 0.75);
    family = repropulate(survivors);
    if(k % 20 === 0){
      console.log("This is k", k, "and the best NN in this family got:", scores[0][0], "The best block it got was: ", scores[1][0]);
    }
  }
}

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