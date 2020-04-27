'use strict';

const { PDFNet } = require('@pdftron/pdfnet-node'); 

const OutputFolder = '../Output/';
const fs = require('fs');

async function runOptimizer(filename){
      const input_path = '../upload/';
      const output_path = "../Output/";
      const input_filename = filename;
      console.log(input_filename +'Start compress!!')
      await PDFNet.initialize()

      //--------------------------------------------------------------------------------
      // Simple optimization of a pdf with default settings. 

      try {
        const doc = await PDFNet.PDFDoc.createFromFilePath(input_path + input_filename + ".pdf");
        await doc.initSecurityHandler();
        await PDFNet.Optimizer.optimize(doc);
        doc.save(output_path + input_filename + "_opt1.pdf", PDFNet.SDFDoc.SaveOptions.e_linearized);
        fs.unlinkSync(input_path + input_filename + ".pdf");
      }
      catch (err) {
        console.log(err);
      }
}

exports.runOptimizer = runOptimizer
// PDFNet.runWithCleanup(runOptimizer, 0).then(function(){PDFNet.shutdown();});







exports.delete = (req, res, next) => {
    var fileName = "../upload/" + req.query.file_name;
    var fileName1 = "../Output/" + req.query.file_name;
    fs.unlinkSync(fileName);
    fs.unlinkSync(fileName1);
	res.redirect('../frontend/public/index.html');
} 


