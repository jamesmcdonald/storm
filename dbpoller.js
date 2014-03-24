var mysql = require('mysql');
var config = require('./config');

sets = {
    zabbixdata: [
        "Created_tmp_disk_tables",
        "Innodb_buffer_pool_wait_free",
        "Key_reads",
        "Select_full_join",
        "Slow_queries",
        "Threads_connected",
        "Threads_running",
        "max_connections",
        "Innodb_os_log_written",
        "Questions_pr_second",
        "Handler_read_first",
        "Open_tables",
        "Questions",
        "accountsWithBroadHostSpecifier",
        "rootAccounts",
        "accountsWithNoPassword",
        "rootRemoteLoginEnabled",
        "rootEmptyPassword",
        "global_Super_priv_count",
        "global_Grant_priv_count"
    ]
};

// Get inspection data from a MySQL connection and add to data[hostname]
function getmysqlstatus(conn, data) {
    var hostname = conn.config.connectionConfig.host;
    conn.query('show global variables', function(err, rows, fields) {
	if (err) {
            console.log("Database error with " + hostname + ": " + err);
            setTimeout(getmysqlstatus, 5000, conn, data);
            return;
	}
        if (hostname in data) {
            data[hostname + '_prev'] = data[hostname];
        }
	d = data[hostname] = {};
	for (var i=0; i<rows.length; i++) {
            d[rows[i].Variable_name] = rows[i].Value;
	}

	console.log("Got data for db: " + hostname);
	setTimeout(getmysqlstatus, 5000, conn, data);
        conn.query('show global status', function(err, rows, fields) {
	    for (var i=0; i<rows.length; i++) {
                d[rows[i].Variable_name] = rows[i].Value;
	    }
            
            // Calculate queries per second
            if (hostname + '_prev' in data &&
                'Questions' in data[hostname + '_prev']) {
                d['Questions_pr_second'] =
                    (d['Questions'] - data[hostname + '_prev']['Questions']) / 5;
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

function connect(dbserver) {
    var conn = mysql.createPool({host:dbserver, user:config.dbuser, password:config.dbpass});
    conn.on('error', function(err) { console.log(err); });
    return conn;
}

exports.getmysqlstatus = getmysqlstatus;
exports.connect = connect;
