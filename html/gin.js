// Declare a "SerialPort" object
var Serial; // variable to hold an instance of the Serialport library
var portName = '/dev/ttyACM0'; // fill in your Serial port name here
var inData; // for incoming Serial data
var inByte;
var byteCount = 0;
var output = 0;
var options = {
  //baudrate: 9600
  baudrate: 115200
  //baudrate: 230400
  //baudrate: 250000
};

var delayMicroSec = 10000;//16383; // MAX
//var defaultDelay = 20;
var payload = 'waiting for data'; // payload

var dataPoints = 1024 - 1; // less 1 'cos of array

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


var fps = 50;
var w, h, ch, heightOffset; // window width, height, canvas height & height offset
var padLeft = 0;
var padRight = 10;

var fft;
var amp = 50; // var amp = 500;
var freq = 1000;
var sin = false;
var tri = false;
var sqr = false;
var saw = false;
var sinAmp = 500;
var triAmp = 500;
var sqrAmp = 500;
var sawAmp = 500;
var sinFreq = 1000;
var triFreq = 1000;
var sqrFreq = 1000;
var sawFreq = 1000;
var sinOn = false;
var triOn = false;
var sqrOn = false;
var sawOn = false;

var Noise = {
  white: new p5.Noise(),
  pink: new p5.Noise('pink'),
  brow: new p5.Noise('brown')
};

var debug = false;

