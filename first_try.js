const http = require('http');
const fs = require('fs');
const https = require('https');

let server = http.createServer((request, response) => {
    if(request.method == "GET"){
        return_html(request, response);
    } else {
        response.writeHead(404);
        response.end();
    }
});

server.listen(13370);

function return_html(request, response){
    console.log("This is the request:", request.url);
    
    let modified_url_1 = request.url.split("");
    modified_url_1.shift();
    //console.log("This is modefied", modified_url);
    let modified_url = "";
    for(let i = 0; i < modified_url_1.length; i++){
        modified_url += modified_url_1[i];
    }

    console.log("Please work:", modified_url);

    if(modified_url != "/" && fs.existsSync(modified_url)){
        let [file_name, file_type] = modified_url.split(".");
        switch(file_type){
            case "html":
                response.writeHead(200, {'Content-Type': 'text/html'});
                break;
            case "css":
                response.writeHead(200, {'Content-Type': 'text/css'});
                break;
            case "js":
                response.writeHead(200, {'Content-Type': 'text/javascript'});
                break;
            case "png":
                response.writeHead(200, {"Content-Type": "image/png"});
                response.write(fs.readFileSync(modified_url), "binary");
                response.end();
                return;
                break;
            case "jpg":
                response.writeHead(200, {"Content-Type": "image/jpg"});
                response.write(fs.readFileSync(modified_url), "binary");
                response.end();
                return;
                break;
            default:
                response.writeHead(404);
                response.end();
                console.log("I was asked for a file type, I didn't reconize");
        }
        response.write(fs.readFileSync(modified_url).toString());
        response.end();
    } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(fs.readFileSync("rabbits.html"));
        response.end();
    }
}
