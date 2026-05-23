#include <WiFi.h>
#include <WebServer.h>

// WiFi配置
const char* ssid = "荣耀WIN RT";
const char* password = "837206AKD";

// 硬件引脚定义
const int touchPin = 4;        // 触摸检测引脚T0

WebServer server(80);

// 生成Web仪表盘页面
String makePage() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>实时触摸传感器仪表盘</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      text-align: center;
      margin-top: 60px;
      background-color: #f8f9fa;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      padding: 40px;
      background-color: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 40px;
    }
    .gauge {
      width: 250px;
      height: 250px;
      margin: 0 auto 30px;
      border-radius: 50%;
      background: conic-gradient(#3498db 0%, #2ecc71 50%, #e74c3c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .gauge-inner {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .value {
      font-size: 64px;
      font-weight: bold;
      color: #2c3e50;
    }
    .label {
      font-size: 18px;
      color: #7f8c8d;
      margin-top: 10px;
    }
    .status {
      font-size: 20px;
      font-weight: bold;
      margin-top: 20px;
      padding: 10px;
      border-radius: 10px;
    }
    .normal {
      background-color: #d4edda;
      color: #155724;
    }
    .touched {
      background-color: #f8d7da;
      color: #721c24;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ESP32 触摸传感器仪表盘</h1>
    <div class="gauge">
      <div class="gauge-inner">
        <div class="value" id="touchValue">--</div>
        <div class="label">触摸值</div>
      </div>
    </div>
    <div class="status normal" id="status">状态：未触摸</div>
  </div>

  <script>
    // 每秒更新一次触摸值
    function updateTouchValue() {
      fetch('/api/touch')
        .then(response => response.text())
        .then(value => {
          // 更新数值显示
          document.getElementById('touchValue').textContent = value;
          
          // 更新状态显示
          const statusElement = document.getElementById('status');
          if (value < 200) {
            statusElement.textContent = '状态：检测到触摸';
            statusElement.className = 'status touched';
          } else {
            statusElement.textContent = '状态：未触摸';
            statusElement.className = 'status normal';
          }
        })
        .catch(err => console.log('获取数据失败:', err));
    }

    // 页面加载时立即更新一次
    updateTouchValue();
    
    // 每隔1000ms（1秒）自动更新
    setInterval(updateTouchValue, 1000);
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

// 处理API请求，返回触摸传感器数值
void handleApiTouch() {
  int touchValue = touchRead(touchPin);
  server.send(200, "text/plain", String(touchValue));
}

void setup() {
  // 初始化串口
  Serial.begin(115200);
  delay(1000);
  
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
  server.on("/api/touch", handleApiTouch); // 新增API接口
  
  // 启动Web服务器
  server.begin();
  Serial.println("Web服务器已启动");
}

void loop() {
  // 处理Web客户端请求
  server.handleClient();
}
