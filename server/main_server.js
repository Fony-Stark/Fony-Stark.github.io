"use strict"

let fs = require("fs");
let https = require("https");
let http = require("http");
let nunjucks = require("nunjucks");

nunjucks.configure('/home/fony/Desktop/github/Fony-Stark.github.io/blogs/', {
  autoescape: true
});

for(let i = 0; i < 25; i++){
    http.createServer((req, res) => {
        server_functions(req, res, 8081 + i);
    }).listen(8081 + i);
}

function server_functions(req, res, port_listener){
    //Here should the server tell the socket that it is busy.
    fs.writeFile(port_listener.toString() + ".txt", "1", function(err) {
        if(err) throw err;
    });

    if(req.method == "GET"){
        GET_method_response(req, res);
    } else if(req.method == "POST"){
        POST_method_response(req, res);
    } else {
        response.writeHead(404)
        response.end();
    }

    //here it says, that i can take a new connection.
    fs.writeFile(port_listener.toString() + ".txt", "0", function(err) {
        if(err) throw err;
    });
}

function password_tjeck(password_given){
  if(password_given == "HeyPleaseDontLetMeDoIt"){
    return true;
  } else {
    return false;
  }
}

async function POST_method_response(req, res){
  let new_post = await post_value(req, res);
  let message = JSON.parse(new_post);
  if(password_tjeck(message.password)){
    let current_time = new Date();
    current_time = current_time.getMilliseconds() % 1000;

    let file_name = message.path_for_file + message.title + current_time + ".json";
    fs.writeFile(file_name, message.content, function(err){
      if(err) console.log(err);
    });
    console.log("Succesfult created / edited file:", file_name);
  } else {
    console.log("Someone with the wrong password just tried to edit my files");
  }
}

async function post_value(req, res){
  let body_of_post = "";
  await req.on("data", function(data) {
    body_of_post += data
  });

  await req.on("end", function() {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end("Post received");
  });

  return body_of_post;
}

function please_work(text){
  console.log(text);
}

function GET_method_response(request, response){
    let modified_url = request.url.split("");
    modified_url.shift();

    let source_url = "/home/fony/Desktop/github/Fony-Stark.github.io/";

    //console.log("\nThis is the request I got", request);
    //console.log("\nAnd this is the url:", request.url);

    let new_url = "";
    for(let i = 0; i < modified_url.length; i++){
        new_url += modified_url[i];
    }
    console.log(new_url);

    if(new_url != "" && new_url != "/" && fs.existsSync(source_url + new_url)){
        let [file_name, file_type] = new_url.split(".");
        try {
          switch(file_type.toLowerCase()){
              case "html":
                  response.writeHead(200, {"Content-Type": "text/html"});
                  response.write(nunjucks.render(source_url + new_url));
                  return;
                  break;
              case "css":
                  response.writeHead(200, {"Content-Type": "text/css"});
                  break;
              case "js":
                  console.log("This is what I found:", new_url);
                  response.writeHead(200, {"Content-Type": "text/javascript"});
                  break;
              case "png":
                  response.writeHead(200, {"Content-Type": "image/png"});
                  response.write(fs.readFileSync(source_url + new_url), "binary");
                  response.end();
                  return;
              case "jpg":
                  response.writeHead(200, {"Content-Type": "image/jpg"});
                  response.write(fs.readFileSync(source_url + new_url), "binary");
                  return;
  	          case "jpeg":
  		            response.writeHead(200, {"Content-Type": "image/jpeg"});
  		            response.write(fs.readFileSync(source_url + new_url), "binary");
  		            return;
              default:
              console.log
                  response.writeHead(404);
                  response.end();
                  console.log("I was asked for a file type, which I isn't programmed for:", file_type);
                  return;
              }
        } catch(err) {
          response.writeHead(200, {"Contet-Type": "text/html"});
          response.write(fs.readFileSync(source_url + "homepage/index.html").toString());
          response.end();
          return;
        }
        response.write(fs.readFileSync(source_url + new_url).toString());
        response.end();
    } else {
        response.writeHead(200, {"Contet-Type": "text/html"});
        response.write(fs.readFileSync(source_url + "homepage/index.html").toString());
        response.end();
        console.log("I just send the main page");
    }
}
