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
import ReactEcharts from 'echarts-for-react'
import RequestURL from "../../../../../requestURL";

const RadioGroup = Radio.Group;

const selectedCardStyle={
    width: '100%',
    height: '100%',
    borderRadius:15,
    backgroundColor:'white',
    position:'relative',
    border:'1px solid rgba(60,192,201,100%)',
    color:'rgba(60,192,201,100%)',
    padding:'7px 10px 7px 10px'
}
const notSelectedCardStyle={
    width: '100%',
    height: '100%',
    borderRadius:15,
    backgroundColor:'white',
    position:'relative',
    padding:'7px 10px 7px 10px'
}

const RecruitPage=()=>{
    const user=useLocation().state

    const [person,setPerson]=useState([{
        name:'',
        sex:'',
        education:'',
        skills: [],
        intention:'',
        year:0,
        phone:'',
        email:'',
        educationExperience:'',
        project:'',
        advantage:'',
        internship:'',
        match:0,
        lowestSalary:0,
        highestSalary:0,
        profession:'',
        educationMatch:0,
        salaryMatch:0,
        addressMatch:0,
        abilityMatch:0,
        intentionCity:'',
        id:-1
    }])
    const [selectedPerson,setSelectedPerson]=useState({
        name:'',
        sex:'',
        education:'',
        skills: [],
        intention:'',
        year:0,
        phone:'',
        email:'',
        educationExperience:'',
        project:'',
        advantage:'',
        internship:'',
        match:0,
        lowestSalary:0,
        highestSalary:0,
        profession:'',
        educationMatch:0,
        salaryMatch:0,
        addressMatch:0,
        abilityMatch:0,
        intentionCity:'',
        id:-1
    })
    const [loading,setLoading]=useState(true)
    const [havePerson,setHavePerson]=useState(false)

    useEffect(() => {
        axios({
            method:'get',
            url:RequestURL+'/talents/recommended/'+user.user_id,
        }).then(
            res=>{
                setPerson(res.data)
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

    const [yData,setYData]=useState([selectedPerson.abilityMatch,selectedPerson.educationMatch,selectedPerson.addressMatch,selectedPerson.salaryMatch]);
    const option = {
        xAxis: {
            type: 'category',
            data: ['能力','学历','地址','薪资']
        },
        yAxis: {
            type: 'value'
        },
        grid:{
            left:'2%',
            right:'2%',
            top:'6%',
            bottom:'2%',
            containLabel:'true'
        },
        series: [
            {
                data: yData,
                type: 'bar',
                showBackground: true,
                itemStyle:{
                    normal:{
                        color:function (params){
                            const color=['#FF6B6B','#4DDBE9','#F9DA68','#CAB8FF']
                            return color[params.dataIndex]
                        }
                    }
                },
                label: {
                    show: true, // 开启显示
                    verticalAlign: 'middle',
                    textStyle: {
                        color: '#424656', // 顶部数据的颜色
                        fontSize: 14     // 顶部数据的字体大小
                    },
                }
            }
        ]
    };

    useEffect(()=>{
        setYData([selectedPerson.abilityMatch,selectedPerson.educationMatch,selectedPerson.addressMatch,selectedPerson.salaryMatch])
    },[selectedPerson])

    function KeyWordList({value}){
        if (value.length === 0){
            return null
        }
        value=JSON.parse(value)
        return <div style={{display:'flex',flexFlow:'row wrap'}}>
            {
                value.map((value)=>{
                    return <div style={{margin:4,backgroundColor:"#ececec",color:'darkslategray',padding:'1px 13px 1px 13px',fontSize:12,borderRadius:5}}>{value}</div>
                })
            }
        </div>
    }

    function CardList(){
        return (<Radio.Group>
            {person.map((value)=>{
                return (
                    <Radio key={value} value={value} style={{width:'80%', marginBottom:20}}>
                        {({checked})=>{
                            return (
                                <Button
                                    id='cardButton'
                                    style={value===selectedPerson?selectedCardStyle:notSelectedCardStyle}
                                    onClick={()=>{
                                        setSelectedPerson(value)
                                    }}
                                >
                                    <div style={{fontSize:16,display:'flex',justifyContent:'space-between'}}>
                                        <div>
                                            {value.name}
                                        </div>
                                        <div>
                                            {value.education}
                                        </div>
                                    </div>
                                    <KeyWordList value={value.skills} />
                                    <div style={{display:'flex',marginTop:5}}>
                                        {
                                            value.project===''||null||undefined?
                                                null
                                                :
                                                <div style={{marginRight:10,backgroundColor:"rgb(220,248,255)",color:'rgb(0,167,176)',padding:'1px 10px 1px 10px',fontSize:12,borderRadius:3}}>有项目经历</div>
                                        }
                                        {
                                            value.internship===''||null||undefined?
                                                null
                                                :
                                                <div style={{marginRight:10,backgroundColor:"rgb(220,248,255)",color:'rgb(0,167,176)',padding:'1px 10px 1px 10px',fontSize:12,borderRadius:3}}>有实习经历</div>
                                        }
                                    </div>
                                    <div style={{marginTop:5,textAlign:'left'}}>
                                        求职意向：{value.intention}
                                    </div>
                                    <div style={{display:'flex',alignItems:'baseline'}}>
                                        <div>
                                            <span>匹配度：</span>
                                        </div>
                                        <div style={{fontSize:21,fontWeight:'bold',color:'red'}}>
                                            {value.match}%
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
            !loading?
                <Card style={{width:'100%',height:'100%'}} bordered={false} loading={loading}/>
                :
                !havePerson?
                    <>
                        <div style={{width:'100%',backgroundColor:'white',height:'65px',display:'flex',alignItems:'center'}}>
                            <div style={{marginLeft:'7%',width:'20%',fontSize:30,color:'rgba(60,192,201,100%)',fontWeight:'bold'}}>
                                推荐候选人
                            </div>
                            <div style={{marginLeft:'3%'}}>
                                <RadioGroup onChange={value => {
                                    axios({
                                        method:'get',
                                        url:RequestURL+`/talents/sort/${user.user_id}/${value}`,
                                    }).then(
                                        res=>{
                                            setPerson(res.data)
                                            setSelectedPerson({
                                                name:'',
                                                sex:'',
                                                education:'',
                                                skills: [],
                                                intention:'',
                                                year:0,
                                                phone:'',
                                                email:'',
                                                educationExperience:'',
                                                project:'',
                                                advantage:'',
                                                internship:'',
                                                match:0,
                                                lowestSalary:0,
                                                highestSalary:0,
                                                profession:'',
                                                educationMatch:0,
                                                salaryMatch:0,
                                                addressMatch:0,
                                                abilityMatch:0,
                                                intentionCity:'',
                                                id:-1
                                            })
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
                                    <Radio key={3} value='salary'>薪资优先</Radio>
                                    <Radio key={4} value='location'>地址优先</Radio>
                                </RadioGroup>
                            </div>
                            <Button
                                onClick={()=>{
                                    setPerson([{
                                        name:'',
                                        sex:'',
                                        education:'',
                                        skills: [],
                                        intention:'',
                                        year:0,
                                        phone:'',
                                        email:'',
                                        educationExperience:'',
                                        project:'',
                                        advantage:'',
                                        internship:'',
                                        match:0,
                                        lowestSalary:0,
                                        highestSalary:0,
                                        profession:'',
                                        educationMatch:0,
                                        salaryMatch:0,
                                        addressMatch:0,
                                        abilityMatch:0,
                                        intentionCity:'',
                                        id:-1
                                    }])
                                    setSelectedPerson({
                                        name:'',
                                        sex:'',
                                        education:'',
                                        skills: [],
                                        intention:'',
                                        year:0,
                                        phone:'',
                                        email:'',
                                        educationExperience:'',
                                        project:'',
                                        advantage:'',
                                        internship:'',
                                        match:0,
                                        lowestSalary:0,
                                        highestSalary:0,
                                        profession:'',
                                        educationMatch:0,
                                        salaryMatch:0,
                                        addressMatch:0,
                                        abilityMatch:0,
                                        intentionCity:'',
                                        id:-1
                                    })

                                    setLoading(true)
                                    setHavePerson(false)

                                    axios({
                                        method:'get',
                                        url:RequestURL+'/talents/recommended/'+user.user_id,
                                    }).then(
                                        res=>{
                                            setPerson(res.data)
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
                                }}
                                style={{marginLeft:'30%',color:'white',backgroundColor:'rgba(60,192,201,100%)',width:110,height:40,fontSize:18,borderRadius:5}}
                            >
                                重新推荐
                            </Button>
                        </div>
                        <div style={{width:'100%',display:'flex',height:'90%'}}>
                            <div style={{width:'25%',overflow:'auto',height:'95%',textAlign:'center',marginTop:20}}>
                                <CardList />
                            </div>
                            <div style={{width:'75%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <div style={{width:'90%',height:'90%',backgroundColor:'white',borderRadius:10,position:'relative'}}>
                                    {
                                        selectedPerson.id===-1?
                                            null
                                            :
                                            <Button
                                                onClick={()=>{
                                                    axios({
                                                        method:'get',
                                                        url:RequestURL+'/resumes/view/'+selectedPerson.id
                                                    }).then(
                                                        res=>{
                                                            window.open(res.data.resume_url, '_blank');
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
                                    }
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
                                            <div style={{marginTop:8}}>
                                                期望薪资：<span style={{color:'red'}}>{selectedPerson.lowestSalary/1000}——{selectedPerson.highestSalary/1000} K</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{height:'75%',margin:'10px 50px 10px 50px',display:'flex',justifyContent:'space-between'}}>
                                        <div style={{width:'48%',marginRight:'2%',height:'100%',position:'relative',overflowY:'auto'}}>
                                            <div style={{width:'100%'}}>
                                                <div style={{fontWeight:'bold',fontSize:17,marginBottom:7}}>
                                                    专业技能
                                                </div>
                                                <KeyWordList value={selectedPerson.skills}/>
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
                                                    {selectedPerson.project}
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
                                        <div  style={{width:'47%',height:'100%',marginLeft:'3%'}}>
                                            <div style={{fontWeight:'bold',fontSize:17}}>
                                                匹配分析结果
                                            </div>
                                            <ReactEcharts style={{width:'100%',height:'90%'}} option={option} />
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