from textToWord import text_to_speech
from wordToText import audio_to_text

def main():
    print("欢迎使用语音文字互转工具")
    print("请选择操作：")
    print("1. 文字转语音")
    print("2. 语音转文字")

    choice = input("请输入数字选择（1 或 2）：").strip()

    if choice == "1":
        text = "嗨 你好，欢迎使用语音文字转换工具！"
        print("启动文字转语音功能...")
        text_to_speech(text)
    elif choice == "2":
        print("启动语音转文字功能...")
        print(f"音频文本内容：{audio_to_text()}")
    else:
        print("无效的选择，请修改代码中的 choice 变量。")

if __name__ == "__main__":
    main()
