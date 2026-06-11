// 定义LED引脚，ESP32通常板载LED连接在GPIO 2
const int ledPin = 2;

// 用于记录LED当前状态
bool ledState = LOW;
// 记录上次LED状态改变的时间点
unsigned long previousMillis = 0;
// 闪烁间隔（1000ms = 1秒，实现1Hz闪烁）
const long interval = 1000;

void setup() {
  // 初始化串口通信，设置波特率为115200
  Serial.begin(115200);
  // 将LED引脚设置为输出模式
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // 获取当前系统运行的毫秒数
  unsigned long currentMillis = millis();

  // 判断是否达到状态改变的时间间隔
  if (currentMillis - previousMillis >= interval) {
    // 更新上次状态改变的时间点
    previousMillis = currentMillis;
    // 翻转LED状态（亮→灭/灭→亮）
    ledState = !ledState;
    // 输出状态到串口监视器
    if (ledState == HIGH) {
      Serial.println("LED ON (millis版)");
    } else {
      Serial.println("LED OFF (millis版)");
    }
    // 设置LED引脚状态
    digitalWrite(ledPin, ledState);
  }
}