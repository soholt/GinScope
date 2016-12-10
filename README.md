# ginscope - [Lepus Timidus]
## Html5 Sci Toolbox, containing variuos instruments*
There are quite a few options out there, speaking various/proprietary protocols etc.
We are long past the point of being able to watch videos, we can run things inside web browsers too :D

Nowadays anyone can make Soundcard oscilloscope - just get some probes (or make your own) and bingo! - although it will never replace pro equipment, but if you are getting more advanced and in need of extra tools or IO and spare Arduino is at hand with some spare parts - you can do even more great stuff!

#deepTech - is the new black, let's liberate some tools :D

There are many Arduino based scopes, some with software for Windows some for macOS some for Linux but sort of never 'a complete package'. Also many electronics enthusiasts are being created around the world every day, sadly not all can afford Arduino/parts, let alone oscilloscopes..

Long story short: I need one and I needed one long ago, but I still can not afford it [...]

...As the saying goes..., make it!

The aim is to make the best with the least parts possible, hopefully  progressing to more advanced acquisition systems.

External components required. eg: to analyse analog signal with Arduino one would need dual power supply or other clever tricks.* ²

```
Can this be 'match made in heaven' ? 'Data Acquisition' : system

Arduino --> Serial --> Bluetooth/USB --> \ | /--> VGA/DESKTOP/TABLET
Arduino --> SPI -----> Raspberry Pi -->    |   -> HDD
   FPGA --> SPI -----> Raspberry Pi ---> / | \--> HTTPS/WSS
```

##### Currently:
* Arduino/Soundcard Oscilloscope
* Soundcard Function generator
* Real time plotting of analog & digital signals in HTML from Serial data

##### Nice: / to have / to do / to come /:
* schematics (pcb, kit, scope, tools)
* taxometer
* fft
* x/y plotting - i/v tracing
* logic decoding
* db recording
* more advanced functions
* calc bandwidth, freq, count, etc
* UI, Serial port and Soundcard dropdown selections(IO control)
* tablet/phone app via tcp, - serial streaming via bluetooth easy
* voltmeter
* ampmeter etc
###### Easy adding extra hardware via i2c like like lux/rgb sensing*
###### Also possible to increase i2c speed to 400 kHz [http://forum.arduino.cc/index.php?topic=16793.0]

(click to play the video)

[![working prototype](https://img.youtube.com/vi/jmDLRDejVgY/0.jpg)](https://youtu.be/jmDLRDejVgY)

Working prototype based on https://p5js.org/

For this example, NXP PCF8591 adc converter was used. Arduino analog pins can be used too. As you can see from the sine wave, only 'half job done' - or nearly all
The advantage of using I2C, is easier to adapt sketches across Arduino world.

NXP PCF8591 spec: http://www.nxp.com/documents/data_sheet/PCF8591.pdf

A very nice write-up http://tronixstuff.com/2013/06/17/tutorial-arduino-and-pcf8591-adc-dac-ic/

**_Hint:_ ** make use of PCF8591 dac

**_Idea:_** I trust it is possible on Arduino to sample full analog signal @24bit resolution.., by using an op-amp and 2 analog inputs to obtain one anlalog channel².. Invert the phase by 180° and then capture the negative portion of the signal as if it was positive.., then flip it back before using it ;)
This would give 12bit + 12bit = 24bit resolution, (also possible 8x2=16bit, which makes working with it easier/faster) by merging/alternating aquired buffers* (have not come accros this method on making scopes tutorials :D)


##### Current requirenments depending on needs:
* Moderm web browser
* Soundcard - for function generator, also as analog input, if available
* node.js p5.serialserver - for Serial real time Arduino communications if Arduino is used
* http-server for https, extra/advanced/future functionality

##### Running:
* install the required software
* connect PCF8591 and upload the sketch to Arduino or
* (comment out PCF8591 and edit the first 4 Serial.print(0) lines by replacing a0-a3 with 0)
* edit the serial port in gin.js (dropdown selection planned for later)
* run p5serial and open scope.html or start http-server if needed

##### Operation:
Reading the values and printing them to serial, no buffering, all real time, then decoding it on the client and displaying it in real time

Encoding bits and sending them via serial as a characters... then serving it via ws/wss to web browser/aqusition systems(could do binary I suppose?), then decoding them on the client side(in js). The first 4 characters are 8 bit analog values from PCF8591 and the last one is d0-d7 pins of Arduino - Decoding single ASCII character to it's DEC representation - gives analog values.. 0-255, if digital, then DEC to BIN gives a string with on and off values for each of the d0-d7 pins.

```javascript
// Might not be the best/fastest solution,
// but for now it works and looks good :D
// We are expecting 5 byte string containing encoded values for:
// analog a0, a1, a2, a3 and digital d0-d7
// terminated by \r\n, which could be further reduced to \n

var data = 'gins!';

// Decoding routine:
// (wonder if anyone use this technique? is there a name for it?
//  I thought of it to reduce the payload size =
//  faster and more samples transfered)

// "extracting" data from string
var a0 = data[0]; // a0 = g
var a1 = data[1]; // a1 = i
var a2 = data[2]; // a2 = n
var a3 = data[3]; // a3 = s
var digital = data[4]; // !

// then ASCII -> DEC
a0 = a0.charCodeAt(); // g = 103  - Analog 1 value
a1 = a1.charCodeAt(); // i = 105  - Analog 2 value
a2 = a2.charCodeAt(); // n = 110  - Analog 3 value
a3 = a3.charCodeAt(); // s = 115  - Analog 4 value
digital = digital.charCodeAt(); // ! = 33 - all 8 digital pins

// then DEC -> BIN
digital = digital.toString(2); // = '00100001'

// state of digital pins
d0 = digital[0]; // - Digital pin 0 (Serial Rx) - unusable
d1 = digital[1]; // - Digital pin 1 (Serial Tx) - unusable
d2 = digital[2]; // - Digital pin 2
d3 = digital[3]; // - Digital pin 3
d4 = digital[4]; // - Digital pin 4
d5 = digital[5]; // - Digital pin 5
d6 = digital[6]; // - Digital pin 6
d7 = digital[7]; // - Digital pin 7

```

###### Just some of the resources and other projects/scopes, in no particular order:
https://sigrok.org/

http://playground.arduino.cc/Main/LogicAnalyzer

https://duckduckgo.com/?q=arduino+logic+analyzer&ia=software

http://elinux.org/Logic_Analyzers

http://www.practicalarduino.com/projects/scope-logic-analyzer

http://www.instructables.com/id/Girino-Fast-Arduino-Oscilloscope/?ALLSTEPS

http://www.instructables.com/id/DIY-Oscilloscopes/

Probe http://www.instructables.com/id/DIY-Oscilloscopes/

(...the list to be expanded)
Looking forward to open source hardware revolution https://www.sifive.com/
Wishing for reference equipment and more, -

Gin
