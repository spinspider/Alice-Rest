var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var fs = require('fs');

var User = require('../user/User');
var config = require('../config');
const editJsonFile = require("edit-json-file");
var conf = editJsonFile("config.json");
/* Configure JWT */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const access_roles = {
  "OPERATOR" : "OPERATOR_ADMIN"
}

router.post('/login', function(req, res) {
  console.log("login call ",req.body)
  User.findOne({raw:true,where: {email: req.body.email}}).then(function(user){
    if((user == 0) || (user == null) || (!user)){
      return res.status(404).send('No user found.');
    }else{
     
          // check if the password is valid
          var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

          if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

          //if user is found and password is valid
          // create a token
          var token = jwt.sign({ id: user.user_id,org_status: 1, user_status: 1}, config.secret, {
            expiresIn: conf.get('expires_time') // expires in 15 mins
          });
          //return the information including token as JSON
          res.status(200).send({ auth: true, token: token,userId:user.user_id,expireMin: conf.get('expires_time'),first_name:user.first_name,last_name:user.last_name });
        
      
     
    }
  },function(err){
    return res.status(500).send('Error on the server.');
  })
});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

/*router.post('/token', VerifyToken, function(req, res) {  
  User.findOne({raw:true,where:{user_id:req.userId}}).then(function(user){
    var org_id =user.org_id;
    Org.findOne({raw:true,where: {org_id: org_id,status:1},include:{model:CreditSystem,attributes:['credit_system']}}).then(function(org){
      
      var token = jwt.sign({ id: user.user_id, org_status: org.status, user_status: user.status }, config.secret, {
        expiresIn: conf.get('expires_time') // expires in 15 mins
      });
      res.status(200).send({ auth: true, token: token, userId:user.user_id, orgId:user.org_id, expireMin: conf.get('expires_time'),credit_system:org.creditsystems, roles:user.roles, first_name:user.first_name, last_name:user.last_name });      
    },function(err){
      res.status(500).send("No Org Found")
    });
  },function(err){
    res.status(500).send("No User Found")
  })
});

router.post('/register', VerifyToken, function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  User.create({
    user_name     : req.body.name,
    mail_id    : req.body.email,
    password : hashedPassword,
    user_id : guid()
  }).then(function(user){
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: conf.get('expires_time') // expires in 15 mins
    });

    res.status(200).send({ auth: true, token: token });
  },function(err){
    res.status(500).send("There was a problem in registering the user");
  }) 
});*/

module.exports = router;