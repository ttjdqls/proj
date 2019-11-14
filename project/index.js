var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    port     : 3306,
    database : 'final'
});
connection.connect();


var username;


router.get('/', function(req, res, next){
  res.render('login');
});

router.post('/', function(req, res, next){
    var body = req.body;
    var userid = body.userid;
    var userpw = body.userpw;

    var query = connection.query('select * from userid where userid=\'' + userid + '\' and userpw=\'' + userpw + '\'', function(err, rows) {
      if(!err) {
        if (rows[0]!=undefined) {
          if (rows[0]['userid'] == "admin") {
            username = rows[0]['username'];
            res.redirect('/admin_main');
          }
          else {
          username = rows[0]['username'];
          res.redirect('/main');
          }
        }
        else {
          throw err;
        }
      }
      else {
        throw err;
      }
    });
});

router.get('/signup', function(req, res, next){
  res.render('signup');
});

router.post('/signup', function(req, res, next){
    var body = req.body;
    var userid = body.userid;
    var userpw = body.userpw;
    var username = body.username;
    var userage = body.userage;
    var useremail = body.useremail;

    var query = connection.query('insert into userid (userid, userpw, username, userage, useremail) values ("' + userid + '","' + userpw + '","' + username + '","' + userage + '","' + useremail + '")', function(err, rows) {
      if(!err) {
        res.redirect('/');
      }
      else {
        throw err;
      }
        console.log("Data inserted!");
    });
});

router.get('/main', function(req, res, next) {
  res.render('main', {username : username});
});

router.get('/space', function(req, res, next) {
    var query = connection.query('select * from space', function(err, rows) {
      if(!err) {
        res.render('space', {username : username, rows : rows});
      }
      else {
        throw err;
      }
    });
});

router.get('/admin_space', function(req, res, next) {
    var query = connection.query('select * from space', function(err, rows) {
      if(!err) {
        res.render('admin_space', {username : username, rows : rows});
      }
      else {
        throw err;
      }
    });
});

router.get('/reservation', function(req, res, next) {
  res.render('reservation', {username : username});
});

router.post('/reservation', function(req, res, next) {
  var body = req.body;
  var reservspace = body.reservspace;
  var reservdate = body.reservdate;
  var reservtime1 = body.reservtime1;
  var reservtime2 = body.reservtime2;
  var reservnum = body.reservnum;
  var reservnow = body.reservnow;

  var query = connection.query('insert into reserv (reservuser, reservspace, reservdate, reservtime1, reservtime2, reservnum, reservnow) values ("' + username + '","' + reservspace + '","' + reservdate + '","' + reservtime1 + '","' + reservtime2 + '","' + reservnum + '","' + reservnow + '")',function(err, rows) {
    if(!err) {
      res.redirect('/main');
    }
    else {
      throw err;
    }
      console.log("Data inserted!");
  });
});

router.get('/check', function(req, res, next) {
  var query = connection.query('select * from reserv where reservuser = "' + username + '" order by reservdate',function(err, rows) {
    if(!err) {
      res.render('check', {username : username, rows : rows});
    }
    else {
      throw err;
    }
  });
});

router.get('/delete/:a', function(req, res, next) {
  var query = connection.query('delete from reserv where reservuser = "' + username + '" and reservnum = "' +[req.params.a]+ '"', function(err, rows){
    if(!err){
      res.redirect('/main');
    }
    else {
      throw err;
    }
  });
  console.log("Data deleted!");
});

router.get('/admin_main', function(req, res, next) {
  res.render('admin_main', {username : username});
});

router.get('/admin_check', function(req, res, next) {
  var query = connection.query('select * from reserv order by reservuser,reservdate',function(err, rows) {
    if(!err) {
      res.render('admin_check', {username : username, rows : rows});
    }
    else {
      throw err;
    }
  });
});

router.get('/admin_update/:a', function(req, res, next) {
  var query = connection.query('update reserv set reservnow = "승인 완료" where reservnum = "' +[req.params.a]+ '"', function(err, rows){
    if(!err){
      res.redirect('/admin_main');
    }
    else {
      throw err;
    }
  });
  console.log("Data updated!");
});

router.get('/admin_delete/:a', function(req, res, next) {
  var query = connection.query('delete from reserv where reservnum = "' +[req.params.a]+ '"', function(err, rows){
    if(!err){
      res.redirect('/admin_main');
    }
    else {
      throw err;
    }
  });
  console.log("Data deleted!");
});

router.get('/admin_edit/:a', function(req, res, next) {
  var query = connection.query('select * from space where spacename = "' +[req.params.a]+ '"', function(err, rows){
    if(!err){
      res.render('admin_edit', {rows : rows});
    }
    else {
      throw err;
    }
  });
});

router.post('/admin_edit/:a'), function(req, res, next) {
  var body = req.body;
  var spacename = body.spacename;
  var spaceusernum = body.spaceusernum;
  var spaceprefer = body.spaceprefer;
  var spaceset = body.spaceset;

  var query = connection.query('update space set spacename = "' + spacename + '", spaceusernum = "' + spaceusernum + '", spaceprefer = "' + spaceprefer + '", spaceset = "' + spaceset + '" ',function(err, rows) {
    if(!err) {
      res.redirect('/admin_main');
    }
    else {
      throw err;
    }
      console.log("Data Updated!");
  });
};



module.exports = router;
