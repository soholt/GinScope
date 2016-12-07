// Declare a "SerialPort" object
var serial; // variable to hold an instance of the serialport library
var portName = '/dev/ttyACM0'; // fill in your serial port name here
var inData; // for incoming serial data
var inByte;
var byteCount = 0;
var output = 0;
var options = {
  //baudrate: 9600
  baudrate: 115200
};

var delayMicroSec = 10000;//16383; // MAX
//var defaultDelay = 20;
var payload = 'waiting for data'; // payload

var dataPoints = 1024 - 1;

var data = [];

var a0 = 0;
var a1 = 0;
var a2 = 0;
var a3 = 0;

var _a0 = [];
var _a1 = [];
var _a2 = [];
var _a3 = [];

var digital = '00000000';
var d0,d1,d2,d3,d4,d5,d6,d7;
var _d0 = [];
var _d1 = [];
var _d2 = [];
var _d3 = [];
var _d4 = [];
var _d5 = [];
var _d6 = [];
var _d7 = [];


var fps = 0;
var w, h;

var fft;
var amp = 500;
var freq = 1000;
var sin = false;
var tri = false;
var sqr = false;
var saw = false;
var sinOn = false;
var triOn = false;
var sqrOn = false;
var sawOn = false;


debug = false;

function setup() {

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  //serial.list();

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  //serial.open("/dev/ttyUSB0");
  serial.open(portName, options);

  // Here are the callbacks that you can register

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  //serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);

// --------------------------------------------------------------------------------------------------------------

  w = windowWidth;
  h = windowHeight;

  createCanvas(w, 1200);
  //var canvas = p.createCanvas(850, 650);
  //frameRate(fps);

//create buffer
for (i = 0; i < dataPoints; i++) {
  data.push(0);
  _a0.push(0);
  _a1.push(0);
  _a2.push(0);
  _a3.push(0);
  _d0.push(0);
  _d1.push(0);
  _d2.push(0);
  _d3.push(0);
  _d4.push(0);
  _d5.push(0);
  _d6.push(0);
  _d7.push(0);
}


/*
  a0 = new Dot(256, 256);
  a1 = new Dot(256*2, 256*2);
  a2 = new Dot(256*3, 256*3);
  a3 = new Dot(256*4, 256*4);
*/

  //pg = createGraphics(400, 250);

   sin = new p5.SinOsc(freq);
   tri = new p5.TriOsc(freq);
   sqr = new p5.SqrOsc(freq);
   saw = new p5.SawOsc(freq);


   //mic = new p5.AudioIn();
   //mic.start();
   //fft = new p5.FFT();
   //fft.setInput(mic);


  freqBtn = createButton('Sin');
  freqBtn.position(200, 780);
  freqBtn.mousePressed(sinState);

  freqBtn = createButton('Tri');
  freqBtn.position(265, 780);
  freqBtn.mousePressed(triState);

  freqBtn = createButton('Sqr');
  freqBtn.position(315, 780);
  freqBtn.mousePressed(sqrState);

  freqBtn = createButton('Saw');
  freqBtn.position(365, 780);
  freqBtn.mousePressed(sawState);



  ampSlider = createSlider(0, 1000, amp);
  ampSlider.position(10, 800);
  ampSlider.style('width', w - 40 + 'px');

  ampBtn = createButton('Amplitude');
  ampBtn.position(200, 840);
  ampBtn.mousePressed(amplitude);



  freqSlider = createSlider(1, 1111, freq);
  freqSlider.position(10, 900);
  freqSlider.style('width', w - 40 + 'px');

  freqBtn = createButton('Frequency');
  freqBtn.position(200, 940);
  freqBtn.mousePressed(frequency);



    // Delay slider in mils
  delaySlider = createSlider(0, 16383, delayMicroSec);
  delaySlider.position(10, 1000);
  delaySlider.style('width', w - 40 + 'px');

  delayBtn = createButton('Set Delay');
  delayBtn.position(200, 1040);
  delayBtn.mousePressed(setDelay);

}

