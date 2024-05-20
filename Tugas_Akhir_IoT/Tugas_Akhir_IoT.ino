#include <WiFi.h>
#include "DHT.h"
#include <HTTPClient.h>
#include <Arduino.h>
#include "ThingSpeak.h"
#include <ArduinoJson.h>

const char* ssid = "abc";
const char* password = "12345678";

WiFiClient client;

unsigned long timer, sensor_last_timer, heart_sensor_last_timer, mq_last_timer, thingspeak_timer, thingspeak_read_timer, serial_timer;
unsigned long myChannelNumber = 1;
const char* myWriteAPIKey = "TQKTUT6Y75MEU1EB";
const char* ReadAPIKey = "6SJOD11R1OZEAFBN";

#define DHTPIN 4
#define DHTTYPE DHT11  
DHT dht(DHTPIN, DHTTYPE);
float temperature, humidity;

#define SensorUdaraPin 34

#include "MAX30105.h"

#include "heartRate.h"

MAX30105 particleSensor;

const byte RATE_SIZE = 4; 
byte rates[RATE_SIZE]; 
byte rateSpot = 0;
long lastBeat = 0; 

float beatsPerMinute;
int beatAvg;

double data[4]; //Suhu, Kelembapan, Detak Jantung, Kualitas Udara
double dataAvg[4];
unsigned long data_counter[4];



#define SensorUdaraPin 34 // Analog pin where MQ135 is connected

// Calibration parameters
float R0 = 10.0;  // Replace this with the value you get from calibration

// Constants for MQ135 calculations
const float RL = 10.0;  // Load resistance in kilo ohms
const float VOC_CLEAN_AIR_FACTOR = 9.83;  // RS/R0 ratio in clean air for MQ135

/*
  Aktuator
*/
float kondisi_infus, kondisi_lampu;

// Function prototypes
float readMQ135Resistance();
float calculatePPM(float resistance);


void ReadDhtSensor();
void ReadHeartSensor();
void BacaSensorUdara();
void SendToThingspeak();
void ReadThingspeak();

enum SendTime
{
    ThingspeakDelay = 5000
};

void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  dht.begin();

  ThingSpeak.begin(client);

  timer = sensor_last_timer = heart_sensor_last_timer = thingspeak_read_timer = mq_last_timer = millis();


  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) 
  {
    Serial.println("MAX30102 was not found. Please check wiring/power. ");
    while (1);
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");

  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0); 

  pinMode(2, OUTPUT);
}

void loop() {
  timer = millis();

    if(WiFi.status() != WL_CONNECTED){
    Serial.print("Attempting to connect to SSID: ");

    while(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, password);  // Connect to WPA/WPA2 network. Change this line if using open or WEP network
      Serial.print(".");
      delay(5000);     
    } 
    Serial.println("\nConnected.");
  }

  ReadDhtSensor();
  ReadHeartSensor();
  BacaSensorUdara();

  SendToThingspeak();
  ReadThingspeak();

  digitalWrite(2, kondisi_lampu);

  if(timer > serial_timer + 100)
  {
    for(auto i : data)
    {
      Serial.print(" ");
      Serial.print(i);
    }
    Serial.println();
    serial_timer = timer;
  }


  // Serial.println();

  // Serial.print(temperature);
  // Serial.print(" ");
  // Serial.print(data[0]);
  // Serial.print(" ");
  // Serial.println(data_counter[0]);


}