function setup() {

  // Instantiate our SerialPort object
  Serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  //Serial.list();

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's Serial port
  //Serial.open("/dev/ttyUSB0");
  Serial.open(portName, options);

  // Here are the callbacks that you can register

  // When we connect to the underlying server
  Serial.on('connected', serverConnected);

  // When we get a list of Serial ports that are available
  //Serial.on('list', gotList);
  // OR
  //Serial.onList(gotList);

  // When we some data from the Serial port
  Serial.on('data', gotData);
  // OR
  //Serial.onData(gotData);

  // When or if we get an error
  Serial.on('error', gotError);
  // OR
  //Serial.onError(gotError);

  // When our Serial port is opened and ready for read/write
  Serial.on('open', gotOpen);
  // OR
  //Serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //Serial.on('rawdata', gotRawData);
  // OR
  //Serial.onRawData(gotRawData);

// --------------------------------------------------------------------------------------------------------------

  w = windowWidth - padRight;
  h = windowHeight;
  canvasHeight = 1200;
  createCanvas(w, canvasHeight);
  //var canvas = p.createCanvas(850, 650);
  frameRate(fps);

  delayMicroSec = 10000;
  setDelay();

  //create buffer multiple of 16?
  createBuffer();

  //pg = createGraphics(400, 250);

   sin = new p5.SinOsc(freq);
   tri = new p5.TriOsc(freq);
   sqr = new p5.SqrOsc(freq);
   saw = new p5.SawOsc(freq);
   //Noise.Brown = new p5.Noise(brown);
   //Noise.Pink  = new p5.Noise(pink);
   //Noise.White = new p5.Noise(white);

   x = 480;
   y = 575;
   freqBtn = createButton('Sin');
   freqBtn.position(x + 0, y);
   freqBtn.mousePressed(sinState);

   freqBtn = createButton('Tri');
   freqBtn.position(x + 50, y);
   freqBtn.mousePressed(triState);

   freqBtn = createButton('Sqr');
   freqBtn.position(x + 100, y);
   freqBtn.mousePressed(sqrState);

  freqBtn = createButton('Saw');
  freqBtn.position(x + 150, y);
  freqBtn.mousePressed(sawState);

  freqBtn = createButton('White');
  freqBtn.position(x + 210, y);
  freqBtn.mousePressed(sawState);

  freqBtn = createButton('Pink');
  freqBtn.position(x + 300, y);
  freqBtn.mousePressed(sawState);

  freqBtn = createButton('Brown');
  freqBtn.position(x + 390, y);
  freqBtn.mousePressed(sawState);

  x = 480;
  y += 50;
  freq_xxxx = createButton('xxxx').position(x, y);x += 50;
  freq_xxx = createButton('xxx').position(x, y);x += 40;
  freq_xx = createButton('xx').position(x, y);x += 32;
  freq_x = createButton('x').position(x, y);x += 26;
  freq_d = createButton('-').position(x, y);x += 22;
  freqDisplay = createInput(freq).position(x, y).size(50);x += 52;
  freq_i = createButton('+').position(x, y);x += 22;
  freq_y = createButton('x').position(x, y);x += 26;
  freq_yy = createButton('xx').position(x, y);x += 32;
  freq_yyy = createButton('xxx').position(x, y);x += 40;
  freq_yyyy = createButton('xxxx').position(x, y);x += 50;

  freq_xxxx.mousePressed(function(){if(freq > 10000){freq -= 10000;frequency(),freqDisplay.value(freq)}});
  freq_xxx.mousePressed(function(){if(freq > 1000){freq -= 1000;frequency(),freqDisplay.value(freq)}});
  freq_xx.mousePressed(function(){if(freq > 100){freq -= 100;frequency(),freqDisplay.value(freq)}});
  freq_x.mousePressed(function(){if(freq > 10){freq -= 10;frequency(),freqDisplay.value(freq)}});
  freq_d.mousePressed(function(){if(freq > 1){freq -= 1;frequency(),freqDisplay.value(freq)}});
  freq_i.mousePressed(function(){freq += 1;frequency(),freqDisplay.value(freq)});
  freq_y.mousePressed(function(){freq += 10;frequency(),freqDisplay.value(freq)});
  freq_yy.mousePressed(function(){freq += 100;frequency(),freqDisplay.value(freq)});
  freq_yyy.mousePressed(function(){freq += 1000;frequency(),freqDisplay.value(freq)});
  freq_yyyy.mousePressed(function(){freq += 10000;frequency(),freqDisplay.value(freq)});



  x = 480;
  y += 50;
  delay_xxx = createButton('xxx').position(x, y);x += 40;
  delay_xx = createButton('xx').position(x, y);x += 32;
  delay_x = createButton('x').position(x, y);x += 26;
  delay_d = createButton('-').position(x, y);x += 22;
  delayDisplay = createInput(delayMicroSec).position(x, y).size(50);x += 52;
  delay_i = createButton('+').position(x, y);x += 22;
  delay_y = createButton('x').position(x, y);x += 26;
  delay_yy = createButton('xx').position(x, y);x += 32;
  delay_yyy = createButton('xxx').position(x, y);x += 40;

  delay_xxx.mousePressed(function(){if(delayMicroSec > 1000){delayMicroSec -= 1000;setDelay();delayDisplay.value(delayMicroSec)}});
  delay_xx.mousePressed(function(){if(delayMicroSec > 100){delayMicroSec -= 100;setDelay();delayDisplay.value(delayMicroSec)}});
  delay_x.mousePressed(function(){if(delayMicroSec > 10){delayMicroSec -= 10;setDelay();delayDisplay.value(delayMicroSec)}});
  delay_d.mousePressed(function(){if(delayMicroSec > 1){delayMicroSec -= 1;setDelay();delayDisplay.value(delayMicroSec)}});
  delay_i.mousePressed(function(){delayMicroSec += 1;setDelay();delayDisplay.value(delayMicroSec)});
  delay_y.mousePressed(function(){delayMicroSec += 10;setDelay();delayDisplay.value(delayMicroSec)});
  delay_yy.mousePressed(function(){delayMicroSec += 100;setDelay();delayDisplay.value(delayMicroSec)});
  delay_yyy.mousePressed(function(){delayMicroSec += 1000;setDelay();delayDisplay.value(delayMicroSec)});



  x = 480;
  y += 50;
  //fps_xx = createButton('xx').position(x, y);x += 32;
  fps_x = createButton('x').position(x, y);x += 26;
  fps_d = createButton('-').position(x, y);x += 22;
  fpsDisplay = createInput(fps).position(x, y).size(50);x += 52;
  fps_i = createButton('+').position(x, y);x += 22;
  fps_y = createButton('x').position(x, y);x += 26;
  //fps_yy = createButton('xx').position(x, y);x += 32;

  //fps_xx.mousePressed(function(){fps -= 100;frameRate(fps)});
  fps_x.mousePressed(function(){if(fps > 10){fps -= 10;frameRate(fps);fpsDisplay.value(fps)}});
  fps_d.mousePressed(function(){if(fps > 2){fps -= 1;frameRate(fps);fpsDisplay.value(fps)}});
  fps_i.mousePressed(function(){fps += 1;frameRate(fps);fpsDisplay.value(fps)});
  fps_y.mousePressed(function(){fps += 10;frameRate(fps);fpsDisplay.value(fps)});
  //fps_yy.mousePressed(function(){fps += 100;frameRate(fps)});


  x = 480;
  y += 50;

  amp_x = createButton('x').position(x, y);x += 26;
  amp_d = createButton('-').position(x, y);x += 22;
  ampDisplay = createInput(amp).position(x, y).size(50);x += 52;
  amp_i = createButton('+').position(x, y);x += 22;
  amp_y = createButton('x').position(x, y);x += 26;

  amp_x.mousePressed(function(){if(amp > 10){amp -= 10;amplitude();ampDisplay.value(amp)}});
  amp_d.mousePressed(function(){if(amp > 0){amp -= 1;amplitude();ampDisplay.value(amp)}});
  amp_i.mousePressed(function(){if((amp + 1) < 100){amp += 1;amplitude();ampDisplay.value(amp)}});
  amp_y.mousePressed(function(){if((amp + 10) < 100){amp += 10;amplitude();ampDisplay.value(amp)}});



  //freq_y.mousePressed(freq *= 10);
  //freq_yy.mousePressed(freq *= 100);
  //freq_yyy.mousePressed(freq *= 1000);


   //mic = new p5.AudioIn();
   //mic.start();
   //fft = new p5.FFT();
   //fft.setInput(mic);
/*
  ampSlider = createSlider(0, 1000, amp);
  ampSlider.position(10, h - 40);
  ampSlider.style('width', w - 40 + 'px');

  ampBtn = createButton('Amplitude');
  ampBtn.position(10, 1640);
  ampBtn.mousePressed(amplitude);

  freqSlider = createSlider(0, 1000, freq);
  freqSlider.position(10, h - 20);
  freqSlider.style('width', w - 40 + 'px');

  freqBtn = createButton('Frequency');
  freqBtn.position(10, 1720);
  freqBtn.mousePressed(frequency);




  // Delay slider in mils
  delaySlider = createSlider(0, 16383, delayMicroSec);
  delaySlider.position(10, 10);
  delaySlider.style('width', w - 40 + 'px');

  delayBtn = createButton('Set Delay');
  delayBtn.position(10, 35);
  delayBtn.mousePressed(setDelay);
*/
}

