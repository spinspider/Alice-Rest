const Sequelize = require('sequelize');

var sequelize = require('./../db');

var User = sequelize.db.define('users', {
	first_name 		  : Sequelize.STRING,
	last_name 		  : Sequelize.STRING,
	email			  : {type : Sequelize.STRING,unique:true},
	user_id 		  : Sequelize.STRING,
	domain		      : Sequelize.STRING,
	location		  : Sequelize.STRING,
	password 		  : Sequelize.STRING,
	phone_number	  : {type : Sequelize.STRING,unique:true},
	department		  : Sequelize.STRING,
	batch 		      : Sequelize.STRING,
	user_info         : Sequelize.BOOLEAN

});

sequelize.db.sync().then(function() {
})

module.exports = User;