void ReadThingspeak()
{
  if(timer < thingspeak_read_timer + 4000) return;

  if (WiFi.status() == WL_CONNECTED) { // Check Wi-Fi connection status
    HTTPClient http;

    String url = "https://api.thingspeak.com/channels/2554290/feeds.json?api_key=V8U7BNRO1GL8JTUB&results=1";
    http.begin(url); // Specify the URL

    http.setTimeout(500); 

    int httpResponseCode = http.GET(); // Send the request
    

    if (httpResponseCode > 0) { // Check the returning code
      String payload = http.getString(); // Get the request response payload
      // Serial.println(httpResponseCode);
      // Serial.println(payload); // Print the response

      // Parse JSON
      StaticJsonDocument<1024> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        JsonArray feeds = doc["feeds"];
        if (feeds.size() > 0) {
          JsonObject feed = feeds[0];
          String infus = feed["field1"].as<String>();
          String lamp = feed["field2"].as<String>();

          kondisi_infus = infus.toFloat();
          kondisi_lampu = lamp.toFloat();

          Serial.println("Read Successfull");

          Serial.print("Kondisi Infus: ");
          Serial.println(kondisi_infus);
          Serial.print("Lampu: ");
          Serial.println(kondisi_lampu);
        }
      } else {
        // Serial.print("deserializeJson() failed: ");
        // Serial.println(error.f_str());
      }
    } else {
      // Serial.print("Error on HTTP request: ");
      // Serial.println(httpResponseCode);
    }

    http.end(); // Free the resources
  } else {
    // Serial.println("Disconnected from Wi-Fi");
  }
  thingspeak_read_timer = timer;
}

void SendToThingspeak()
{
  if(timer < thingspeak_timer + 15000) return;





  Serial.print("Send data to thingspeak : ");

  for (int i = 0; i < 4; i++) {
    if(i == 2)
    {
      dataAvg[i] = beatAvg;
    }
    if (data_counter[i] > 0) {
      dataAvg[i] = data[i] / data_counter[i];
    } else {
      dataAvg[i] = 0; // If no data, set average to 0
    }
  }

  for(int i = 0; i < 4; i++)
  {
    Serial.print(dataAvg[i]);
    Serial.print(" ");
  }

  Serial.println("");

  ThingSpeak.setField(1, (int) dataAvg[0]);
  ThingSpeak.setField(2, (int) dataAvg[1]);
  ThingSpeak.setField(3, (int) dataAvg[2]);
  ThingSpeak.setField(4, (int) dataAvg[3]);



  int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

  if(x == 200){
    Serial.println(" Channel update successful.");
  }
  else{
    Serial.println(" Problem updating channel. HTTP error code " + String(x));
  }

  memset(data, 0, sizeof(data));
  memset(data_counter, 0, sizeof(data));

  thingspeak_timer = timer;
}

void BacaSensorUdara()
{
  if(timer < mq_last_timer + 100) return;

  float sensorResistance = readMQ135Resistance();
  float ppm = calculatePPM(sensorResistance);

  data[3] += ppm;
  data_counter[3]++;

  mq_last_timer = timer;

}

void ReadHeartSensor()
{
  // if(timer < heart_sensor_last_timer + 100) return;

  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute;
      rateSpot %= RATE_SIZE; 

      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;

      
    }
  }
  data[2] += beatAvg;
  data_counter[2]++;

  heart_sensor_last_timer = timer;

  // Serial.print("IR=");
  // Serial.print(irValue);
  // Serial.print(", BPM=");
  // Serial.print(beatsPerMinute);
  // Serial.print(", Avg BPM=");
  // Serial.print(beatAvg);


  // Serial.println();
}

float readMQ135Resistance() {
  int analogValue = analogRead(SensorUdaraPin);
  float sensorVoltage = analogValue / 4095.0 * 3.3;  // ESP32 ADC is 12-bit, 3.3V reference
  float sensorResistance = (3.3 - sensorVoltage) * RL / sensorVoltage;  // RS calculation

  return sensorResistance;
}

float calculatePPM(float resistance) {
  float ratio = resistance / R0;
  // Using the characteristic curve equation of MQ135 to estimate PPM
  // The characteristic curve is usually provided in the datasheet or MQ135 documentation.
  // Here we use a typical equation: PPM = 116.6020682 * (ratio ^ -2.769034857)

  float ppm = 116.6020682 * pow(ratio, -2.769034857);
  return ppm;
}

void ReadDhtSensor()
{
  if(timer < sensor_last_timer + 100) return;

  temperature = dht.readTemperature();
  humidity = dht.readHumidity();


  
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Semsor tidak terbaca!");
    return;
  }
  else
  {
      data[0] += temperature;
      data[1] += humidity;

      data_counter[0]++;
      data_counter[1]++;
  }
  
  sensor_last_timer = timer;
}