const Sequelize = require('sequelize');
const fs = require('fs');
const editJsonFile = require("edit-json-file");
var conf = editJsonFile('config.json');
var config = editJsonFile('/etc/ec/config/config.json');
var config_path = conf.get("config_path")+"/config.json"
var db_username, db_password, db_name,log_db_name;
var sequelize_port = 3306;
var db_username	=	conf.get('db_username');
var	db_password	=	conf.get('db_password');
var	db_name    	=	conf.get('db_name');

var sequelize = new Sequelize('mysql://'+db_username+':'+db_password+'@localhost:'+sequelize_port+'/'+db_name,{ define: {charset: 'utf8',collate: 'utf8_general_ci', timestamps: true},logging:false});

module.exports = {
		"db":sequelize
};
