var mysql = require('mysql');
var config = require('./config');

var sets = config.sets;

// Get inspection data from a MySQL connection and add to data[hostname]
function getmysqlstatus(conn, data) {
    var hostname = conn.config.connectionConfig.host;
    conn.query('show global variables', function(err, rows, fields) {
	setTimeout(getmysqlstatus, 5000, conn, data);
	if (err) {
            console.log("Database error with " + hostname + ": " + err);
            return;
	}
        if (hostname in data) {
            data[hostname + '_prev'] = data[hostname];
        }
	var d = data[hostname] = {};
	for (var i=0; i<rows.length; i++) {
            d[rows[i].Variable_name] = rows[i].Value;
	}

        conn.query('show global status', function(err, rows, fields) {
	    if (err) {
		console.log("Database error with " + hostname + ": " + err);
		return;
	    }
	    for (var i=0; i<rows.length; i++) {
                d[rows[i].Variable_name] = rows[i].Value;
	    }
            
            // Calculate queries per second
            if (hostname + '_prev' in data &&
                'Questions' in data[hostname + '_prev']) {
                d['Questions_pr_second'] =
                    (d['Questions'] - data[hostname + '_prev']['Questions']) / 5;
            }
	    if ('Threads_running' in d && d['Threads_running'] > config.maxthreads) {
		logpl(conn, "somefile");
	    }

            // Add the sets
            for (var set in sets) {
                d[set] = {}
                for(var i=0;i<sets[set].length;i++) {
                    if (sets[set][i] in d) {
                        d[set][sets[set][i]] = d[sets[set][i]];
                    }
                }
            }
        });
    });
}

function logpl(conn, filename) {
    conn.query("show full processlist", function(err, rows, fields) {
	console.log(rows);
    });
};

function connect(dbserver) {
    var conn = mysql.createPool({host:dbserver, user:config.dbuser, password:config.dbpass});
    conn.on('error', function(err) { console.log(err); });
    console.log("Created connection to " + dbserver + " as user " + config.dbuser);
    return conn;
}

exports.getmysqlstatus = getmysqlstatus;
exports.connect = connect;