// We are connected and ready to go
function serverConnected() {
  println("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  println("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    println(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  println("Serial Port is Open");
  //delay(500);
  //serial.write('m555');
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  println(theerror);
}

function serverConnected() {
  println("Serial Connected");
}

// There is data available to work with from the serial port
function gotData() {

  var incoming = serial.readLine().trim();  // read the incoming string and trim it

  //trim(incoming);
             // remove any trailing whitespace
  //gotRawData(incoming);
  //console.log('incoming',incoming);

  if (!incoming) return;             // if the string is empty, do no more

    //__data = incoming.trim();


    if(incoming.length === 5) {

      //console.log(incoming.length, incoming);
      //a0 = data[0];
      //a1 = data[1];
      //a2 = data[2];
      //a3 = data[3];
      //console.log('data',_a);

      //payload = incoming;

      //data = payload;
        //if(data.length === 5) { // Draw

          //console.log('data', data);

          a0 = incoming[0];
          a1 = incoming[1];
          a2 = incoming[2];
          a3 = incoming[3];

          a0 = a0.charCodeAt() || 0;
          a1 = a1.charCodeAt() || 0;
          a2 = a2.charCodeAt() || 0;
          a3 = a3.charCodeAt() || 0;

          digital = incoming[4];
          digital = digital.charCodeAt() || '0';
          digital = Number(digital);
          digital = digital.toString(2);
          //console.log(digital);

          d0 = Number(digital[0]) || 0;
          d1 = Number(digital[1]) || 0;
          d2 = Number(digital[2]) || 0;
          d3 = Number(digital[3]) || 0;
          d4 = Number(digital[4]) || 0;
          d5 = Number(digital[5]) || 0;
          d6 = Number(digital[6]) || 0;
          d7 = Number(digital[7]) || 0;


          //data.push({a0:a0,a1:a1,a2:a2,a3:a3});
          data.push();
          _a0.push(a0);
          _a1.push(a1);
          _a2.push(a2);
          _a3.push(a3);
          _d1.push(d1);
          _d2.push(d2);
          _d3.push(d3);
          _d4.push(d4);
          _d5.push(d5);
          _d6.push(d6);
          _d7.push(d7);


          //console.log('_a0.length', _a0.length)
          //var i = data.length;
          var i = _a0.length;
          if(dataPoints < i) {
            data.shift();
            _a0.shift();
            _a1.shift();
            _a2.shift();
            _a3.shift();
            _d1.shift();
            _d2.shift();
            _d3.shift();
            _d4.shift();
            _d5.shift();
            _d6.shift();
            _d7.shift();
          }

          if (debug) console.log(data);

          //console.log(data.length);




    } else {
      if(incoming.length > 5) {
        //text(incoming, 25, 15);
        console.info(incoming);
      } else {
        if(debug) console.error(incoming);
      }

    }

  //console.log('data.length', data.length);



  // console.log('payload',payload);

  //gotRawData(payload);

  //console.log(payload);
  //if(currentString[0] === ',') {
  //  console.log(currentString);
  //  return;
  //}
              // println the string
  //if (currentString.length() === 5) {

    //console.log('data', p);
    //console.log('dataLength', p.length);
  //}

  //console.log('dd',p[0].charCodeAt(2));
  //console.log('a0',String.fromCharCode(p[1]));
  //console.log('a1',String.fromCharCode(p[2]));
  //console.log('a2',String.fromCharCode(p[3]));
  //console.log('a3',String.fromCharCode(p[4]));
/*
  data = currentString.split(",");
  //println("data" + data);

  //d = Number(data.shift());
  //data.pop();
  //data[0]); //delete(data[0]);
  //dd = d.toString(2);

  // PADDING
  //dd = "" + 1;
  //var pad = "0000000";
  //dd = pad.substring(0, pad.length - dd.length) + dd;

  //console.log('d',d);
  //console.log('dd',dd);

  //console.log('data',data);

  //a = data;         // save it for the draw method
  a0 = data[1]; //a[0];
  a1 = data[2]; //a[1];
  a2 = data[3]; //a[2];
  a3 = data[4]; //a[3];

  //console.log('a0',a0);
  //console.log('a1',a1);
  //console.log('a2',a2);
  //console.log('a3',a3);
  */
}

// We got raw from the serial port
function gotRawData(payload) {
  println("gotRawData: " + payload);

}


function setDelay() {
  //var _delay = ms.value();
  console.info('attempt to set delay', delayMicroSec);
  serial.write('u' + delayMicroSec);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device
/*
function draw() {
  noStroke();
  background(220, 180, 200);
  fill(180, 200, 40);
  strokeWeight(1);
  stroke(180, 100, 240);
  for (var i = 0; i < width; i += 2) {
    line(i, 300 - a0, i, 300);
    line(i, a1, i, 0);
  }
}//dataPoints; data.length
*/
var _size = 10;

function draw() {
  background(255);
  //background(39,43,48); // #272b30
  fill(0);


  amp = ampSlider.value();
  freq = freqSlider.value();
  delayMicroSec = delaySlider.value();

  text('Function generator: ', 35, 795);
  text('Amplitude: ' + amp, 35, 855);
  text('Frequency: ' + freq + ' Hz', 35, 955);
  text('Delay: ' + delayMicroSec + ' μs', 35, 1055);
  //text('The end', 35, 1100);

  noFill();
  //var waveform = fft.waveform();  // analyze the waveform

  beginShape();//  strokeWeight(1);

  //for (var i = 0; i < waveform.length; i++){
  //  var x = map(i, 0, waveform.length, 0, width);
  //  var y = map(waveform[i], -1, 1, height, 0);

  //for (var i = 0; i < data.length; i++){
    //var x = map(i, 0, data.length, 0, width) - 20;
    for (var i = 0; i < _a0.length; i++){
      var x = map(i, 0, _a0.length, 0, width) - 20;
      //var y = map(_a0[i], -1, 1, 256, 0);
      ///var y = a0;
      var y = 512 - _a0[i];
      vertex(x, y);
    }
  endShape();


    beginShape();
    strokeWeight(1);
    //if(debug) console.log(waveform);

    //for (var i = 0; i < waveform.length; i++){
    //  var x = map(i, 0, waveform.length, 0, width);
    //  var y = map(waveform[i], -1, 1, height, 0);

    //for (var i = 0; i < data.length; i++){
      //var x = map(i, 0, data.length, 0, width) - 20;
    for (var i = 0; i < _a0.length; i++){
    var x = map(i, 0, _a1.length, 0, width) - 20;
    var y = 768 - _a1[i];
    vertex(x, y);
  }
  endShape();
  //console.log(Math.log(50 * (a0+1)));


//console.log(data[0][0])
  // change oscillator frequency based on mouseX
  //var freq = map(mouseX, 0, width, 40, 880);
  //osc.freq(freq);

  //var amp = map(mouseY, 0, height, 1, .01);
  //osc.amp(amp);
/*
  var spectrum = fft.analyze();
//console.log('spectrum',spectrum)
  beginShape();
  //for (i = 0; i<spectrum.length; i++) {
  // vertex(i, map(spectrum[i], 0, 255, height, 0) );
  for (i = 0; i<data.length; i++) {
   vertex(i, map(data[i], 0, 255, height, 0) );

  }
  endShape();
*/




//  a0 = Number(a0);// + 1;
//  a1 = Number(a1);// + 1;
//  a2 = Number(a2);// + 1;
//  a3 = Number(a3);// + 1;
var _y = 384;
  fill(a0, 255 - a0, 0);
  rect(90,  _y + 255, 20, a0);
ellipse(w - 20, 512 - a0, _size, _size);

  fill(a1, 255 - a1, 0);
  rect(120, _y + 255, 20, a1);
ellipse(w - 20, 768 - a1, _size, _size);

  fill(a3, 255 - a3, 0);
  rect(150, _y + 255, 20, a2);

  fill(a3, 255 - a3, 0);
  rect(180, _y + 255, 20, a3);


  ellipse(100, _y + 255 - a0, _size, _size);
  ellipse(130, _y + 255 - a1, _size, _size);
  ellipse(160, _y + 255 - a2, _size, _size);
  ellipse(190, _y + 255 - a3, _size, _size);

  fill(222,222,222);


  line(100, _y + 255, 100, _y + 255 - a0);
  line(130, _y + 255, 130, _y + 255 - a1);
  line(160, _y + 255, 160, _y + 255 - a2);
  line(190, _y + 255, 190, _y + 255 - a3);



  fill(222,222,222);
  text(a0, 105, _y);
  text(a1, 135, _y);
  text(a2, 165, _y);
  text(a3, 195, _y);


  text(255, 2, 290);
  line(10, _y, 10, _y + 255);
  line(10, _y + 255, 500, _y + 255);
  line(10, _y + 255, 10, _y + 255 + 255);


var _dOffset = 0;
var _dOffsetSize = 30;

var _dSize = 8;


_dOffset = _dOffset + _dOffsetSize;
  fill(0, d0 * 255, d0 * 255);
  ellipse(w - 20, d0 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d0.length; i++){
      var x = map(i, 0, _d0.length, 0, width - 20);
      var y = _dOffset - _d0[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  fill(0,0,0);
  text('0', 10, _dOffset);
  //ellipse(100, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(d0 * 255, d1 * 255, 0);
  ellipse(w - 20, d1 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d1.length; i++){
      var x = map(i, 0, _d1.length, 0, width - 20);
      var y = _dOffset - _d1[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  fill(0,0,0);
  text('1', 10, _dOffset);
  //ellipse(120, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(d0 * 255, 0, d0 * 255);
  ellipse(w - 20, d2 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d2.length; i++){
      var x = map(i, 0, _d2.length, 0, width - 20);
      var y = _dOffset - _d2[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('2', 10, _dOffset);
  //ellipse(140, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, d3 * 255, 0);
  ellipse(w - 20, d3 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d3.length; i++){
      var x = map(i, 0, _d3.length, 0, width - 20);
      var y = _dOffset - _d3[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('3', 10, _dOffset);
  //ellipse(160, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(d4 * 255, 0, 0);
  ellipse(w - 20, d4 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d4.length; i++){
      var x = map(i, 0, _d4.length, 0, width - 20);
      var y = _dOffset - _d4[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('4', 10, _dOffset);
  //ellipse(180, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, d5 * 255, 0);
  ellipse(w - 20, d5 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d5.length; i++){
      var x = map(i, 0, _d5.length, 0, width - 20);
      var y = _dOffset - _d5[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('5', 10, _dOffset);
  //ellipse(200, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, 0, d6 * 255);
  ellipse(w - 20, d6 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d6.length; i++){
      var x = map(i, 0, _d6.length, 0, width - 20);
      var y = _dOffset - _d6[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('6', 10, _dOffset);
  //ellipse(220, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, d7 * 255, 0);
  ellipse(w - 20, d7 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d7.length; i++){
      var x = map(i, 0, _d7.length, 0, width - 20);
      var y = _dOffset - _d7[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('7', 10, _dOffset);
  //ellipse(240, 700, _size, _size);


}

function sinState() {
  sinOn = !sinOn;
  if(sinOn) {
    sin.start();
  } else {
    sin.stop();
  }
}
function triState() {
  triOn = !triOn;
  if(triOn) {
    tri.start();
  } else {
    tri.stop();
  }
}
function sqrState() {
  sqrOn = !sqrOn;
  if(sqrOn) {
    sqr.start();
  } else {
    sqr.stop();
  }
}
function sawState() {
  sawOn = !sawOn;
  if(sawOn) {
    saw.start();
  } else {
    saw.stop();
  }
}

function amplitude() {
  //switch(type) {
  //  case 'sin':
  var _amp = amp / 1000;
  console.log('amplitude',_amp)
      sin.amp(_amp);
      tri.amp(_amp);
      sqr.amp(_amp);
      saw.amp(_amp);

  //    break;
  //}
}

function frequency() {
  console.log('frequency',freq)
//  switch(type) {
  //  case 'sin':
      sin.freq(freq);
      tri.freq(freq);
      sqr.freq(freq);
      saw.freq(freq);
  //    break;
  //}
}
