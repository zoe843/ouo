// 定义触摸引脚（T0对应GPIO4）
#define TOUCH_PIN 4
// 定义LED引脚（ESP32 DevKit板载LED通常是GPIO2）
#define LED_PIN 2
// 中断模式设置：0为轮询模式，1为中断模式
#define EXT_ISR_MODE 0

// 阈值，需要通过串口监视器观察并调整
int threshold = 200;
// 触摸值
int touchValue;

// ========== 新增：开关功能所需变量 ==========
bool ledState = LOW;       // LED当前状态（初始熄灭）
bool lastTouchState = false; // 上一次触摸检测状态
const int debounceDelay = 50; // 触摸防抖延时（毫秒）
// ==========================================

void setup() {
  Serial.begin(115200);
  delay(1000); // 等待串口稳定

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, ledState); // 初始化LED状态
}

void loop() {
  touchValue = touchRead(TOUCH_PIN);
  Serial.print("Touch Value: ");
  Serial.println(touchValue);

  // ========== 修改：替换原有的阈值判断逻辑 ==========
  // 1. 判断当前是否检测到触摸
  bool currentTouchState = (touchValue < threshold);

  // 2. 检测触摸上升沿（从未触摸 → 触摸的瞬间）+ 防抖
  if (currentTouchState && !lastTouchState) {
    delay(debounceDelay); // 延时过滤触摸抖动
    // 再次确认触摸状态，避免误触发
    if (touchRead(TOUCH_PIN) < threshold) {
      ledState = !ledState; // 翻转LED状态
      digitalWrite(LED_PIN, ledState);
    }
  }

  // 3. 更新上一次触摸状态
  lastTouchState = currentTouchState;
  // ==============================================

  delay(100);
}