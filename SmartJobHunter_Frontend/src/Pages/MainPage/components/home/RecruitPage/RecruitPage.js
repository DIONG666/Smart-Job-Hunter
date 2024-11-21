import {Button, Card, Message, Radio} from "@arco-design/web-react";
import {useEffect, useState} from "react";
import './style/RecruitPage.css'
import crosshair from './image/crosshair.png'
import email from './image/email.png'
import female from './image/female.png'
import male from './image/male.png'
import graduation from './image/graduation.png'
import phone from './image/phone.png'
import axios from "axios";
import {useLocation} from "react-router-dom";

const RadioGroup = Radio.Group;

const selectedCardStyle={
    width: '100%',
    height: '100%',
    borderRadius:15,
    backgroundColor:'white',
    position:'relative',
    border:'1px solid rgba(60,192,201,100%)',
    color:'rgba(60,192,201,100%)'
}
const notSelectedCardStyle={
    width: '100%',
    height: '100%',
    borderRadius:15,
    backgroundColor:'white',
    position:'relative'
}
const RecruitPage=()=>{
    const user=useLocation().state

    const [person,setPerson]=useState([{
        name:'',
        sex:'',
        education:'',
        keyWord: [],
        intention:'',
        year:0,
        phone:'',
        email:'',
        educationExperience:'',
        projectExperience:'',
        advantage:'',
        internship:'',
        match:0
    }])
    const [selectedPerson,setSelectedPerson]=useState(person[0])
    const [loading,setLoading]=useState(true)
    const [havePerson,setHavePerson]=useState(false)

    useEffect(() => {
        axios({
            method:'get',
            url:'http://192.210.174.146:5000/talents/recommended/'+user.user_id,
        }).then(
            res=>{
                setPerson(res.data)
                setSelectedPerson(person[0])
                setLoading(false)
                setHavePerson(true)
            },
            error=>{
                if(error.response){
                    Message.error('未找到推荐人才！')
                } else {
                    Message.error('Network Error!')
                }
                setLoading(false)
            }
        )
    },[])

    function KeyWordList({value}){
        return <div style={{display:'flex'}}>
            {
                value.length===0?
                    ''
                    :
                    value.map((value)=>{
                        return <div style={{marginRight:10,backgroundColor:"#ececec",color:'darkslategray',padding:'1px 13px 1px 13px',fontSize:12,borderRadius:5}}>{value}</div>
                    })
            }
        </div>
    }

    function CardList(){
        return (<Radio.Group>
            {person.map((value)=>{
                return (
                    <Radio key={value} value={value} style={{width:300, height:130, marginBottom:20}}>
                        {({checked})=>{
                            return (
                                <Button
                                    id='cardButton'
                                    style={value===selectedPerson?selectedCardStyle:notSelectedCardStyle}
                                    onClick={()=>{
                                        setSelectedPerson(value)
                                    }}
                                >
                                    <div style={{fontSize:16}}>
                                        <div style={{position:'absolute',top:'7%',left:'6%',textAlign:'left'}}>
                                            <div style={{marginBottom:5}}>
                                                {value.name}
                                            </div>
                                            <KeyWordList value={value.keyWord} />
                                            <div style={{display:'flex',marginTop:8}}>
                                                {value.projectExperience.trim()===''?null:<div style={{marginRight:10,backgroundColor:"rgb(220,248,255)",color:'rgb(0,167,176)',padding:'1px 10px 1px 10px',fontSize:12,borderRadius:3}}>有项目经历</div>}
                                                {value.internship.trim()===''?null:<div style={{marginRight:10,backgroundColor:"rgb(220,248,255)",color:'rgb(0,167,176)',padding:'1px 10px 1px 10px',fontSize:12,borderRadius:3}}>有实习经历</div>}
                                            </div>
                                        </div>
                                        <div style={{position:'absolute',top:'7%',right:'6%'}}>
                                            {value.education}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{position:'absolute',bottom:'7%',left:'6%'}}>
                                            求职意向：{value.intention}
                                        </div>
                                        <div style={{position:'absolute',bottom:'5%',right:'5%'}}>
                                            <div>
                                                匹配度：
                                            </div>
                                            <div style={{fontSize:21,fontWeight:'bold',color:'red'}}>
                                                {value.match}%
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            )
                        }}
                    </Radio>
                )
            })}
        </Radio.Group>)
    }

    return (<>
        {
            loading?
                <Card style={{width:'100%',height:'100%'}} bordered={false} loading={loading}/>
                :
                havePerson?
                    <>
                        <div style={{width:'100%',backgroundColor:'white',height:'65px',display:'flex',alignItems:'center'}}>
                            <div style={{marginLeft:'7%',width:'20%',fontSize:30,color:'rgba(60,192,201,100%)',fontWeight:'bold'}}>
                                推荐候选人
                            </div>
                            <div style={{marginLeft:'3%'}}>
                                <RadioGroup onChange={value => {
                                    axios({
                                        method:'get',
                                        url:'http://192.210.174.146:5000/talents/sort/'+value,
                                    }).then(
                                        res=>{
                                            setPerson(res.data)
                                        },
                                        error=>{
                                            if (error.response){
                                                Message.error('未找到推荐人才！')
                                            } else {
                                                Message.error('Network Error!')
                                            }
                                        }
                                    )
                                }}>
                                    <Radio key={1} value='education'>学历优先</Radio>
                                    <Radio key={2} value='skills'>能力优先</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        <div style={{width:'100%',display:'flex',height:'90%'}}>
                            <div style={{width:'25%',overflow:'auto',height:'95%',textAlign:'center',marginTop:20}}>
                                <CardList />
                            </div>
                            <div style={{width:'75%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <div style={{width:'90%',height:'90%',backgroundColor:'white',borderRadius:10,position:'relative'}}>
                                    <Button
                                        onClick={()=>{
                                            axios({
                                                method:'get',
                                                url:'http://192.210.174.146:5000/resumes/view/'+user.user_id
                                            }).then(
                                                res=>{
                                                    window.open(`/resumes/view/${user.user_id}`,'_blank')
                                                },
                                                error=>{
                                                    if(error.response){
                                                        Message.error('简历未找到！')
                                                    } else {
                                                        Message.error('Network Error!')
                                                    }
                                                }
                                            )
                                        }}
                                        style={{color:'white',backgroundColor:'rgba(60,192,201,100%)',width:110,height:40,fontSize:18,borderRadius:5,position:'absolute',top:20,right:50}}
                                    >
                                        查看简历
                                    </Button>
                                    <div style={{height:'15%',margin:'15px 50px 20px 50px',display:'flex',justifyContent:'space-between'}}>
                                        <div>
                                            <div style={{fontSize:23,fontWeight:'bold'}}>
                                                {selectedPerson.name}
                                            </div>
                                            <div style={{display:'flex',marginTop:8}}>
                                                <div style={{display:'flex',alignItems:'center'}}>
                                                    <img  src={selectedPerson.sex?male:female} alt='' style={{width:14,height:17}}/>
                                                    <div style={{marginLeft:5}}>
                                                        {selectedPerson.year}岁
                                                    </div>
                                                </div>
                                                <div style={{display:'flex',alignItems:'center',marginLeft:50}}>
                                                    <img  src={graduation} alt='' style={{width:22,height:17}}/>
                                                    <div style={{marginLeft:5}}>
                                                        {selectedPerson.education}
                                                    </div>
                                                </div>
                                                <div style={{display:'flex',alignItems:'center',marginLeft:50}}>
                                                    <img  src={crosshair} alt='' style={{width:18,height:18}}/>
                                                    <div style={{marginLeft:5}}>
                                                        {selectedPerson.intention}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{display:'flex',marginTop:8}}>
                                                <div style={{display:'flex',alignItems:'center'}}>
                                                    <img  src={phone} alt='' style={{width:14,height:17}}/>
                                                    <div style={{marginLeft:5}}>
                                                        {selectedPerson.phone.toString().slice(0,3)+'****'+selectedPerson.phone.toString().slice(7,11)}
                                                    </div>
                                                </div>
                                                <div style={{display:'flex',alignItems:'center',marginLeft:50}}>
                                                    <img  src={email} alt='' style={{width:19,height:15}}/>
                                                    <div style={{marginLeft:5}}>
                                                        {selectedPerson.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{height:'75%',margin:'10px 50px 10px 50px',display:'flex',justifyContent:'space-between'}}>
                                        <div style={{width:'50%',height:'100%',position:'relative',overflowY:'auto'}}>
                                            <div style={{width:'100%'}}>
                                                <div style={{fontWeight:'bold',fontSize:17,marginBottom:7}}>
                                                    专业技能
                                                </div>
                                                <KeyWordList value={selectedPerson.keyWord}/>
                                            </div>
                                            <div style={{width:'100%',marginTop:12}}>
                                                <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>
                                                    教育经历
                                                </div>
                                                <div style={{fontSize:17,marginBottom:7,width:'100%',wordBreak:'break-all'}}>
                                                    {selectedPerson.educationExperience}
                                                </div>
                                            </div>
                                            <div style={{width:'100%',marginTop:12}}>
                                                <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>
                                                    实习经历
                                                </div>
                                                <div style={{fontSize:17,marginBottom:7,width:'100%',wordBreak:'break-all'}}>
                                                    {selectedPerson.internship}
                                                </div>
                                            </div>
                                            <div style={{width:'100%',marginTop:12}}>
                                                <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>
                                                    项目经历
                                                </div>
                                                <div style={{fontSize:17,marginBottom:7,width:'100%',wordBreak:'break-all'}}>
                                                    {selectedPerson.projectExperience}
                                                </div>
                                            </div>
                                            <div style={{width:'100%',marginTop:12}}>
                                                <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>
                                                    个人优势
                                                </div>
                                                <div style={{fontSize:17,marginBottom:7,width:'100%',wordBreak:'break-all'}}>
                                                    {selectedPerson.advantage}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{height:'100%',width:1.5,backgroundColor:'#ececec'}}></div>
                                        <div  style={{width:'45%',height:'100%',marginLeft:'5%'}}>
                                            <div style={{fontWeight:'bold',fontSize:17}}>
                                                匹配分析结果
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <Card style={{width:'100%',height:'100%'}} bordered={false}/>
        }
    </>)
}

export default RecruitPage