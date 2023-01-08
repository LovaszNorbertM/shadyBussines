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
var proxyaddr = require('proxy-addr')

const app = express();
app.set('trust proxy', true);
app.use(requestIp.mw());

const path = 'tmp/data.json';

const logIp = (req) => {
    const ips = jsonfile.readFileSync(path);
    const ip = requestIp.getClientIp(req)
    ips.unshift({ 
        time: new Date(), 
        ip, 
        forwarder:  req.headers['X-Forwarder-For'] || null,
        proxyaddr: proxyaddr(req, () => true),
    });
    jsonfile.writeFileSync(path, ips, { spaces: 2, replacer: null });
}

const logHeaders = (req) => {
        const ips = jsonfile.readFileSync(path);
    const headers = {
        ...req.headers
    };
    
    ips.unshift({ 
        time: new Date(), 
        headers,
        ...req.body,
    });
    jsonfile.writeFileSync(path, ips, { spaces: 2, replacer: null });

}

app.get("/masUiddFlagFS212",function(req,res) {
    // const response = {
    //     ipAddress: ip.address,req
    //     reqIp: req.ip,
    //     clientIp: req.clientIp,
    //     getClientIp: requestIp.getClientIp(req),
    // }

    logIp(req);
    // logHeaders(req);
    res.redirect("https://google.com");
});
app.use(express.static('static'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port number" + PORT);
});

app.get('/nuke-a-cola-to-the-moon-ola/123/123/', (req, res) => {
    const ips = jsonfile.readFileSync(path);
    res.end(JSON.stringify(ips, null, 2));

})