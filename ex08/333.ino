#include <WiFi.h>
#include <WebServer.h>

// WiFi配置
const char* ssid = "荣耀WIN RT";
const char* password = "837206AKD";

// 硬件引脚定义
const int ledPin = 2;          // 报警LED引脚
const int touchPin = 4;        // 触摸检测引脚T0

// 系统状态定义
enum SystemState {
  DISARMED,   // 未布防
  ARMED,      // 已布防
  ALARMING    // 报警中
};

SystemState currentState = DISARMED; // 初始状态为未布防

// LED闪烁参数（非阻塞）
unsigned long previousMillis = 0;
const long alarmInterval = 100;     // 报警闪烁间隔100ms（高频）
bool ledState = LOW;

// 触摸检测参数
int touchThreshold = 200;            // 触摸阈值（根据串口输出调整）
unsigned long lastTouchTime = 0;
const unsigned long debounceDelay = 500; // 触摸防抖

WebServer server(80);

// 生成Web控制页面
String makePage() {
  String stateText;
  String stateColor;
  
  // 根据系统状态显示不同的文字和颜色
  switch (currentState) {
    case DISARMED:
      stateText = "未布防";
      stateColor = "#4CAF50"; // 绿色
      break;
    case ARMED:
      stateText = "已布防";
      stateColor = "#FF9800"; // 橙色
      break;
    case ALARMING:
      stateText = "⚠️ 报警中！";
      stateColor = "#F44336"; // 红色
      break;
  }

  String html = R"rawliteral(
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>物联网安防报警器</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 80px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 400px;
      margin: 0 auto;
      padding: 30px;
      background-color: white;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
      margin-bottom: 30px;
    }
    .status {
      font-size: 28px;
      font-weight: bold;
      margin: 30px 0;
      padding: 15px;
      border-radius: 10px;
      color: white;
    }
    .btn {
      width: 100%;
      padding: 15px;
      margin: 10px 0;
      font-size: 18px;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: white;
    }
    .arm-btn {
      background-color: #FF9800;
    }
    .disarm-btn {
      background-color: #F44336;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>安防报警器</h1>
    <div class="status" style="background-color: )rawliteral" + stateColor + R"rawliteral(;">)rawliteral" + stateText + R"rawliteral(</div>
    <a href="/arm"><button class="btn arm-btn">布防</button></a>
    <a href="/disarm"><button class="btn disarm-btn">撤防</button></a>
  </div>
</body>
</html>
)rawliteral";
  return html;
}

// 处理根路径请求
void handleRoot() {
  server.send(200, "text/html; charset=UTF-8", makePage());
}

// 处理布防请求
void handleArm() {
  currentState = ARMED;
  Serial.println("系统已布防");
  server.sendHeader("Location", "/");
  server.send(303);
}

// 处理撤防请求
void handleDisarm() {
  currentState = DISARMED;
  digitalWrite(ledPin, LOW); // 熄灭LED
  ledState = LOW;
  Serial.println("系统已撤防");
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  // 初始化串口
  Serial.begin(115200);
  delay(1000);
  
  // 初始化LED引脚
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  
  // 连接WiFi
  Serial.println("正在连接WiFi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi连接成功！");
  Serial.print("请在浏览器中访问: http://");
  Serial.println(WiFi.localIP());
  
  // 注册路由
  server.on("/", handleRoot);
  server.on("/arm", handleArm);
  server.on("/disarm", handleDisarm);
  
  // 启动Web服务器
  server.begin();
  Serial.println("安防报警器已启动，初始状态：未布防");
}

void loop() {
  // 处理Web客户端请求
  server.handleClient();

  // 读取触摸值
  int touchValue = touchRead(touchPin);

  // 状态机逻辑
  switch (currentState) {
    case DISARMED:
      // 未布防状态：触摸无反应
      break;
      
    case ARMED:
      // 已布防状态：检测触摸触发报警
      if (touchValue < touchThreshold && (millis() - lastTouchTime) > debounceDelay) {
        lastTouchTime = millis();
        currentState = ALARMING;
        Serial.println("检测到入侵！触发报警！");
      }
      break;
      
    case ALARMING:
      // 报警状态：LED高频闪烁（非阻塞）
      unsigned long currentMillis = millis();
      if (currentMillis - previousMillis >= alarmInterval) {
        previousMillis = currentMillis;
        ledState = !ledState;
        digitalWrite(ledPin, ledState);
      }
      break;
  }
}