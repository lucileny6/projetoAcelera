// Joginder
// hobbyprojects
// Propeller_LED_Pendulum_Clock_01052021 Refatorado

#include <avr/pgmspace.h>

char ch;
int sensorPin = 2;
unsigned int i, n, c, nc, k, d, y, bn, mp, m = 0;
float dl;
unsigned long timecurr, timeold, previousTime = 0;
int hours = 12;
int minutes = 15;
int seconds = 0;
uint16_t timer_count_A = 0;
byte number, t, a, temp, data = 0;
int val;

const PROGMEM unsigned char data1[] = {
  0x3e,0x22,0x22,0x3e,0x00,0x12,0x3e,0x02,0x2e,0x2a,0x2a,0x3a,0x2a,0x2a,0x2a,0x3e,
  0x38,0x08,0x08,0x3e,0x3a,0x2a,0x2a,0x2e,0x3e,0x2a,0x2a,0x2e,0x20,0x26,0x28,0x30,
  0x3e,0x2a,0x2a,0x3e,0x3a,0x2a,0x2a,0x3e,0x64,0x63,0x62,0x61,0x60,0x5F,0x5E,0x5D,
  0x5C,0x5B,0x5A,0x59,0x58,0x57,0x56,0x55,0x54,0x53,0x52,0x51,0X51,0x52,0x53,0x54,
  0x55,0x56,0x57,0x58,0x59,0x5A,0x5B,0x5C,0x5D,0x5E,0x5F,0x60,0x61,0x62,0x63,0x64,
  0x10,0x38,0x10,0x10,0x38,0x38,0x7c,0x7F,0x7f,0x7F,0x7c,0x38,0x38,0x10,0x10,0x38,
  0x10,0x04,0x0e,0x1f,0x0e,0x04,0x3e,0x08,0x08,0x3e,0x00,0x00,0x1c,0x22,0x22,0x1c,
  0x00,0x00,0x3e,0x2a,0x2a,0x14,0x00,0x00,0x3e,0x2a,0x2a,0x14,0x00,0x20,0x10,0x0e,
  0x10,0x20,0x00,0x00,0x3e,0x28,0x28,0x10,0x00,0x00,0x3e,0x28,0x2c,0x12,0x00,0x00,
  0x1c,0x22,0x22,0x1c,0x00,0x00,0x0c,0x02,0x02,0x3c,0x00,0x00,0x3e,0x2a,0x2a,0x22,
  0x00,0x00,0x1c,0x22,0x22,0x22,0x00,0x00,0x20,0x20,0x3e,0x20,0x20,0x00,0x00,0x12,
  0x2a,0x2a,0x24
};

void setup() {
  DDRD = 0xFA;
  DDRB = 0xFF;
  DDRC = 0x3F;
  PORTD = 0x05;
  PORTB = 0x00;
  PORTC = 0x00;

  if(hours > 11)
    hours = hours - 12;

  m = 0;

  UBRR0 = 832;   // baud rate 1200bps
  UCSR0C |= (1 << UCSZ01) | (1 << UCSZ00);
  UCSR0B |= (1 << RXEN0) | (1 << TXEN0) | (1 << RXCIE0);

  attachInterrupt(0, us_time, RISING);
  pinMode(sensorPin, INPUT);
}

