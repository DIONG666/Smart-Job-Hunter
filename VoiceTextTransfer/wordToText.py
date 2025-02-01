import speech_recognition as sr

def audio_to_text():
    """
    从麦克风录音并实时转换为文字
    """
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("请开始说话（停止说话后系统会自动识别）...")
    try:
        with mic as source:
            recognizer.adjust_for_ambient_noise(source)  # 自动调整噪声水平
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=200)  # 自动停止录音
        print("正在识别音频内容...")
        # 使用 Google Web Speech API 识别中文内容
        text = recognizer.recognize_google(audio, language="zh-CN")  # 仅支持中文
        return text
    except sr.UnknownValueError:
        print("无法识别音频内容")
    except sr.RequestError as e:
        print(f"请求失败：{e}")
    except Exception as e:
        print(f"发生错误：{e}")

if __name__ == "__main__":
    # 自动调用语音转文字功能
    print("语音转文字功能启动...")
    print(f"音频文本内容：{audio_to_text()}")
