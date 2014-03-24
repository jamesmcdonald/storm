var express = require('express');
var dbpoller = require('./dbpoller');

var stuff = {
    db: {}
};
var dbservers = [
    "localhost",
    "derpy.shee.sh",
];

for (var i=0;i<dbservers.length; i++) {
    conn = dbpoller.connect(dbservers[i]);
    dbpoller.getmysqlstatus(conn, stuff.db, 5000);
}

app = express();
app.get('/', function(req, res) {
    res.setHeader("Content-type", "text/json");
    res.send(stuff);
});
app.get('/:subsys', function(req, res) {
    var subsys = req.params.subsys;
    if (!(subsys in stuff)) {
	res.status(404).send("404 Not Found");
	return;
    }
    res.setHeader("Content-type", "text/json");
    res.send(Object.keys(stuff[subsys]));
});
app.get('/:subsys/:hostname', function(req, res) {
    var subsys = req.params.subsys;
    var hostname = req.params.hostname;    
    if (!(subsys in stuff) || !(hostname in stuff[subsys])) {
	res.status(404).send("404 Not Found");
	return;
    }
    res.setHeader("Content-type", "text/json");
    res.send(Object.keys(stuff[subsys][hostname]));
});
app.get('/:subsys/:hostname/:sensor', function(req, res) {
    var subsys = req.params.subsys;
    var hostname = req.params.hostname;
    var sensor = req.params.sensor;
    if (!(subsys in stuff) || !(hostname in stuff[subsys]) ||
	!(sensor in stuff[subsys][hostname])) {
	res.status(404).send("404 Not Found");
	return;
    }
    res.setHeader("Content-type", "text/json");
    if (typeof stuff[subsys][hostname][sensor] === "object") {
	var sv = stuff[subsys][hostname][sensor];
    } else {
	sv = {};
	sv[sensor] = stuff[subsys][hostname][sensor];
    }
    res.send(sv);
});

app.listen(2001);
