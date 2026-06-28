"""murmur.py - Quick murmur entry + deploy. Run via murmur.bat"""
import json
import os
import subprocess
import sys
from datetime import datetime

JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "content", "murmurs.json")
PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Keyword → emoji mapping
EMOJI_MAP = [
    (("开心","快乐","高兴","幸福","满足","美好","治愈","温暖","喜欢","可爱","甜","nice","happy","love"), "😊"),
    (("哈哈","笑死","搞笑","幽默","笑","lol","haha"), "😂"),
    (("无语","无奈","服了","离谱","哭笑不得","尴尬","......","。。。"), "😅"),
    (("生气","愤怒","气死","讨厌","烦","恶心","操","草"), "😤"),
    (("悲伤","难过","伤心","哭","泪","遗憾","失落","痛","emo"), "😢"),
    (("焦虑","紧张","担心","害怕","恐惧","慌","不安"), "😰"),
    (("疲惫","累","困","倦","熬夜","睡","休息","躺"), "😴"),
    (("心虚","偷偷"), "🫣"),
    (("自嘲","讽刺","嘲笑","自黑"), "🤡"),
    (("感慨","感叹","时光","岁月","回忆","怀念","想念","从前","以前"), "🥲"),
    (("努力","加油","坚持","奋斗","拼命","自律","冲"), "💪"),
    (("感恩","感谢","谢谢","幸运"), "🙏"),
    (("思考","反思","困惑","迷茫","纠结","矛盾"), "🤔"),
    (("惊喜","意外","居然","竟然","哇","妙","wow"), "🤩"),
    (("安静","平静","平淡","日常","普通","简单","闲着","发呆"), "🌿"),
    (("食物","吃","好吃","饭","美食","喝","咖啡","茶","奶茶","面"), "🍜"),
    (("音乐","歌","听","耳机","播放","唱歌"), "🎵"),
    (("天气","雨","晴","风","雪","冷","热"), "🌦️"),
    (("猫","狗","宠物","动物","猫咪","汪"), "🐾"),
    (("实验","科研","论文","考试","课","作业","复习"), "📝"),
    (("旅行","出行","旅游","散步","走路","逛","步"), "🚶"),
    (("医院","病","药","健康","身体","疼"), "🏥"),
    (("钱","贵","工资","穷","买","消费"), "💸"),
    (("游戏","玩","动漫","剧","电影","看"), "🎮"),
    (("朋友","聊天","社交","聚会","见面","约"), "👋"),
]

def get_emoji(text):
    for keywords, emoji in EMOJI_MAP:
        for kw in keywords:
            if kw in text:
                return emoji
    return "💭"

def run(cmd, step_name):
    """Run a command, print progress. Returns True on success."""
    print(f"  [{step_name}] ", end="", flush=True)
    result = subprocess.run(cmd, cwd=PROJECT_DIR, capture_output=True, text=True, shell=True)
    if result.returncode != 0:
        print("✗ 失败")
        print(f"  {result.stderr.strip()[-200:]}")
        return False
    print("✓")
    return True

def main():
    print()
    print("  ✦ 碎碎念 — 随便写点什么")
    print("—" * 32)

    try:
        body = input("  > ")
    except (EOFError, KeyboardInterrupt):
        print("\n已取消。")
        input("按 Enter 关闭...")
        return

    if not body.strip():
        print("内容不能为空，已取消。")
        input("按 Enter 关闭...")
        return

    emoji = get_emoji(body)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    entry = {
        "body": body.strip(),
        "datetime": now,
        "emoji": emoji
    }

    # Read existing
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            murmurs = json.load(f)
    else:
        murmurs = []

    # Prepend
    murmurs.insert(0, entry)

    # Write back
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(murmurs, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print()
    print(f"  {emoji} 已保存 — {now}")
    print()
    answer = input("  要部署上线吗？(y/n) ")
    if answer.strip().lower() != "y":
        print("  已跳过，记得之后 npm run build && git push")
        input("按 Enter 关闭...")
        return

    print()
    print("—" * 32)
    print("  开始部署...")
    print()

    # Step 1: build
    if not run("npm run build", "build"):
        input("\n按 Enter 关闭...")
        return

    # Step 2: git add + commit
    if not run('git add content/murmurs.json && git commit -m "add murmur"', "commit"):
        input("\n按 Enter 关闭...")
        return

    # Step 3: git push
    if not run("git push", "push"):
        input("\n按 Enter 关闭...")
        return

    print()
    print("  ✅ 已部署！等 2-3 分钟后刷新 https://www.rainbloom.xin")
    print()
    input("按 Enter 关闭...")

if __name__ == "__main__":
    main()
