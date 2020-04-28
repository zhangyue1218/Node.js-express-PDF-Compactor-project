'use strict';

const { PDFNet } = require('@pdftron/pdfnet-node'); 

const fs = require('fs');
const express = require("express");
var path = require("path")

//Compress function
async function runOptimizer(filename, quality, DPI){
  const input_path = '../upload/';
  const output_path = "../Output/";
  const input_filename = filename;
  console.log(input_filename +'Start compress!!')
  console.log("quality", quality)
  console.log("DPI", DPI)
  await PDFNet.initialize()
  let Quality = parseInt(quality);
  let D= parseInt(DPI);
  if(Quality <= 0){
    Quality = 1;
  }
  if(Quality>10){
    Quality = 10;
  }
  if(D <= 0){
    D = 50;
  }
  //--------------------------------------------------------------------------------
  // Simple optimization of a pdf with default settings. 
  try {
    const doc = await PDFNet.PDFDoc.createFromFilePath(input_path + input_filename + ".pdf");
    await doc.initSecurityHandler();
    const image_settings = new PDFNet.Optimizer.ImageSettings();

    // low quality jpeg compression
    image_settings.setCompressionMode(PDFNet.Optimizer.ImageSettings.CompressionMode.e_jpeg);
    //from 1 to 10 where 10 is lossless (if possible)

    image_settings.setQuality(Quality);

    // Set the output dpi to be standard screen resolution
    image_settings.setImageDPI(500, D);

    image_settings.forceRecompression(true);
    // this option will recompress images not compressed with
    // jpeg compression and use the result if the new image
    // is smaller.
    // image_settings.forceRecompression(true);
    
    const opt_settings = new PDFNet.Optimizer.OptimizerSettings();

    opt_settings.setColorImageSettings(image_settings);
    opt_settings.setGrayscaleImageSettings(image_settings);

    // use the same settings for both color and grayscale images
    await PDFNet.Optimizer.optimize(doc, opt_settings);
    
    doc.save(output_path + input_filename + "_Q"+ quality +"_D"+ DPI +".pdf", PDFNet.SDFDoc.SaveOptions.e_linearized);
    fs.unlinkSync(input_path + input_filename + ".pdf");
    console.log(input_filename + "compressed!")
  }
  catch (err) {
    console.log(err);
  }
}
// PDFNet.runWithCleanup(runOptimizer, 0).then(function(){PDFNet.shutdown();});

exports.Compress = runOptimizer;

// upload function
exports.upload = (req, res)=>{
  console.log("body:"+ JSON.stringify(req.body))
  console.log("body qulity:"+ req.body.Quality)
  if(req.files){
     console.log(req.files)
     var file = req.files.logo
     var filename = file.name
     console.log("1111111"+typeof(filename))
     file.mv('../upload/' + filename, function(err){
         if(err){
             res.send(err)
         }else{
             if(file.mimetype === 'application/pdf'){    
                 runOptimizer(filename.substring(0,filename.indexOf(".")),req.body.Quality, req.body.DPI);
                 res.send('<script>alert("File is uploaded, filesize: ' + getFileSize(file.size)+'. It is compressing now!"); setTimeout(function(){location.href="http://localhost:3100"},2000) </script>')                 
             }else{
              fs.unlinkSync('../upload/' + filename);   
              res.send('<script>alert("The type of file is not valid, please send a PDF file!!"); setTimeout(function(){location.href="http://localhost:3100"},500) </script>')
             }
         }
     })
  }else{
      res.send('<script>alert("No file uploaded, please choose a file !"); setTimeout(function(){location.href="http://localhost:3100"},500) </script>')
  }
}

function getFileSize(size){
  if(size < 1024*1024){
      return (size/1024).toFixed(2)+'KB'
  }else if(size >= 1024*1024&&size<Math.pow(1024, 3)){
      return (size/1024.0/1024).toFixed(2)+'MB'
  }else{
      return (size/1024.0/1024/1024).toFixed(2)+'GB'
  }
}

//deletefunction
exports.delete = (req, res, next) => {
  var filePath = req.body.filePath;
  console.log('delete file：'+filePath)
  try {
      fs.unlinkSync(filePath)
      // 重定向到列表页
      res.send('success')
  } catch (error) {
      res.send('failed!!')
  }
} 

exports.download = (req, res) => {
  var filePath = req.query.path;
    // var filePath = filePath.substring(3)
    console.log('download file: '+filePath)
    filePath = path.join(__dirname, '../'+filePath);
    console.log('download file: '+filePath)
    res.attachment(filePath)
    res.sendFile(filePath)
}

exports.filelist = (req, res) => {
    var filelist = getFileList('../Output')
    res.send(filelist)
}

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