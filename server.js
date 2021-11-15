//Install express server
const express = require('express');
const path = require('path');

const app = express();

var proxy = require('express-http-proxy');

var apiProxy = proxy('/api', {target: 'http://169.51.206.176:32451/model/predict'});


// Serve only the static files fr0m the dist directory
app.use(express.static(__dirname + '/dist/AbuseFlagger'));
// app.use('/api', proxy('http://169.51.206.176:32451/model/predict',  {
//     proxyReqPathResolver: req => url.parse(req.baseUrl).path
// }) );

app.get('/*', function(req,res) {
 

res.sendFile(path.join(__dirname+'/dist/AbuseFlagger/index.html'));
});
app.use(apiProxy)
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);