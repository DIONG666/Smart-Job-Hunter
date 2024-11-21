import {Layout, Button, Avatar} from '@arco-design/web-react';
import './style/MainPage.css'
import {useState} from "react";
import {Link, Navigate, Outlet, Route, Routes} from "react-router-dom";
import {IconMan} from "@arco-design/web-react/icon";
const Header = Layout.Header;
const Content = Layout.Content;

const noSelectedStyle={position:'relative',height:'70px',width:'25%',fontSize:21,backgroundColor:'rgba(56,56,56,100%)',color:'white'}
const selectedStyle={position:'relative',height:'70px',width:'25%',fontSize:21,backgroundColor:'rgba(56,56,56,100%)',color:'rgba(60,192,201,100%)'}

const noSelectedStyle2={color:'white',display:'flex',alignItems:'center'}
const selectedStyle2={color:'rgba(60,192,201,100%)',display:'flex',alignItems:'center'}


const animationStyle='animation buttonText'
const notAnimationStyle='buttonText'

const animationStyle2='animation'
const notAnimationStyle2=' '

const MainPage=()=>{
    const [buttonStyle1,setButtonStyle1]=useState(selectedStyle)
    const [buttonStyle2,setButtonStyle2]=useState(noSelectedStyle)
    const [buttonStyle3,setButtonStyle3]=useState(noSelectedStyle)
    const [buttonStyle4,setButtonStyle4]=useState(noSelectedStyle)
    const [buttonStyle5,setButtonStyle5]=useState(noSelectedStyle2)


    const [textStyle1,setTextStyle1]=useState(notAnimationStyle)
    const [textStyle2,setTextStyle2]=useState(animationStyle)
    const [textStyle3,setTextStyle3]=useState(animationStyle)
    const [textStyle4,setTextStyle4]=useState(animationStyle)
    const [textStyle5,setTextStyle5]=useState(animationStyle2)

    return (<>
        <Layout style={{ position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'whitesmoke' }}>
            <Header style={{width:'100%',height:'70px',backgroundColor:'rgba(56,56,56,100%)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{width:'15%',textAlign:"center",fontSize:30,color:'rgba(60,192,201,100%)'}}>
                    LOGO
                </div>
                <div id={'buttonGroup'} style={{display:'flex',fontSize:25,width:'40%',justifyContent:'space-around'}}>
                    <Link to={'/main/home'}>
                        <Button style={buttonStyle1} onClick={()=>{
                            setTextStyle1(notAnimationStyle)
                            setTextStyle2(animationStyle)
                            setTextStyle3(animationStyle)
                            setTextStyle4(animationStyle)
                            setTextStyle5(animationStyle2)
                            setButtonStyle1(selectedStyle)
                            setButtonStyle2(noSelectedStyle)
                            setButtonStyle3(noSelectedStyle)
                            setButtonStyle4(noSelectedStyle)
                            setButtonStyle5(noSelectedStyle2)
                        }}
                        >
                            <div class={textStyle1}>首页</div>
                        </Button>
                    </Link>
                    <Link to={'/main/job'}>
                        <Button style={buttonStyle2} onClick={()=>{
                            setTextStyle2(notAnimationStyle)
                            setTextStyle1(animationStyle)
                            setTextStyle3(animationStyle)
                            setTextStyle4(animationStyle)
                            setTextStyle5(animationStyle2)
                            setButtonStyle2(selectedStyle)
                            setButtonStyle1(noSelectedStyle)
                            setButtonStyle3(noSelectedStyle)
                            setButtonStyle4(noSelectedStyle)
                            setButtonStyle5(noSelectedStyle2)
                        }}>
                            <div class={textStyle2}>我要求职</div>
                        </Button>
                    </Link>
                    <Link to={'/main/recruit'}>
                        <Button style={buttonStyle3} onClick={()=>{
                            setTextStyle3(notAnimationStyle)
                            setTextStyle2(animationStyle)
                            setTextStyle1(animationStyle)
                            setTextStyle4(animationStyle)
                            setTextStyle5(animationStyle2)
                            setButtonStyle3(selectedStyle)
                            setButtonStyle2(noSelectedStyle)
                            setButtonStyle1(noSelectedStyle)
                            setButtonStyle4(noSelectedStyle)
                            setButtonStyle5(noSelectedStyle2)
                        }}>
                           <div class={textStyle3}>我要招聘</div>
                        </Button>
                    </Link>
                    <Link to={'/main/consult'}>
                        <Button style={buttonStyle4} onClick={()=>{
                            setTextStyle4(notAnimationStyle)
                            setTextStyle2(animationStyle)
                            setTextStyle3(animationStyle)
                            setTextStyle1(animationStyle)
                            setTextStyle5(animationStyle2)
                            setButtonStyle4(selectedStyle)
                            setButtonStyle2(noSelectedStyle)
                            setButtonStyle3(noSelectedStyle)
                            setButtonStyle1(noSelectedStyle)
                            setButtonStyle5(noSelectedStyle2)
                        }}>
                            <div class={textStyle4}>行业咨询</div>
                        </Button>
                    </Link>
                </div>
                <div style={{width:'15%',textAlign:"center",fontSize:20}}>
                    <Link to={'/signIn'} style={{textDecoration:'none',color:'white'}}>*/
                        <div class={'animation'}>*/
                            登录*/
                        </div>
                    </Link>
                    <Link to={'/main/personal'} style={{textDecoration:'none'}}>
                        <div class={textStyle5}  style={buttonStyle5} onClick={()=>{
                            setTextStyle4(animationStyle)
                            setTextStyle2(animationStyle)
                            setTextStyle3(animationStyle)
                            setTextStyle1(animationStyle)
                            setTextStyle5(notAnimationStyle2)
                            setButtonStyle4(noSelectedStyle)
                            setButtonStyle2(noSelectedStyle)
                            setButtonStyle3(noSelectedStyle)
                            setButtonStyle1(noSelectedStyle)
                            setButtonStyle5(selectedStyle2)
                        }}>
                            <Avatar size={48}>User</Avatar>
                            <div style={{fontSize:22,marginLeft:15}}>DIONG</div>
                        </div>
                    </Link>
                </div>
            </Header>
            <Content style={{width:'100%'}}>
                <Outlet />
            </Content>
        </Layout>
    </>)
}

export default MainPage