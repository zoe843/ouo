// 定义硬件引脚
const int ledPin = 2;          // ESP32板载LED引脚
const int touchPin = 4;        // 触摸引脚T0对应GPIO4

// PWM呼吸灯参数
const int pwmFreq = 5000;      // PWM频率5000Hz
const int pwmResolution = 8;   // 8位分辨率（占空比0-255）

// 触摸检测参数
int touchThreshold = 200;       // 触摸阈值（根据串口输出调整）
unsigned long lastTouchTime = 0; // 触摸防抖时间戳
const unsigned long debounceDelay = 500; // 防抖延时500ms

// 调速档位参数
int currentSpeedLevel = 1;     // 当前速度档位（1-3）
int delayTime;                 // 呼吸步长延时（根据档位变化）

void setup() {
  // 初始化串口通信
  Serial.begin(115200);
  delay(1000); // 等待串口稳定
  Serial.println("=== 多档位触摸调速呼吸灯 ===");
  Serial.println("触摸GPIO4切换速度档位：1→2→3→1");

  // 初始化PWM通道并绑定LED引脚
  ledcAttach(ledPin, pwmFreq, pwmResolution);
}

void loop() {
  // 1. 读取触摸值并输出到串口
  int touchValue = touchRead(touchPin);
  Serial.print("触摸值: ");
  Serial.print(touchValue);
  Serial.print(" | 当前档位: ");
  Serial.println(currentSpeedLevel);

  // 2. 触摸检测与档位切换（带防抖）
  if (touchValue < touchThreshold && (millis() - lastTouchTime) > debounceDelay) {
    // 更新触摸时间戳
    lastTouchTime = millis();
    
    // 循环切换档位：1→2→3→1
    currentSpeedLevel = currentSpeedLevel % 3 + 1;
    
    Serial.print("切换到档位: ");
    Serial.println(currentSpeedLevel);
  }

  // 3. 根据当前档位设置呼吸速度
  switch (currentSpeedLevel) {
    case 1:
      delayTime = 20; // 慢速：每步20ms，完整呼吸周期约10秒
      break;
    case 2:
      delayTime = 10; // 中速：每步10ms，完整呼吸周期约5秒
      break;
    case 3:
      delayTime = 5;  // 快速：每步5ms，完整呼吸周期约2.5秒
      break;
  }

  // 4. 执行呼吸灯效果（逐渐变亮）
  for (int dutyCycle = 0; dutyCycle <= 255; dutyCycle++) {
    ledcWrite(ledPin, dutyCycle);
    delay(delayTime);
  }

  // 5. 执行呼吸灯效果（逐渐变暗）
  for (int dutyCycle = 255; dutyCycle >= 0; dutyCycle--) {
    ledcWrite(ledPin, dutyCycle);
    delay(delayTime);
  }

  Serial.println("一个呼吸周期完成");
}
