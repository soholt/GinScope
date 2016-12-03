# GinScope
###Arduino based Html Instruments - Oscilloscope+ more
###The idea is to make HTML toolbox with variuos instruments, possibly app

There are quite a few options out there, but they are a bit meh or I have not found the the one I like or too pricey

#####Working prototype based on https://p5js.org/
(click to play the video, digital pins at the top, will make better video soon)

[![working prototype](https://img.youtube.com/vi/CpZHNusoXF8/0.jpg)](https://youtu.be/CpZHNusoXF8)

Signal generation, fft, x/y plotting - i/v tracing(todo), adc/dac - maybe should split into a few smaller projects.

For adc using NXP PCF8591 A very nice write-up http://tronixstuff.com/2013/06/17/tutorial-arduino-and-pcf8591-adc-dac-ic/

Hint: make use us dac

#####Current requirenments:
node.js p5.serialserver - for real time arduino communications if arduino is used

soundcard - for signal generation, also as analog input

#####Nice to have to do: 

Taxometer, voltmeter, ampmeter, logic decoding,
more advanced functions,
calc bandwidth
######Easy adding extra hardware via i2c like like lux/rgb sensing
######Also possible to increase i2c speed to 400 kHz http://forum.arduino.cc/index.php?topic=16793.0

#####Operation:
Encoding bits and sending them via serial as a characters... via ws (could do binary I suppose?) then decoding them on the client side(js) the first 4 characters are 8 bit analog values and the last one is d0-d7 pins of arduino - decoding character to DEC then to BIN gives a byte string with on and off values.

Will work on your arduino even if you do not have extra parts, just comment out the analog bit in arduino sketch and in js change data.length == 1 or if no js editing, send  send say four zeros or something, making sure string contains 5 characters and the last one is digital...

######Todo the todo list of resources and other projects/scopes, in no particular order:
https://sigrok.org/

http://playground.arduino.cc/Main/LogicAnalyzer

https://duckduckgo.com/?q=arduino+logic+analyzer&ia=software

http://elinux.org/Logic_Analyzers

http://www.practicalarduino.com/projects/scope-logic-analyzer

http://www.instructables.com/id/Girino-Fast-Arduino-Oscilloscope/?ALLSTEPS
