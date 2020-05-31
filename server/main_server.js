"use strict"

let fs = require("fs");
let https = require("https");
let http = require("http");

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
    } else {
        response.writeHead(404)
        response.end();
    }

    //here it says, that i can take a new connection.
    fs.writeFile(port_listener.toString() + ".txt", "0", function(err) {
        if(err) throw err;
    });
}

function GET_method_response(request, response){
    let modified_url = request.url.split("");
    modified_url.shift();

    let source_url = "/home/pi/webserver/Fony-Stark.github.io/"; 

    //console.log("\nThis is the request I got", request);
    //console.log("\nAnd this is the url:", request.url);

    let new_url = "";
    for(let i = 0; i < modified_url.length; i++){
        new_url += modified_url[i];
    }

    if(new_url != "" && new_url != "/" && fs.existsSync(source_url + new_url)){
	//console.log("this:", new_url);

        let [file_name, file_type] = new_url.split(".");
        switch(file_type.toLowerCase()){
            case "html":
                response.writeHead(200, {"Content-Type": "text/html"});
                break;
            case "css":
                response.writeHead(200, {"Content-Type": "text/css"});
                break;
            case "js":
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
                response.writeHead(404);
                response.end();
                console.log("I was asked for a file type, which I isn't programmed for:", file_type);
		return;
        }   
        response.write(fs.readFileSync(source_url + new_url).toString());
        response.end();
    } else {
        response.writeHead(200, {"Contet-Type": "text/html"});
        response.write(fs.readFileSync(source_url + "/index.html").toString());
        response.end();
        console.log("I just send the main page");
    }
}
