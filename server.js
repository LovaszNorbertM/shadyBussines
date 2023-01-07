// var http = require('http'); // 1 - Import Node.js core module

// var http = require('http'); // Import Node.js core module

// var server = http.createServer(function (req, res) {   //create web server
//     if (req.url == '/') { //check the URL of the current request
//         const clientIP = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
    
        
//         // set response header
//         res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
//         // set response content    
//         res.write('<html><body><p>This is home Page.</p></body></html>');
//         res.end(`The client's IP Address is: ${clientIP}`);
    
//     }
//     else if (req.url == "/student") {
        
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.write('<html><body><p>This is student Page.</p></body></html>');
//         res.end();
    
//     }
//     else if (req.url == "/admin") {
        
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.write('<html><body><p>This is admin Page.</p></body></html>');
//         res.end();
    
//     }
//     else
//         res.end('Invalid Request!');

// });

// server.listen(5000); //6 - listen for any incoming requests

// console.log('Node.js web server at port 5000 is running..')


const ip = require('ip');
const express = require('express');
const requestIp = require('request-ip');
const jsonfile = require('jsonfile');

const app = express();
app.set('trust proxy', true);
app.use(requestIp.mw());
app.use(express.static('static'));

const path = 'tmp/data.json';

const logIp = (ip) => {
    const ips = jsonfile.readFileSync(path);
    ips.push({ time: new Date(), ip });
    jsonfile.writeFileSync(path, ips, { spaces: 2, replacer: null });
}

app.get("/",function(req,res) {
    const response = {
        ipAddress: ip.address,
        reqIp: req.ip,
        clientIp: req.clientIp,
        getClientIp: requestIp.getClientIp(req),
    }
    logIp(requestIp.getClientIp(req));
    res.end(JSON.stringify(response, null, 2));
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port number" + PORT);
});