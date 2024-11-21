import leftWord from './images/firstLeftWord.png'
import leftIcon from './images/firstLeftIcon.png'
import rightWord from './images/firstRightWord.png'
import rightIcon from './images/firstRightIcon.png'
import video from './images/video.mp4'
import './style/homePage.css'

import {useState} from "react";
const HomePage=()=>{
    const [animationStyle,setAnimationStyle]=useState('fadeInAnimation')
    setTimeout(()=>{setAnimationStyle('')},1500)

    return <>
        <div style={{
            position: 'fixed',
            top: '10%',
            bottom: 0,
            left: 0,
            right: '78%',
            textAlign: 'center',
            paddingTop: 100,
            paddingBottom: 100
        }}>
            <img src={leftWord} alt={''} style={{width: '90%'}} className={animationStyle}></img>
            <img src={leftIcon} alt={''} style={{width: '90%'}} className={animationStyle}></img>
        </div>
        <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '22%',
            right: '22%',
            backgroundColor: 'white',
            display:'flex',
            justifyContent:'center'
        }}>
            <div style={{width:'90%',height:'100%'}}>
                <div style={{width:'100%',height:'60%',marginTop:'5%',textAlign:'center'}}>
                    <video style={{width:'100%',height:'100%'}} autoPlay={true} src={video}></video>
                </div>
                <div style={{width:'100%',height:'30%',marginTop:'2.5%',textAlign:'center'}}>
                    <span style={{fontSize:18}}> “慧职通”系统通过构建知识图谱，利用BERT-BiLSTM-CRF模型自动提取简历中的关键实体信息，采用基于特征融合和多轮集成嵌入的推荐算法，以及混合加密算法，提供精准、高效、安全、个性化的职位与人才推荐服务，节约人岗匹配过程中的时间与经济成本，提升你的求职体验！</span>
                    <br />
                    <br />
                    <span style={{fontSize:15}}>前端：https://github.com/fantasy123123/2024ServiceInnovationCompetition<br />后端：https://github.com/elpkijj/RecommendationSystem</span>
                </div>
            </div>
        </div>
        <div style={{
            position: 'fixed',
            top: '10%',
            bottom: 0,
            left: '78%',
            right: 0,
            textAlign: 'center',
            paddingTop: 100,
            paddingBottom: 100
        }}>
            <img src={rightIcon} alt={''} style={{width: '90%'}} className={animationStyle}></img>
            <img src={rightWord} alt={''} style={{width: '90%'}} className={animationStyle}></img>
        </div>
    </>
}

export default HomePage