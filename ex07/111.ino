#include <WiFi.h>
#include <WebServer.h>

// WiFi配置
const char* ssid = "荣耀WIN RT";
const char* password = "837206AKD";

// LED和PWM配置
const int ledPin = 2;          // ESP32板载LED引脚
const int pwmFreq = 5000;      // PWM频率5000Hz
const int pwmResolution = 8;   // 8位分辨率（亮度0-255）

WebServer server(80);
int currentBrightness = 0;     // 当前LED亮度值

// 生成Web页面
String makePage() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web无极调光器</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 100px;
      background-color: #f0f0f0;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
    .slider {
      width: 100%;
      height: 25px;
      margin: 30px 0;
      outline: none;
    }
    .brightness-value {
      font-size: 24px;
      font-weight: bold;
      color: #2196F3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ESP32 Web无极调光器</h1>
    <p>拖动滑动条调节LED亮度</p>
    <p>当前亮度：<span class="brightness-value" id="brightnessValue">0</span>/255</p>
    <input type="range" min="0" max="255" value="0" class="slider" id="brightnessSlider">
  </div>

  <script>
    const slider = document.getElementById('brightnessSlider');
    const valueDisplay = document.getElementById('brightnessValue');

    // 监听滑动条变化
    slider.addEventListener('input', function() {
      const brightness = this.value;
      valueDisplay.textContent = brightness;
      
      // 发送亮度值到ESP32（不刷新页面）
      fetch(`/set?brightness=${brightness}`)
        .catch(err => console.log('发送失败:', err));
    });
  </script>
</body>
</html>
)rawliteral";
  return html;
}

// 处理根路径请求
void handleRoot() {
  server.send(200, "text/html; charset=UTF-8", makePage());
}

// 处理亮度设置请求
void handleSetBrightness() {
  // 从URL参数中获取亮度值
  if (server.hasArg("brightness")) {
    String brightnessStr = server.arg("brightness");
    currentBrightness = brightnessStr.toInt();
    
    // 限制亮度值在0-255范围内
    if (currentBrightness < 0) currentBrightness = 0;
    if (currentBrightness > 255) currentBrightness = 255;
    
    // 设置PWM占空比
    ledcWrite(ledPin, currentBrightness);
    
    Serial.print("设置亮度为: ");
    Serial.println(currentBrightness);
  }
  
  // 返回成功响应
  server.send(200, "text/plain", "OK");
}

void setup() {
  // 初始化串口
  Serial.begin(115200);
  delay(1000);
  
  // 初始化PWM通道
  ledcAttach(ledPin, pwmFreq, pwmResolution);
  ledcWrite(ledPin, currentBrightness);
  
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
  server.on("/set", handleSetBrightness);
  
  // 启动Web服务器
  server.begin();
  Serial.println("Web服务器已启动");
}

void loop() {
  // 处理客户端请求
  server.handleClient();
}