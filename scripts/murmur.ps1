# murmur.ps1 - Quick murmur entry
# Usage: double-click murmur.bat

$jsonPath = Join-Path $PSScriptRoot "..\content\murmurs.json"

Write-Host "`n  Murmur - jot something down" -ForegroundColor Cyan
Write-Host ("-" * 36) -ForegroundColor DarkGray
Write-Host "  Type your thought, press Enter when done." -ForegroundColor DarkGray
Write-Host ""

$body = Read-Host "Today I..."
if ([string]::IsNullOrWhiteSpace($body)) {
    Write-Host "Empty input. Cancelled." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit
}

# Auto-detect emoji based on body text
$emojiMap = @(
    @{ keys = @("开心","快乐","高兴","幸福","满足","美好","治愈","温暖","喜欢","可爱","甜","nice","happy","love"); e = [char]0x1F60A },
    @{ keys = @("哈哈","笑死","搞笑","幽默","笑","lol","haha"); e = [char]0x1F602 },
    @{ keys = @("无语","无奈","服了","离谱","哭笑不得","尴尬","......","。。。"); e = [char]0x1F605 },
    @{ keys = @("生气","愤怒","气死","讨厌","烦","恶心","操","草"); e = [char]0x1F624 },
    @{ keys = @("悲伤","难过","伤心","哭","泪","遗憾","失落","痛","emo"); e = [char]0x1F622 },
    @{ keys = @("焦虑","紧张","担心","害怕","恐惧","慌","不安"); e = [char]0x1F630 },
    @{ keys = @("疲惫","累","困","倦","熬夜","睡","休息","躺"); e = [char]0x1F634 },
    @{ keys = @("心虚","心虚","偷偷"); e = [char]0x1FAE3 },
    @{ keys = @("自嘲","讽刺","嘲笑","自黑"); e = [char]0x1F921 },
    @{ keys = @("感慨","感叹","时光","岁月","回忆","怀念","想念","从前","以前"); e = [char]0x1F972 },
    @{ keys = @("努力","加油","坚持","奋斗","拼命","自律","冲"); e = [char]0x1F4AA },
    @{ keys = @("感恩","感谢","谢谢","幸运"); e = [char]0x1F64F },
    @{ keys = @("思考","反思","困惑","迷茫","纠结","矛盾"); e = [char]0x1F914 },
    @{ keys = @("惊喜","意外","居然","竟然","哇","妙","wow"); e = [char]0x1F929 },
    @{ keys = @("安静","平静","平淡","日常","普通","简单","闲着","发呆"); e = [char]0x1F33F },
    @{ keys = @("食物","吃","好吃","饭","美食","喝","咖啡","茶","奶茶","面"); e = [char]0x1F35C },
    @{ keys = @("音乐","歌","听","耳机","播放","唱歌"); e = [char]0x1F3B5 },
    @{ keys = @("天气","雨","晴","风","雪","冷","热"); e = [char]0x1F326 },
    @{ keys = @("猫","狗","宠物","动物","猫咪","汪"); e = [char]0x1F43E },
    @{ keys = @("实验","科研","论文","读","学","考试","课","写","作业"); e = [char]0x1F4DD },
    @{ keys = @("旅行","出行","旅游","散步","走路","逛","步"); e = [char]0x1F6B6 },
    @{ keys = @("医院","病","药","健康","身体","疼"); e = [char]0x1F3E5 },
    @{ keys = @("钱","贵","工资","穷","买","消费"); e = [char]0x1F4B8 },
    @{ keys = @("游戏","玩","动漫","剧","电影","看"); e = [char]0x1F3AE },
    @{ keys = @("朋友","聊天","社交","聚会","见面","约"); e = [char]0x1F44B }
)

function Get-Emoji {
    param([string]$text)
    foreach ($item in $emojiMap) {
        foreach ($kw in $item.keys) {
            if ($text.Contains($kw)) { return $item.e }
        }
    }
    return [char]0x1F4AD  # default: thought balloon
}

$emoji = Get-Emoji $body
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$newEntry = @{
    title    = ""
    body     = $body
    datetime = $now
    emoji    = $emoji
}

# Read existing data
if (Test-Path $jsonPath) {
    $murmurs = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
} else {
    $murmurs = @()
}

# Prepend new entry
$murmurs = @($newEntry) + @($murmurs)

# Write back (UTF-8 without BOM)
Add-Type -AssemblyName System.Text.Json
$options = New-Object System.Text.Json.JsonSerializerOptions
$options.WriteIndented = $true
$options.Encoder = [System.Text.Encodings.Web.JavaScriptEncoder]::UnsafeRelaxedJsonEscaping
$json = [System.Text.Json.JsonSerializer]::Serialize($murmurs, $options)
[System.IO.File]::WriteAllText($jsonPath, $json + "`r`n", [System.Text.UTF8Encoding]::new($false))

Write-Host ""
Write-Host ("-" * 36) -ForegroundColor DarkGray
Write-Host "  $emoji  Saved!" -ForegroundColor Green
Write-Host "  Next: cd ouo && npm run build && git push" -ForegroundColor DarkGray

Read-Host "Press Enter to close"
