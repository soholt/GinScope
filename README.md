# ginscope - [Lepus Timidus]
There are quite a few options out there, but they are a bit meh or I have not found the the one I like or too pricey..
### Arduino based, Html5 Sci Toolbox, containing variuos instruments
##### Currently:
* Oscilloscope
* Function generator
* Real time plotting of analog & digital signals in HTML via Serial


Working prototype based on https://p5js.org/

##### Nice: / to have / to do / to come /:

* taxometer
* fft
* x/y plotting - i/v tracing
* logic decoding
* db recording
* voltmeter
* ampmeter
* more advanced functions

Todo: calc bandwidth, UI, etc, provided I will survive..
###### Easy adding extra hardware via i2c like like lux/rgb sensing
###### Also possible to increase i2c speed to 400 kHz [http://forum.arduino.cc/index.php?topic=16793.0]

(click to play the video, digital pins at the top, will make better video soon)

[![working prototype](https://img.youtube.com/vi/CpZHNusoXF8/0.jpg)](https://youtu.be/CpZHNusoXF8)

For this example, NXP PCF8591 adc converter was used, Arduino analog pins can be used too. As you can see from the sine wave, only 'half job done', todo: display full wave..
The advantage of using I2C, is easier to adapt sketches across Arduino world.

NXP PCF8591 docs: http://www.nxp.com/documents/data_sheet/PCF8591.pdf

A very nice write-up http://tronixstuff.com/2013/06/17/tutorial-arduino-and-pcf8591-adc-dac-ic/

**_Hint:_ ** make use of PCF8591 dac

**_Idea: _** It is possible on Arduino to display full analog signal.., by using an op-amp and 2 analog inputs.. Invert the phase by 180° and then capture the negative portion of the signal as if it was positive.., then flipping it back before displaying it ;)
This gives 12bit + 12bit = 24bit resolution on Arduino

##### Current requirenments:
node.js p5.serialserver - for real time Arduino communications if Arduino is used

soundcard - for signal generation, also as analog input

##### Running:
* Edit and upload the sketch to Arduino
* Install the software
* Run p5serial server
* Optionaly and run a web server

##### Operation:
Reading the values and printing them to serial, no buffering, all real time, then decoding it on the client and displaying it in real time

Encoding bits and sending them via serial as a characters... via ws (could do binary I suppose?) then decoding them on the client side(js) the first 4 characters are 8 bit analog values and the last one is d0-d7 pins of Arduino - Decoding character to DEC - gives analog values.., if digital, then DEC to BIN gives a byte string with on and off values for each pin.

Will work on your Arduino even if you do not have extra parts, just comment out the analog bit in Arduino sketch and in js change data.length == 1 or if no js editing, send  send say four zeros or something, making sure string contains 5 characters and the last one is digital...

###### Some resources and other projects/scopes, in no particular order:
https://sigrok.org/

http://playground.arduino.cc/Main/LogicAnalyzer

https://duckduckgo.com/?q=arduino+logic+analyzer&ia=software

http://elinux.org/Logic_Analyzers

http://www.practicalarduino.com/projects/scope-logic-analyzer

http://www.instructables.com/id/Girino-Fast-Arduino-Oscilloscope/?ALLSTEPS

Also investigate Raspberry Pi
