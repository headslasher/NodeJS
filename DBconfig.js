module.exports ={
	    user          : process.env.NODEORACLEDB_USER || "scott",
	    password      : process.env.NODEORACLEDB_PASSWORD || "tiger",
	    connectString : process.env.NODEORACLEDB_CONNECTIONSTRING || "localhost/XE"
};