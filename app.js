var createError = require('http-errors');
const localtunnel = require('localtunnel');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
const fs = require('fs');
// const fingerprint = require('fingerprintjs2');

const adb = require('adbkit');

const client = adb.createClient({
  host: '127.0.0.1',
  port: 5037
});
const deviceId = "YTK4C19402007236";

client.shell(deviceId, 'getprop | grep fingerprint')
  .then(adb.util.readAll)
  .then(output => {
    console.log(output.toString().trim());
  }).then(() => {

    client.pull(deviceId, 'fingerprint.dat')
    .then(transfer => {
      adb.util.readAll(transfer)
        .then(data => {
          fs.writeFileSync('fingerprint.dat', data);
        });
    });
  });
// const {read} = require('./public/javascripts/reader');
// const nfc = require('nfc-pcsc');
// console.log('nfc:', nfc.TAG_ISO_14443_3)

// const nfcReader = new nfc.NFC();

// nfcReader.on('reader', reader => {
//   console.log(`${reader.reader.name}  connected`);

//   reader.on('card', card => {
//     console.log(`card detected`, card);

//     const ndefMessage = [
//       nfc.ndef.textRecord('Hello, World!'),
//       nfc.ndef.uriRecord('https://www.example.com')
//     ];

//     reader.writeNDEF(ndefMessage, error => {
//       if (error) {
//         console.error(error);
//       } else {
//         console.log('Wrote NDEF message to card');
//       }
//     });
//   });

//   reader.on('error', error => {
//     console.error(error);
//   });

//   reader.on('end', () => {
//     console.log('reader disconnected');
//   });
// });

// nfcReader.on('error', error => {
//   console.error(error);
// });




var indexRouter = require('./routes/index');
var readerRouter = require('./routes/reader');

var app = express();

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/reader', readerRouter);
app.use('/reader/attend', readerRouter);
app.use('/reader/emr', readerRouter);
app.use('/reader/wallet', readerRouter);
app.use('/api', readerRouter);
app.use('/reader/pay', readerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};


const port = 8082;
const server = http.createServer(options, app);
server.listen(port, function () {
  console.log('server listening on: http://localhost:' + port)
})


module.exports = {app};
