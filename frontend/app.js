var fs = require('fs');
var express = require('express');
const upload = require('express-fileupload')
var multer  = require('multer')
var router = express.Router();
const fileWorker = require('../backend/compress.js');
var app = express();
var bodyParser = require('body-parser')
var JSAlert = require("js-alert");

bodyParser = require('body-parser');
app.use('/',router);


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var jsonParser = bodyParser.json();
app.use(express.static("public"));
app.use(upload())
app.use('/',router);


router.use((req,res,next) => {
    next();
});

app.post('/upload', fileWorker.upload);

app.get('/getFileList',fileWorker.filelist);

app.get('/download',fileWorker.download)

app.post('/delete', jsonParser, fileWorker.delete)

app.get('/filelist',function(req, res){
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/ch', (req, res)=>{
    res.sendFile(__dirname + '/public/chinese.html');
});

//send email
nodeMailer = require('nodemailer'),
bodyParser = require('body-parser');

//send email!!!---------------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/send-email', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
          // should be replaced with real sender's account
          user: 'xusiqi599@gmail.com',
          pass: '@980117Xusiqi'
      },
  });
  console.log(req.body)
  let mailOptions = {
      // should be replaced with real recipient's account
      to: 'zhangyue19961218@gmail.com',
      subject: req.body.subject,
      text: "my name is "+ req.body.name + ". " + req.body.message
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  // res.writeHead(301, { Location: '../index.html' });
  res.send('<script>alert(" Your message has been sent. Thank you!"); setTimeout(function(){location.href="../index.html"},500) </script>')
  res.end();
});


let port = 3100;
app.listen(port, err => {
    console.log(`Listening on port: ${port}`);
  });
