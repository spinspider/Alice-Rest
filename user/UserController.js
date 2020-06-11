var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
const editJsonFile = require("edit-json-file");
var conf = editJsonFile("config.json");
//var VerifyToken = require(__root + 'auth/VerifyToken');
router.use(bodyParser.urlencoded({ extended: true }));

var User = require('./User');

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// CREATES A NEW USER
router.post('/' , function (req, res) {
  console.log("create call",req.body)
    var request = req.body;
    request.password = bcrypt.hashSync(req.body.password, 8);
    if(req.body.domain === ""){
      request.user_info=0;
     }else{
      request.user_info=1;
     }
        request.user_id = guid();
        User.create(request).then(function(user){
          var token = jwt.sign({ id: user.user_id,org_status: 1, user_status: 1}, config.secret, {
            expiresIn: conf.get('expires_time') // expires in 15 mins
          });
          //return the information including token as JSON
          res.status(200).send({ auth: true, token: token,userId:user.user_id,expireMin: conf.get('expires_time'),first_name:user.first_name,last_name:user.last_name });
        },function(err){
            if(err.parent.sqlMessage) { return res.status(500).send(err.parent.sqlMessage)} //DUPLICATE ENTRY FOR UNIQUE FIELD
            res.status(500).send("User creation failed");
        })
    
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  var obj={};
  obj["user_info"] = 1;
  User.findAll({raw:true,where:obj,order:[['createdAt','DESC']]}).then(function(user){
    if (!user){return res.status(404).send("No user found.");} 
    res.status(200).send(user)
  },function(err){
    res.status(500).send("There was a problem finding the Users")
  })
});

router.post('/info', function (req, res) {
  console.log("req.body",req.body);
  var obj={};
  /*obj["domain"] = "Android";
  obj["location"] = "Bengalore";*/
  obj["domain"] = req.body.domain;
  obj["location"] = req.body.location;
  obj["user_info"] = 1;
  User.findAll({raw:true,where:obj}).then(function(user){
    if (!user){return res.status(404).send("No user found.");} 
    res.status(200).send(user)
  },function(err){
    res.status(500).send("There was a problem finding the Users")
  })
});

// GETS A SINGLE USER FROM THE DATABASE
/*router.get('/:user_id', VerifyToken,  function (req, res) {
    User.findOne({raw:true,where:{user_id:req.params.user_id}}).then(function(user){
        if (!user){return res.status(404).send("No user found.");}
        user.password="";
        res.status(200).send(user);
    },function(err){
        res.status(500).send("There was a problem finding the user.");
    });
});*/

//FOR UPDATION USE ONLY _ID

/*router.put('/:user_id',  VerifyToken,  function (req, res) {
    function execute(){
        if(req.body.password){
          req.body.password = bcrypt.hashSync(req.body.password, 8);
        }else{
          delete req.body.password;
        }
        User.update({
          password          :req.body.password,
          phone_number      :req.body.phone_number,
          status            :req.body.status
        },
        {
          where: {user_id:req.params.user_id}
        }).then(function(rowsUpdated) {
          if(rowsUpdated == 0) {res.status(500).send("no rows updated")}
          if(rowsUpdated > 0) {res.status(200).send("User updated successfully")}
        });
    }

    if((req.body.user_id == req.userId) && (req.body.status == false)){
        res.status(500).send("Unable to disable the self account");
    }else{
        execute();
    }
});
*/
module.exports = router;