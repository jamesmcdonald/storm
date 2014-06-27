var config = {}

/* Example configuration */

/* Port to listen on */
config.port = 2001;

/* Credentials to use for MySQL databases */
config.dbuser = 'something';
config.dbpass = 'something';

/* Databases to probe */
config.dbservers = [
    'localhost'
];

/* Sets of sensors to return together */ 
config.sets = {
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

/* Log processlist if more than this number of threads are running */
config.maxthreads = 100;

/* Throttle processlist logging to only log again after this many seconds */
config.logthrottle = 60;

module.exports = config;