void loop() {
  val = digitalRead(sensorPin);
  while (val == LOW) {
    update_time();
    val = digitalRead(sensorPin);
  }

  a = 0;
  k = 82;
  n = 0;
  nc = 0;
  number = 9;
  c = 44;

  while (n < 120) {
    if (m == 0) {
      mp = 15;
      bn = 0;

      while (bn < 5) {
        img();
      }

      number = hours;
      if (number == 0) number = 12;
      number = number / 10;
      c = 24;
      Display();

      number = hours;
      if (number == 0) number = 12;
      number = number % 10;
      c = 29;
      Display();

      c = 34;
      data = 0x0A;
      Display_();

      number = minutes;
      number = number / 10;
      c = 36;
      Display();

      number = minutes;
      number = minutes % 10;
      c = 41;
      Display();

      c = 46;
      data = 0x0A;
      Display_();

      number = seconds;
      number = number / 10;
      c = 48;
      Display();

      number = seconds;
      number = seconds % 10;
      c = 53;
      Display();

      mp = 61;
      bn = 0;
      while (bn < 5) {
        img();
      }
    }

    if (a == 0)
      drawMinuteMarker();

    if ((k==0) || (k==10) || (k==20) || (k==30) || (k==40) || (k==50) || (k==60) || (k==70) || (k==80) || (k==90) || (k==100) || (k==110)) {
      drawHourMarker();
    }

    if ((k==0) || (k==30) || (k==60) || (k==90)) {
      drawQuarterMarker();
    }

    if (k == (hours*10) + (minutes/6)) {
      drawHoursHand();
    }

    if (k == (hours*10 - 2) + (minutes/6)) {
      if (m == 0)
        digitalWrite(5, HIGH);
      else
        digitalWrite(9, HIGH);
    }

    if (k == (hours*10 + 2) + (minutes/6)) {
      if (m == 0)
        digitalWrite(5, HIGH);
      else
        digitalWrite(9, HIGH);
    }

    if (k == (hours*10) + (minutes/6)) {
      if (m == 0)
        digitalWrite(5, HIGH);
      else
        digitalWrite(9, HIGH);
    }

    if ((k == 118) && (hours == 0) && (minutes < 12)) {
      if (m == 0)
        digitalWrite(5, HIGH);
      else
        digitalWrite(9, HIGH);
    }

    if ((k == 1) && (hours == 11) && (minutes > 47)) {
      if (m == 0)
        digitalWrite(5, HIGH);
      else
        digitalWrite(9, HIGH);
    }

    if (k == minutes*2) {
      drawMinutesHand();
    }

    if (m == 0) {
      if (k == minutes*2 + 2)
        digitalWrite(7, HIGH);
      if (k == minutes*2 - 2)
        digitalWrite(7, HIGH);
      if ((k == 0) && (minutes == 59))
        digitalWrite(7, HIGH);
      if ((k == 118) && (minutes == 0))
        digitalWrite(7, HIGH);
    } else {
      if (k == minutes*2 + 2)
        digitalWrite(11, HIGH);
      if (k == minutes*2 - 2)
        digitalWrite(11, HIGH);
      if ((k == 0) && (minutes == 59))
        digitalWrite(11, HIGH);
      if ((k == 118) && (minutes == 0))
        digitalWrite(11, HIGH);
    }

    if (k == seconds*2) {
      drawSecondsHand();
    }

    if (m == 0) {
      if (k == seconds*2 + 2)
        digitalWrite(9, HIGH);
      if (k == seconds*2 - 2)
        digitalWrite(9, HIGH);
      if ((k == 0) && (seconds == 59))
        digitalWrite(9, HIGH);
      if ((k == 118) && (seconds == 0))
        digitalWrite(9, HIGH);
    } else {
      if (k == seconds*2 + 2)
        digitalWrite(13, HIGH);
      if (k == seconds*2 - 2)
        digitalWrite(13, HIGH);
      if ((k == 0) && (seconds == 59))
        digitalWrite(13, HIGH);
      if ((k == 118) && (seconds == 0))
        digitalWrite(13, HIGH);
    }

    if (m == 0) {
      c = (pgm_read_byte(&(data1+40)[t]));

      bn = 0;

      while (bn < 17) {
        if (n == c) {
          temp = pgm_read_byte(&(data1+80)[bn]);

          PORTC = temp >> 1;

          if (temp & 1)
            digitalWrite(13, HIGH);
          else
            digitalWrite(13, LOW);
        }
        bn++;
        c++;
      }
    }

    delayMicroseconds(dl);
    Clear();

    if ((k == 80) || (k == 81)) {
      // no delay
    } else
      delayMicroseconds(dl*3);

    a++;
    if (a == 2)
      a = 0;

    n++;
    k++;
    if (k == 120)
      k = 0;
  }

  val = digitalRead(sensorPin);

  while (val == HIGH) {
    update_time();
    val = digitalRead(sensorPin);
  }
}

