let http = require('http');
let fs = require('fs');
let https = require('https');

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
    console.log(request.url);
    if(request.url == "/makeup_common.css"){
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(fs.readFileSync("makeup_common.css").toString());
        response.end();
        console.log("I just passed common");
    } else if(request.url == "/makeup_homepage.css"){
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(fs.readFileSync("makeup_homepage.css").toString());
        response.end();    
        console.log("I just passed homepage");
    } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(fs.readFileSync("index.html").toString());
        response.end();
        console.log("I just passed the html");
    }
    
    return;
}