// We are connected and ready to go
function serverConnected() {
  println("Connected to Server");

  //delay(1000);
  //delayMicroSec = 10000;
  //setDelay();

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

// Connected to our Serial device
function gotOpen() {
  println("Serial Port is Open");
  //delay(500);
  //Serial.write('m555');
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  println(theerror);
}

function serverConnected() {
  println("Serial Connected");
}

// There is data available to work with from the Serial port
function gotData() {

  var incoming = Serial.readLine().trim();  // read the incoming string and trim it

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
      // to see info msgs from arduino
      if(incoming.length > 5) {
        //text(incoming, 25, 15);
        console.info(incoming);
      } else {
        // TO SEE DROPPED PACKETS AND MSGS
        if(debug) console.error(incoming);
      }

    }

  //console.log('data.length', data.length);

}

// We got raw from the Serial port
function gotRawData(payload) {
  println("gotRawData: " + payload);

}


function setDelay() {
  //var _delay = ms.value();
  console.info('attempt to set delay', delayMicroSec);
  Serial.write('u' + delayMicroSec);
}

// Methods available
// Serial.read() returns a single byte of data (first in the buffer)
// Serial.readChar() returns a single char 'A', 'a'
// Serial.readBytes() returns all of the data available as an array of bytes
// Serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// Serial.readString() retunrs all of the data available as a string
// Serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// Serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// Serial.last() returns the last byte of data from the buffer
// Serial.lastChar() returns the last byte of data from the buffer as a char
// Serial.clear() clears the underlying Serial buffer
// Serial.available() returns the number of bytes available in the buffer
// Serial.write(somevar) writes out the value of somevar to the Serial device
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
  noStroke();
  fill(33);

  heightOffset = 15;
  text('x ' + mouseX, w - 30, heightOffset);



  heightOffset += 15;
  text('y ', mouseY, w - 30, heightOffset);

  //heightOffset += 15;


  //stroke('#fae');
  //strokeWeight(.5);
  stroke(200);
  line(0, mouseY, windowWidth, mouseY);
  line(mouseX, 0, mouseX, windowHeight);

  stroke(0,0,150);
  line(0, heightOffset, w, heightOffset);

  heightOffset += 256;

  //stroke(0,0,150);
  stroke(200);
    line(0, heightOffset - 128, w, heightOffset - 128);
    stroke(0,0,150);
    line(0, heightOffset, w, heightOffset);
    //stroke(200);//stroke(0,0,150);
    //line(0, heightOffset + 128, w, heightOffset + 128);
  //noStroke();
  stroke(0);

