// index.js start of file
var express = require('express');
var multer = require('multer'),
        bodyParser = require('body-parser'),
        path = require('path');
var app = new express();
var ExifImage = require('exif').ExifImage;

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// index.js continued
app.get('/', function(req, res){
  res.render('index');
});

// index.js continued
app.post('/', multer({ dest: './uploads/'}).single('upl'), function(req,res){
        console.log(req.body); //form fields
        /* example output:
        { title: 'abc' }
         */
        console.log(req.file); //form files
        /* example output:
            { fieldname: 'upl',
              originalname: 'grumpy.png',
              encoding: '7bit',
              mimetype: 'image/png',
              destination: './uploads/',
              filename: '436ec561793aa4dc475a88e84776b1b9',
              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
              size: 277056 }
         */

        //Do some exif processing
        try {
          new ExifImage({ image : req.file.path }, function (error, exifData) {
            if (error)
              {
                console.log('Error: '+error.message);
                res.status(503).end();
              }
            else
              {
                console.log(exifData); // Do something with your data!
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(exifData));
              }
          });
        } catch (error) {
          console.log('Error: ' + error.message);
          res.status(503).end();
        }

});

// index.js end of file
var port = 3000;
app.listen( port, function(){ console.log('listening on port '+port); } );
