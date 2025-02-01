import AI from './images/AI.png'
import beginRecord from './images/beginRecord.png'
import endRecord from './images/endRecord.png'
import openMicrophone from './images/openMicrophone.png'
import closeMicrophone from './images/closeMicrophone.png'
import openCamera from './images/openCamera.png'
import closeCamera from './images/closeCamera.png'
import {Notification, Button, Message} from "@arco-design/web-react";
import {useEffect, useRef, useState} from "react";

const InterviewPage=()=>{
    const [ifOpenMicrophone,setIfOpenMicrophone]=useState(true)
    const [ifOpenCamera,setIfOpenCamera]=useState(true)
    const [ifBeginRecord,setIfBeginRecord]=useState(false)
    const [ifShowText,setIfShowText]=useState(true)

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    //摄像头控制逻辑
    useEffect(() => {
        let cameraStream;

        const startCamera = async () => {
            try {
                const constraints = { video: true };
                cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
                videoRef.current.srcObject = cameraStream;
            } catch (error) {
                Message.error('无法使用摄像头！')
            }
        };

        const stopCamera = () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => {
                    if (track.kind === "video") {
                        track.stop();
                    }
                });
            }
        };

        if (ifOpenCamera) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            stopCamera();
        };
    }, [ifOpenCamera]);


    //麦克风控制逻辑
    useEffect(() => {
        let micStream;

        const startMicrophone = async () => {
            try {
                const constraints = { audio: true };
                micStream = await navigator.mediaDevices.getUserMedia(constraints);

            } catch (error) {
                Message.error('无法使用麦克风！')
            }
        };

        const stopMicrophone = () => {
            if (micStream) {
                micStream.getTracks().forEach(track => {
                    if (track.kind === "audio") {
                        track.stop();
                    }
                });
            }
        };

        if (ifOpenMicrophone) {
            startMicrophone();
        } else {
            stopMicrophone();
        }

        return () => {
            stopMicrophone();
        };
    }, [ifOpenMicrophone]);


    // 录屏控制逻辑
    useEffect(() => {
        if (ifBeginRecord) {
            startScreenRecording();
        } else {
            stopScreenRecording();
        }
    }, [ifBeginRecord]);

    const startScreenRecording = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true // 包含系统音频
            });

            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true // 包含麦克风音频
            });

            // 合并屏幕流和麦克风流
            const combinedStream = mergeMediaStreams(screenStream,micStream)

            mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType: "video/mp4; codecs=avc1.42E01E, mp4a.40.2" });
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.start();
            Notification.info({
                closable: false,
                title: "开始录屏！"
            });
        } catch (error) {
            Notification.error({
                closable: false,
                title: "无法录屏！"
            });
            setIfBeginRecord(false); // 如果失败，重置状态
        }
    };

    const stopScreenRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: "video/mp4" });
                const url = URL.createObjectURL(blob);
                recordedChunksRef.current = [];

                const id = `${Date.now()}`;
                Notification.info({
                    id,
                    title: "录屏已结束",
                    content: "是否保存录屏文件？",
                    closable: false,
                    duration: 0,
                    btn: (
                        <span>
              <Button
                  type="secondary"
                  size="small"
                  style={{ margin: "0 12px" }}
                  onClick={() => Notification.remove(id)}
              >
                取消
              </Button>
              <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "screen_recording.mp4";
                      a.click();
                      Notification.remove(id);
                  }}
              >
                确定
              </Button>
            </span>
                    ),
                });
            };
        }
    };

    function mergeMediaStreams(stream1, stream2) {
        let newStream = new MediaStream();
        const audioContext = new AudioContext();
        const dest = audioContext.createMediaStreamDestination();

        stream2.getAudioTracks().forEach((track) => {
            const source = audioContext.createMediaStreamSource(
                new MediaStream([track])
            );
            source.connect(dest);
        });

        stream1.getAudioTracks().forEach((track) => {
            const source = audioContext.createMediaStreamSource(
                new MediaStream([track])
            );
            source.connect(dest);
        });

        dest.stream.getTracks().forEach((track) => newStream.addTrack(track));
        stream1.getTracks().forEach((track) => newStream.addTrack(track));
        return newStream;
    }

    return <div style={{position:'absolute',bottom:0,top:0,right:0,left:0,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{width:'100%',backgroundColor:'rgba(56,56,56,100%)',height:'10%',display:"flex",justifyContent:'space-between',alignItems:'center'}}>
            <div style={{height:'100%',width:'15%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,color:'rgba(60,192,201,100%)'}}>
                AI智领职途
            </div>
            <div style={{height:'100%',width:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,color:'rgba(60,192,201,100%)'}}>
                智谱AI面试官
            </div>
            <div style={{width:'15%'}}></div>
        </div>
        <div style={{width:'100%',height:'80%',position:'relative'}}>
            <img src={AI} style={{width:'100%',height:'100%'}}/>
            {
                ifOpenCamera?
                    <video ref={videoRef} autoPlay style={{position:'absolute',bottom:0,right:0,height:'52%',transform: "scaleX(-1)" }} />
                    :
                    null
            }
            {
                ifShowText?
                    <div style={{position:'absolute',left:'60%',top:'7%',width:'22%',height:'27%',overflow:'auto',backgroundColor:'white',borderRadius:40,border:"black 5px solid",padding:20}}>
                        <div style={{fontSize:20,overflow:'auto',width:'100%',height:'100%'}}>

                        </div>
                    </div>
                    :
                    null
            }
        </div>
        <div style={{width:'100%',height:'10%',backgroundColor:'white',display:"flex",alignItems:'center',justifyContent:'space-between'}}>
            <div style={{width:'20%',height:"100%"}}></div>
            <div style={{width:'50%',height:'100%',display:'flex',justifyContent:'space-around',alignItems:'center'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',width:'30%'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}} onClick={()=>{setIfOpenMicrophone(!ifOpenMicrophone)}}>
                        <img src={ifOpenMicrophone?closeMicrophone:openMicrophone} style={{width:32,height:32}}/>
                        <div style={{fontWeight:'bold',fontSize:12,marginTop:7}}>
                            {ifOpenMicrophone?'关闭麦克风':'打开麦克风'}
                        </div>
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',width:'30%'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}} onClick={()=>{setIfOpenCamera(!ifOpenCamera)}}>
                        <img src={ifOpenCamera?closeCamera:openCamera} style={{width:32,height:32}}/>
                        <div style={{fontWeight:'bold',fontSize:12,marginTop:7}}>
                            {ifOpenCamera?'关闭摄像头':'打开摄像头'}
                        </div>
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',width:'30%'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}} onClick={()=>{setIfBeginRecord(!ifBeginRecord)}}>
                        <img src={ifBeginRecord?endRecord:beginRecord} style={{width:32,height:32}}/>
                        <div style={{fontWeight:'bold',fontSize:12,marginTop:7}}>
                            {ifBeginRecord?'结束录制':'开始录制'}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{width:'20%',height:"100%",display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Button type={ifShowText?'outline':'primary'} onClick={()=>{setIfShowText(!ifShowText)}}>
                    {ifShowText?'隐藏文字框':'显示文字框'}
                </Button>
                <Button
                    status={'danger'}
                    type={'primary'}
                    style={{marginLeft:25,width:120,height:45,fontSize:20,fontWeight:'bold',display:'flex',alignItems:'center',justifyContent:'center'}}
                >
                    结束面试
                </Button>
            </div>
        </div>
    </div>
}

export default InterviewPage