//  strokeWeight(1);
  noFill();
  beginShape();

  //for (var i = 0; i < waveform.length; i++){
  //  var x = map(i, 0, waveform.length, 0, width);
  //  var y = map(waveform[i], -1, 1, height, 0);

  //for (var i = 0; i < data.length; i++){
    //var x = map(i, 0, data.length, 0, width) - 20;
    for (var i = 0; i < _a0.length; i++){
      var x = map(i, 0, _a0.length, 0, width) - 20;
      var y = heightOffset - _a0[i];
      vertex(x, y);
    }
  endShape();
  fill(a0, 255 - a0, 0);
  ellipse(w - 20, heightOffset - a0, _size, _size);
  noFill();



  heightOffset += 260;

  //stroke(200);
  //line(0, heightOffset, w, heightOffset);

  //heightOffset = heightOffset + 260;


stroke(150,0,0);
  line(0, heightOffset - 256, w, heightOffset - 256);
  stroke(200);
  line(0, heightOffset - 128, w, heightOffset - 128);
  stroke(150,0,0);
  line(0, heightOffset, w, heightOffset);
  //stroke(200);
  //line(0, heightOffset + 128, w, heightOffset + 128);
stroke(0);//noStroke();

  beginShape();
    //strokeWeight(1);
    //if(debug) console.log(waveform);

    //for (var i = 0; i < waveform.length; i++){
    //  var x = map(i, 0, waveform.length, 0, width);
    //  var y = map(waveform[i], -1, 1, height, 0);

    //for (var i = 0; i < data.length; i++){
      //var x = map(i, 0, data.length, 0, width) - 20;
    for (var i = 0; i < _a1.length; i++){
    var x = map(i, 0, _a1.length, 0, width) - 20;
    var y = heightOffset - _a1[i];
    vertex(x, y);
  }
  endShape();
  fill(a1, 255 - a1, 0);
  ellipse(w - 20, heightOffset - a1, _size, _size);
  noFill();
  //console.log(Math.log(50 * (a0+1)));





/*
  heightOffset = heightOffset + 256;
  beginShape();
  for (var i = 0; i < _a2.length; i++){

    var x = map(i, 0, _a2.length, 0, width) - 20;
    var y = heightOffset - _a2[i];
//stroke(_a2[i], 255 - _a2[i], 0);
    vertex(x, y);
  }
  endShape();
//stroke(0, 0, 0);

  heightOffset = heightOffset + 256;
  beginShape(LINES);
  for (var i = 0; i < _a3.length; i++){
    fill(_a3[i], 255 - _a3[i], 0);
    var x = map(i, 0, _a3.length, 0, width) - 20;
    var y = heightOffset - _a3[i];
    //stroke(_a3[i], 255 - _a3[i], 0);
    vertex(x, y);
  }
  endShape();
//stroke(0, 0, 0);
*/

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

//  --  bars

  var _y = heightOffset - 119;//384;//100;
  fill(a0, 255 - a0, 0);
  rect(90,  _y + 255, 20, a0);
  //ellipse(w - 20, 512 - a0, _size, _size);

  fill(a1, 255 - a1, 0);
  rect(120, _y + 255, 20, a1);
  //ellipse(w - 20, 768 - a1, _size, _size);

  fill(a3, 255 - a3, 0);
  rect(150, _y + 255, 20, a2);

  fill(a3, 255 - a3, 0);
  rect(180, _y + 255, 20, a3);


  ellipse(100, _y + 255 - a0, _size, _size);
  ellipse(130, _y + 255 - a1, _size, _size);
  ellipse(160, _y + 255 - a2, _size, _size);
  ellipse(190, _y + 255 - a3, _size, _size);

  //fill(222,222,222);

  line(100, _y + 255, 100, _y + 255 - a0);
  line(130, _y + 255, 130, _y + 255 - a1);
  line(160, _y + 255, 160, _y + 255 - a2);
  line(190, _y + 255, 190, _y + 255 - a3);

  //fill(222,222,222);
  text(a0, 105, _y - 5);
  text(a1, 135, _y - 5);
  text(a2, 165, _y - 5);
  text(a3, 195, _y - 5);


  text(255, 2, _y - 5);
  text(255, 2, _y + 525);
  line(10, _y, 10, _y + 255);
  line(10, _y + 255, 300, _y + 255);
  line(10, _y + 255, 10, _y + 255 + 255);


  fill(0);
  noStroke();
  text('Function generator: ', 350, 590);
  text('Frequency Hz:', 350, 640);
  text('Delay μs:', 350, 690);
  text('Fps:', 350, 740);
  text(frameRate(), 640, 740);
  text('Amplitude:', 350, 790);


