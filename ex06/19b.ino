// 定义两个LED引脚（面包板上分别连接这两个引脚，各串联一个220Ω电阻到GND）
const int led1Pin = 2;  // 第一个LED（也可以用板载LED）
const int led2Pin = 4;  // 第二个LED（外接LED）

// PWM通用参数
const int pwmFreq = 5000;      // PWM频率5000Hz
const int pwmResolution = 8;   // 8位分辨率（占空比0-255）
const int stepDelay = 10;      // 渐变步长延时，控制整体速度

void setup() {
  // 初始化串口通信
  Serial.begin(115200);
  delay(1000);
  Serial.println("=== 警车双闪灯效（双通道PWM反相渐变） ===");

  // 初始化两个独立的PWM通道
  // ESP32会自动为每个引脚分配不同的PWM通道
  ledcAttach(led1Pin, pwmFreq, pwmResolution);
  ledcAttach(led2Pin, pwmFreq, pwmResolution);
}

void loop() {
  // 核心逻辑：两个LED反相渐变
  // 当led1从0→255（逐渐变亮）时，led2从255→0（逐渐变暗）
  for (int dutyCycle = 0; dutyCycle <= 255; dutyCycle++) {
    ledcWrite(led1Pin, dutyCycle);          // LED1占空比递增
    ledcWrite(led2Pin, 255 - dutyCycle);    // LED2占空比递减（反相）
    delay(stepDelay);
  }

  // 当led1达到最亮时，开始反向渐变
  // 当led1从255→0（逐渐变暗）时，led2从0→255（逐渐变亮）
  for (int dutyCycle = 255; dutyCycle >= 0; dutyCycle--) {
    ledcWrite(led1Pin, dutyCycle);
    ledcWrite(led2Pin, 255 - dutyCycle);
    delay(stepDelay);
  }

  Serial.println("一个完整的双闪周期完成");
}