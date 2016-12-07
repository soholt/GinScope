//#include <Stream.h>;
#include "Wire.h"
#define PCF8591 (0x90 >> 1) // I2C bus address
char a, a0, a1, a2, a3;

/* https://www.arduino.cc/en/Reference/PortManipulation
// B (digital pin 8 to 13)
// C (analog input pins)
// D (digital pins 0 to 7)

PORTD maps to Arduino digital pins 0 to 7

DDRD - The Port D Data Direction Register - read/write
PORTD - The Port D Data Register - read/write
PIND - The Port D Input Pins Register - read only
--
PORTB maps to Arduino digital pins 8 to 13 The two high bits (6 & 7) map to the crystal pins and are not usable

DDRB - The Port B Data Direction Register - read/write
PORTB - The Port B Data Register - read/write
PINB - The Port B Input Pins Register - read only
--
PORTC maps to Arduino analog pins 0 to 5. Pins 6 & 7 are only accessible on the Arduino Mini

DDRC - The Port C Data Direction Register - read/write
PORTC - The Port C Data Register - read/write
PINC - The Port C Input Pins Register - read only
*/

// Create a variable to store the data read from PORT
//char b = 0;
//char c = 0;
//byte d = 0;
char digital;

// delay(ms)
int ms = 20; // 20 = 1000 / 50 fps

// delayMicroseconds(16383)
// Pauses the program for the amount of time (in microseconds) specified as parameter.
// There are a thousand microseconds in a millisecond, and a million microseconds in a second.
// Currently, the largest value that will produce an accurate delay is 16383.
// This could change in future Arduino releases. For delays longer than a few thousand microseconds, you should use delay() instead.
int us = 10000; // max 16383;

char payload[5] = "";

void setup() {

  Wire.begin();

  // Since we’re transferring at 9600 bps, the time spent holding each of those bits high or low is 1/(9600 bps) or 104 µs per bit.
  // For every byte of data transmitted, there are actually 10 bits being sent: a start bit, 8 data bits, and a stop bit.
  // So, at 9600 bps, we’re actually sending 9600 bits per second or 960 (9600/10) bytes per second. https://learn.sparkfun.com/tutorials/serial-communication/all

  //Serial.begin(9600); // 960 bytes per sec
  //Serial.println("--==Started Serial==-- @9600");

  //Serial.begin(57600); // 5760 bytes per sec
  //Serial.println("--==Started Serial==-- @57600");

  Serial.begin(115200);// 11520 bytes
  Serial.println("--==Started Serial==-- @115200");

  // MAYBE REDUCE DEFAULT SERIAL TIMEOUT?

  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // Arduino (Atmega) pins default to inputs, so they don't need to be explicitly declared as inputs
  //DDRB = 0b00000000;    //All pins in PORTB are input // "The two high bits (6 & 7) map to the crystal pins and are not usable"
  //DDRC = 0b00000000;    //All pins in PORTC are input
  //DDRD = 0b00000000;    //All pins in PORTD are input // "0 & 1 - serial - poss are not usable?"


  //Serial.println("format: PORTD bit in 'dec',a0,a1,a2,a3,this message is 6th in ");
  Serial.println("Connected via USB");
  Serial.println("PORTD,PCF8591 TO SERIAL");

  //Serial.print("ms ");
//  Serial.print(ms);
  Serial.print("delay us: ");
  Serial.println(us);

  Serial.println("Begin");
}

void loop() {

  if (Serial.available() > 0) {
    // read the incoming byte:
    char mode = Serial.read();
    int _delay = Serial.parseInt();

    switch (mode) {
      case 'm':
        ms = _delay;
        delay(_delay);
        break;
      case 'u':
        us = _delay;
        delayMicroseconds(_delay);
        Serial.println("Setting delay:" + _delay);
        break;
    }
  }

  digital = PIND;

  Wire.beginTransmission(PCF8591); // wake up PCF8591
  Wire.write(0x04); // control byte - read ADC0 then auto-increment
  Wire.endTransmission(); // end tranmission
  Wire.requestFrom(PCF8591, 5);
  a = Wire.read();
  a0 = Wire.read();
  a1 = Wire.read();
  a2 = Wire.read();
  a3 = Wire.read();

  Serial.print(a0);
  Serial.print(a1);
  Serial.print(a2);
  Serial.print(a3);
  Serial.println(digital);

  //delay(ms);
  delayMicroseconds(us);

}