//  --- UI

  //amp = ampSlider.value();
  //freq = freqSlider.value();

  //var waveform = fft.waveform();  // analyze the waveform


  //delayMicroSec = delaySlider.value();
  //text(delayMicroSec, 90, 50);



stroke(33);
strokeWeight();


heightOffset += 230;
  // --- digital

  var _dOffset = heightOffset;
  var _dOffsetSize = 30;

  var _dSize = 8;

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, d0 * 255, d0 * 255);
  ellipse(w - 10, d0 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d0.length; i++){
      var x = map(i, 0, _d0.length, 0, width) - 20;
      var y = _dOffset - _d0[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  fill(0,0,0);
  text('0', 10, _dOffset);
  //ellipse(100, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(d0 * 255, d1 * 255, 0);
  ellipse(w - 10, d1 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d1.length; i++){
      var x = map(i, 0, _d1.length, 0, width) - 20;
      var y = _dOffset - _d1[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  fill(0,0,0);
  text('1', 10, _dOffset);
  //ellipse(120, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(d0 * 255, 0, d0 * 255);
  ellipse(w - 10, d2 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d2.length; i++){
      var x = map(i, 0, _d2.length, 0, width) - 20;
      var y = _dOffset - _d2[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('2', 10, _dOffset);
  //ellipse(140, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, d3 * 255, 0);
  ellipse(w - 10, d3 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d3.length; i++){
      var x = map(i, 0, _d3.length, 0, width) - 20;
      var y = _dOffset - _d3[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('3', 10, _dOffset);
  //ellipse(160, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(d4 * 255, 0, 0);
  ellipse(w - 10, d4 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d4.length; i++){
      var x = map(i, 0, _d4.length, 0, width) - 20;
      var y = _dOffset - _d4[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('4', 10, _dOffset);
  //ellipse(180, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, d5 * 255, 0);
  ellipse(w - 10, d5 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d5.length; i++){
      var x = map(i, 0, _d5.length, 0, width) - 20;
      var y = _dOffset - _d5[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('5', 10, _dOffset);
  //ellipse(200, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, 0, d6 * 255);
  ellipse(w - 10, d6 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d6.length; i++){
      var x = map(i, 0, _d6.length, 0, width) - 20;
      var y = _dOffset - _d6[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('6', 10, _dOffset);
  //ellipse(220, 700, _size, _size);

  _dOffset = _dOffset + _dOffsetSize;
  fill(0, d7 * 255, 0);
  ellipse(w - 10, d7 * _dSize + _dOffset, _size, _size);
  beginShape();
    for (var i = 0; i < _d7.length; i++){
      var x = map(i, 0, _d7.length, 0, width) - 20;
      var y = _dOffset - _d7[i] * _dSize + _dSize;
      vertex(x, y);
    }
  endShape();
  text('7', 10, _dOffset);


  //ellipse(240, 700, _size, _size);


  //createP('fps: ' + frameRate())
}


function createBuffer() {
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
  var _amp = amp / 100; // var _amp = amp / 1000;
  console.log('new amplitude: ', _amp);
      sin.amp(_amp);
      tri.amp(_amp);
      sqr.amp(_amp);
      saw.amp(_amp);

  //    break;
  //}
}

function frequency() {
  console.log('new frequency: ', freq);
//  switch(type) {
  //  case 'sin':
      sin.freq(freq);
      tri.freq(freq);
      sqr.freq(freq);
      saw.freq(freq);
  //    break;
  //}
}

function windowResized() {
  //w = windowWidth;
  //h = windowHeight;
  resizeCanvas(w, ch);
  console.log('new window size: ' + w + ' x '+ h);
}
