import {Button, Image, Message, Steps} from "@arco-design/web-react";
import {useState} from "react";
import firmNotSelected from '../images/firmNotSelected.png'
import firmSelected from '../images/firmSelected.png'
import studentSelected from '../images/studentSelected.png'
import studentNotSelected from '../images/studentNotSelected.png'
import leftWord from '../images/firstLeftWord.png'
import leftIcon from '../images/firstLeftIcon.png'
import rightWord from '../images/firstRightWord.png'
import rightIcon from '../images/firstRightIcon.png'
import { useLocation, useNavigate} from "react-router-dom";
import '../style/guide.css'

const Step = Steps.Step;
const FirstGuidePage=()=>{
    const [ifStudentSelected,setIfStudentSelected]=useState(true)
    const user=useLocation().state
    const navigate=useNavigate()

    const [animationStyle,setAnimationStyle]=useState('fadeInAnimation')
    setTimeout(()=>{setAnimationStyle('')},1500)

    return (
        <>
            <div style={{position:'fixed',top:'10%',bottom:0,left:0,right:'78%',textAlign:'center',paddingTop:100,paddingBottom:100}}>
                <img src={leftWord} alt={''} style={{width:'90%'}} class={animationStyle}></img>
                <img src={leftIcon} alt={''} style={{width:'90%'}} class={animationStyle}></img>
            </div>
            <div style={{position:'absolute',top:0,bottom:0,left:'22%',right:'22%',backgroundColor:'white',padding:'60px 120px 70px 120px'}}>
                <div>
                    <Steps current={1} style={{ width: 600, margin: '0 auto' }}>
                        <Step title='身份' description='请选择您的身份'/>
                        <Step title='信息' description='请完善您的信息'/>
                    </Steps>
                </div>
                <div style={{fontSize:25,fontWeight:'bold',marginTop:30}}>
                    请选择您的身份
                </div>
                <div style={{marginTop:50,display:'flex',justifyContent:'space-between'}}>
                    <img src={ifStudentSelected?studentSelected:studentNotSelected}
                         alt={'student'}
                         width={280}
                         height={130}
                         onClick={()=>{
                             setIfStudentSelected(true)
                         }}
                    ></img>
                    <img src={ifStudentSelected?firmNotSelected:firmSelected}
                         alt={'firm'}
                         width={280}
                         height={130}
                         onClick={()=>{
                             setIfStudentSelected(false)
                         }}
                    ></img>
                </div>
                <Button
                    onClick={()=>{
                        if(ifStudentSelected){
                            navigate('/guide/student_resume',{state:user})
                        } else {
                            navigate('/guide/firm',{state:user})
                        }
                    }}
                    style={{marginTop:50,float:'right',color:'white',backgroundColor:'rgba(60,192,201,100%)',width:100,height:35,fontSize:17,borderRadius:3}}
                >
                    继 续
                </Button>
            </div>
            <div style={{position:'fixed',top:'10%',bottom:0,left:'78%',right:0,textAlign:'center',paddingTop:100,paddingBottom:100}}>
                <img src={rightIcon} alt={''} style={{width:'90%'}} class={animationStyle}></img>
                <img src={rightWord} alt={''} style={{width:'90%'}} class={animationStyle}></img>
            </div>
        </>
    )
}

export default FirstGuidePage