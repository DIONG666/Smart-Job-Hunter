import pyttsx3 as pt

def text_to_speech(text):
    """
    将固定的文字转换为语音并播放
    """
    engine = pt.init()
    # 直接定义文字内容
    print(f"正在将以下内容转换为语音：{text}")
    engine.say(text)
    engine.runAndWait()

if __name__ == "__main__":
    text_to_speech()
