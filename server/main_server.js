"use strict"

const fs = require("fs");
const https = require("https");
const http = require("http");
const nunjucks = require("nunjucks");
const path = require("path");

nunjucks.configure('', {
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

function check_valid_fields(message){
  if(password_tjeck(message.password) && name_check(message.title) && message.content != ""){
    if(message.title.search(".") != -1){
      console.log("This is the path:", message.path_for_file);
      return true;
    } else {
      let [file_name, file_type] = message.title.split(".");
      if(file_type == "txt"){
        return true;
      } else {
        return false;
      }
    }
  }
}

function name_check(title){
  console.log("this is the title:", title);
  if(title.search(",") != -1 || title.search("'") != -1 || title.search("'") != -1 || title.search('"') != -1 || title == "" || 
      title == " " || title == "/" || title == "\\"){
    return false;
  } else {
    console.log("name_check correct", title)
    return true;
  }
}

function password_tjeck(password_given){
  console.log("This is what i wnated:", password_given);
  if(password_given === "HeyPleaseDontLetMeDoIt"){
    console.log("correct password");
    return true;
  } else {
    return false;
  }
}

async function POST_method_response(req, res){
  let new_post = await post_value(req, res);
  let message = JSON.parse(new_post);
  if(check_valid_fields(message) == true){
    if(message.title.search(".") == -1){
      console.log("I'm alive", message.title.search("."));
      let file_name = message.path_for_file + message.title;
      fs.writeFile(file_name, message.content, function(err){
        if(err) console.log(err);
      });
      console.log("Succesfult created / edited file:", file_name);
    } else {
      console.log("What!!!");
      fs.mkdir(message.path_for_file + "/posts/" + message.title, function(err){
        if(err) console.log(err);
      });
      fs.mkdir(message.path_for_file + "posts/" + message.title + "/posts/", function(err){
        if(err) console.log(err);
      });
      fs.writeFile(message.path_for_file +"posts/" + message.title + "/discription.txt", message.content, function(err){
        if(err) console.log(err);
      });
      console.log("I just succedded in making a file");
    }
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

    let current_path = __dirname;
    let source_url = current_path.substring(0, current_path.length - "server".length);

    let new_url = "";
    for(let i = 0; i < modified_url.length; i++){
        new_url += modified_url[i];
    }

    //console.log("This is the url:", source_url + new_url);

    if(!isFile(source_url + new_url)){
      let json_object_containing_posts = {"titles": [], "content": [], "edit": [], "discription": []};
      //console.log("I just found a folder");
      if(new_url.search("content") != -1){
        let new_new_url = "";
        for(let i = 0; i < new_url.length - "content".length - 1; i++){
          new_new_url += new_url[i];
        }
        new_new_url += "/posts";

        let dir_path = source_url + new_new_url;
        //console.log(dir_path);
        let files = fs.readdirSync(dir_path);
        files.forEach(function(file) {

          json_object_containing_posts.titles.push(file);
          let stats = fs.statSync(dir_path + "/" + file);
          let mtime = convert_time_m(stats.mtime);
          
          let emtime = "";
          for(let s = 0; s < mtime.length - 12 - 9; s++){
            emtime += mtime[s];
          }
          emtime += " (GMT+0200)";
          json_object_containing_posts.edit.push(emtime);

          if(isFile(file)){
            let [file_name, file_type] = file.split(".");
            if(file_type == "txt"){
              //console.log("this is so stupid:", dir_path + w + file)
              let data = fs.readFileSync(dir_path + "/" + file, {encoding: "utf8", flag:"r"});
              json_object_containing_posts.content.push(data);
            }
          } else {
            //console.log("THis is new_new_url:", new_new_url);
            let start_index = new_new_url.search("Fony-Stark.github.io");
            start_index = (start_index != -1) ? start_index : 0;
            let link = "";
            for(let k = start_index + 6; k < new_new_url.length; k++){
              link += new_new_url[k];
            }
            json_object_containing_posts.content.push("!LINK\n" + link);

            let data = fs.readFileSync(dir_path + "/" + file + "/discription.txt", {encoding: "utf8", flag:"r"});
            json_object_containing_posts.discription.push(data);
          }
        });
        //console.log("This is the json_object", json_object_containing_posts.content);
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify(json_object_containing_posts));
        response.end();
      }
      return;
    }

    //console.log("\nThis is the request I got", request);
    //console.log("\nAnd this is the url:", request.url);

    if(new_url != "" && new_url != "/" && fs.existsSync(source_url + new_url)){
        let [file_name, file_type] = new_url.split(".");
        try {
          switch(file_type.toLowerCase()){
              case "html":
                  response.writeHead(200, {"Content-Type": "text/html"});
                  response.write(nunjucks.render(source_url + new_url));
                  response.end();
                  return;
                  break;
              case "css":
                  response.writeHead(200, {"Content-Type": "text/css"});
                  break;
              case "js":
                  //console.log("This is what I found:", new_url);
                  response.writeHead(200, {"Content-Type": "text/javascript"});
                  console.log();
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
                  response.writeHead(404);
                  response.end();
                  console.log("I was asked for a file type, which I isn't programmed for:", file_type);
                  return;
              }
        } catch(err) {
          //console.log(err);
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


"27 of May 2020 / 3:17 PM (UTF +1)"
function convert_time_m(mtime){
  return String(mtime);
}

function isFile(pathItem) {
  return !!path.extname(pathItem);
}
