var fs = require('fs');
var express = require('express');
const upload = require('express-fileupload')
var multer  = require('multer')
var router = express.Router();
const fileWorker = require('../backend/compress.js');
var app = express();
var bodyParser = require('body-parser')
var JSAlert = require("js-alert");
var path = require("path")



var jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(upload())


router.use((req,res,next) => {
    next();
});


app.post('/upload', (req, res)=>{
    if(req.files){
       console.log(req.files)
       var file = req.files.logo
       var filename = file.name
       console.log(filename)
       
       file.mv('../upload/' + filename, function(err){
           if(err){
               res.send(err)
            //    res.redirect('/')
           }else{
               if(file.mimetype === 'application/pdf'){          
                   fileWorker.runOptimizer(filename.substring(0,filename.indexOf(".")));
                   res.send('<script>alert("File is uploaded, filesize: ' + getFileSize(file.size)+'. It is conpressing now!"); setTimeout(function(){location.href="../index.html"},2000) </script>')                 
               }else{
                fs.unlinkSync('../upload/' + filename);   
                res.send('<script>alert("The type of file is not valid, please send a PDF file!!"); setTimeout(function(){location.href="../index.html"},500) </script>')
               }
           }
       })
    }else{
        res.send('<script>alert("No file uploaded, please choose a file !"); setTimeout(function(){location.href="../index.html"},500) </script>')
    }  
});


function getFileSize(size){
    if(size < 1024*1024){
        return (size/1024).toFixed(2)+'KB'
    }else if(size >= 1024*1024&&size<Math.pow(1024, 3)){
        return (size/1024.0/1024).toFixed(2)+'MB'
    }else{
        return (size/1024.0/1024/1024).toFixed(2)+'GB'
    }
    
}

app.get('/download',function(req,res){
    var filePath = req.query.path;
    // var filePath = filePath.substring(3)
    console.log('download file: '+filePath)
    filePath = path.join(__dirname, '../'+filePath);
    res.attachment(filePath)
    res.sendFile(filePath)
})


router.post('/delete', jsonParser, function(req, res, next){
    var filePath = req.body.filePath;
    console.log('delete file：'+filePath)
    try {
        fs.unlinkSync(filePath)
        // 重定向到列表页
        res.send('success')
    } catch (error) {
        res.send('failed!!')
    }
    
})

// app.get('/filelist', fileWorker.listAllFiles);
app.get('/filelist',function(req, res){
    res.sendFile(__dirname + '/public/index.html');
})


app.get('/getFileList',function(req, res, next){
    var filelist = getFileList('../Output')
    res.send(filelist)
})

function getFileList(path){
    var filelist = [];
    readFile(path, filelist);
    return filelist;
}


function readFile(path, filelist){
    var files = fs.readdirSync(path);
    files.forEach(walk);

    function walk(file)
    {
        var state = fs.statSync(path+'/'+file)
        if(state.isDirectory()){
            readFile(path+'/'+file, filelist)
        }else{
            var obj = new Object;
            obj.size = state.size;
            obj.name = file;
            obj.path = path+'/'+file;
            filelist.push(obj);
        }
    }
}

// app.post('delete', fileWorker.delete);

app.use('/',router);

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html');
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