void Display() {
  if (n == c+0) {
    temp = (pgm_read_byte(&(data1+number*4)[0]));
    PORTC = temp >> 1;
  }
  if (n == c+1) {
    temp = (pgm_read_byte(&(data1+number*4)[1]));
    PORTC = temp >> 1;
  }
  if (n == c+2) {
    temp = (pgm_read_byte(&(data1+number*4)[2]));
    PORTC = temp >> 1;
  }
  if (n == c+3) {
    temp = (pgm_read_byte(&(data1+number*4)[3]));
    PORTC = temp >> 1;
  }

  c += 5;
}

void Display_() {
  if (n == c)
    PORTC = data;
}

void img() {
  if (n == mp)
    PORTC = pgm_read_byte(&(data1+97)[bn]);
  bn++;
  mp++;
}

void Clear() {
  for (int i = 3; i <= 20; i++) {
    digitalWrite(i, LOW);
  }
}

void drawMinuteMarker() {
  if (m == 0) {
    digitalWrite(12, HIGH);
  } else {
    digitalWrite(A5, HIGH);
  }
}

void drawHourMarker() {
  if (m == 0) {
    digitalWrite(11, HIGH);
  } else {
    digitalWrite(A4, HIGH);
    digitalWrite(A3, HIGH);
  }
}

void drawQuarterMarker() {
  if (m == 0) {
    digitalWrite(10, HIGH);
  } else {
    digitalWrite(A2, HIGH);
    digitalWrite(A1, HIGH);
  }
}

void drawHoursHand() {
  if (m == 0) {
    for (int i = 3; i <= 6; i++) {
      digitalWrite(i, HIGH);
    }
  } else {
    for (int i = 3; i <= 10; i++) {
      digitalWrite(i, HIGH);
    }
  }
}

void drawMinutesHand() {
  if (m == 0) {
    for (int i = 3; i <= 8; i++) {
      digitalWrite(i, HIGH);
    }
  } else {
    for (int i = 3; i <= 12; i++) {
      digitalWrite(i, HIGH);
    }
  }
}

void drawSecondsHand() {
  if (m == 0) {
    for (int i = 3; i <= 10; i++) {
      digitalWrite(i, HIGH);
    }
  } else {
    for (int i = 3; i <= 14; i++) {
      digitalWrite(i, HIGH);
    }
  }
}

void update_time() {
  if (millis() >= (previousTime)) {
    previousTime = previousTime + 25;
    t++;
    if (t == 40) {
      t = 0;
      seconds++;
    }

    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }

    if (minutes == 60) {
      minutes = 0;
      hours++;
    }

    if (hours > 11)
      hours = hours - 12;
  }
}

void us_time() {
  n = 0;
  timecurr = micros() - timeold;
  timeold = micros();
  if (m == 0)
    dl = timecurr / 1000;
  else
    dl = timecurr / 650;
}

ISR(USART_RX_vect) {
  ch = UDR0;
  if (ch == '1') {
    hours--;
    if (hours < 0)
      hours = 11;
    ch = '0';
  }
  if (ch == '2') {
    hours++;
    if (hours == 12)
      hours = 0;
    ch = '0';
  }
  if (ch == '3') {
    minutes--;
    if (minutes < 0)
      minutes = 59;
    ch = '0';
  }
  if (ch == '4') {
    minutes++;
    if (minutes == 60)
      minutes = 0;
    ch = '0';
  }
  if (ch == '5') {
    seconds = 0;
    ch = '0';
  }
  if (ch == '6') {
    m++;
    if (m == 2)
      m = 0;
    ch = '0';
  }
}