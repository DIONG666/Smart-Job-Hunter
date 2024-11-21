import {
    Input,
    Select,
    Button,
    Radio, Notification, Message, Card
} from '@arco-design/web-react';
import {IconMinus} from '@arco-design/web-react/icon';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
const TextArea=Input.TextArea
const Option = Select.Option;
const options=['男','女']
const educationSelection=['大专','本科','硕士','博士']
const citySelection=['北京','上海','广州','深圳']

const selectedStyle={width:50,height:31,display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'rgba(60,192,201,100%)',color:'white'}
const notSelectedStyle={width:50,height:31,display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'whitesmoke',color:'#4E5969'}

const EditInformation =()=>{
    const navigate=useNavigate()
    const user=useLocation().state

    const [name,setName]=useState('')
    const [sex,setSex]=useState('')
    const [lowestSalary,setLowestSalary]=useState(0)
    const [highestSalary,setHighestSalary]=useState(0)
    const [phone,setPhone]=useState('')
    const [education,setEducation]=useState('')
    const [year,setYear]=useState(0)
    const [intention,setIntention]=useState('')
    const [intentionCity,setIntentionCity]=useState('')
    const [email,setEmail]=useState('')
    const [profession,setProfession]=useState('')
    const [educationExperience,setEducationExperience]=useState('')
    const [internship,setInternship]=useState('')
    const [project,setProject]=useState('')
    const [advantage,setAdvantage]=useState('')
    const [tempYear,setTempYear]=useState(year.toString())

    const [loading,setLoading]=useState(true)

    useEffect(() => {
        axios({
            method:'get',
            url:'http://192.210.174.146:5000/students/get-info/'+user.user_id,
            data:{
                userId:user.user_id,
            }
        }).then(
            res=>{
                setName(res.data.name)
                setSex(res.data.sex)
                setLowestSalary(parseInt(res.data.lowestSalary))
                setHighestSalary(parseInt(res.data.highestSalary))
                setPhone(res.data.phone)
                setEducation(res.data.education)
                setYear(parseInt(res.data.year))
                setIntention(res.data.intention)
                setIntentionCity(res.data.intentionCity)
                setInternship(res.data.internship)
                setEmail(res.data.email)
                setProfession(res.data.profession)
                setEducationExperience(res.data.educationExperience)
                setProject(res.data.project)
                setAdvantage(res.data.advantage)
                setLoading(false)
            },
            error=>{
                Message.error('数据请求失败！')
                setLoading(false)
            }
        )
    }, []);

    return (
    <div style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:'10',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{width:750,height:510,backgroundColor:'white',padding:'30px 100px 30px 100px',margin:100,borderRadius:5}}>
            {
                loading?
                    <Card style={{width:'100%',height:'100%'}} bordered={false} loading={loading}/>
                    :
                    <>
                        <div style={{fontSize:25,fontWeight:'bold'}}>
                            请编辑您的信息
                        </div>
                        <div style={{overflow:"auto",height:'80%',paddingLeft:5,paddingRight:5,marginTop:15}}>
                            <div style={{display:'flex',justifyContent:'space-between'}}>
                                <div style={{width:'45%'}}>
                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>姓名
                                        </div>
                                        <Input defaultValue={name} style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setName(value)}}/>
                                    </div>

                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>性别
                                        </div>
                                        <Radio.Group defaultValue={sex} onChange={value=>{setSex(value)}} name='button-radio-group' style={{ marginBottom:15,marginTop:5,display:'flex'}}>
                                            {options.map((item) => {
                                                return (
                                                    <Radio key={item} value={item}>
                                                        {({ checked }) => {
                                                            return (
                                                                <Button tabIndex={-1} key={item} style={checked ? selectedStyle : notSelectedStyle}>
                                                                    {item}
                                                                </Button>
                                                            );
                                                        }}
                                                    </Radio>
                                                );
                                            })}
                                        </Radio.Group>
                                    </div>
                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>期望薪资
                                        </div>
                                        <Input.Group style={{marginBottom:17,marginTop:3,borderRadius:5,display:'flex',alignItems:'center'}}>
                                            <Input
                                                defaultValue={lowestSalary.toString()}
                                                style={{ width: '24%', marginRight: 8 }}
                                                onChange={value => {
                                                    setLowestSalary(parseInt(value))
                                                }}
                                            />
                                            <IconMinus style={{ color: 'var(--color-text-1)' }} />
                                            <Input
                                                defaultValue={highestSalary.toString()}
                                                style={{ width: '24%', marginLeft: 8 }}
                                                onChange={value => {
                                                    setHighestSalary(parseInt(value))
                                                }}
                                            />
                                            &nbsp;&nbsp;<span style={{fontSize:16}}>K</span>
                                        </Input.Group>
                                    </div>
                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>联系电话
                                        </div>
                                        <Input defaultValue={phone} style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setPhone(value)}}/>
                                    </div>
                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>学历
                                        </div>
                                        <Select
                                            defaultValue={education}
                                            style={{ marginBottom:17,marginTop:3,borderRadius:5,width:200}}
                                            onChange={value =>{
                                                setEducation(value)
                                            }}
                                        >
                                            {educationSelection.map((option, index) => (
                                                <Option key={option} value={option}>
                                                    {option}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div style={{width:'45%'}}>
                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>年龄
                                        </div>
                                        <Input
                                            defaultValue={year.toString()}
                                            style={{ marginBottom:17,marginTop:3,borderRadius:5 }}
                                            onBlur={()=>{
                                                const number=/^[0-9]{1,3}$/
                                                if(number.test(tempYear)) {
                                                    setYear(parseInt(tempYear))
                                                }
                                                else {
                                                    Notification.error({
                                                        title: 'Error',
                                                        content: '请输入正确的年龄!',
                                                    })
                                                }
                                            }}
                                            onChange={value=>{
                                                setTempYear(value)
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>求职意向
                                        </div>
                                        <Input defaultValue={intention} style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setIntention(value)}}/>
                                    </div>

                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>意向城市
                                        </div>
                                        <Select
                                            defaultValue={intentionCity}
                                            style={{ marginBottom:17,marginTop:3,borderRadius:5,width:200}}
                                            onChange={value =>{
                                                setIntentionCity(value)
                                            }}
                                        >
                                            {citySelection.map((option, index) => (
                                                <Option key={option} value={option}>
                                                    {option}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>

                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            电子邮箱（选填）
                                        </div>
                                        <Input defaultValue={email} style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setEmail(value)}}/>
                                    </div>

                                    <div>
                                        <div style={{fontSize:17,color:'grey'}}>
                                            <span style={{color:'red'}}>* </span>专业
                                        </div>
                                        <Input defaultValue={profession} style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setProfession(value)}}/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div style={{fontSize:17,color:'grey'}}>
                                        <span style={{color:'red'}}>* </span>教育经历
                                    </div>
                                    <TextArea
                                        autoSize={{ minRows: 2 }}
                                        defaultValue={educationExperience}
                                        style={{ marginBottom:17,marginTop:3,borderRadius:5 }}
                                        onChange={value=>{setEducationExperience(value)}}
                                    />
                                </div>
                                <div>
                                    <div style={{fontSize:17,color:'grey'}}>
                                        项目经历（选填）
                                    </div>
                                    <TextArea
                                        autoSize={{ minRows: 2 }}
                                        defaultValue={project}
                                        style={{ marginBottom:17,marginTop:3,borderRadius:5 }}
                                        onChange={value=>{setProject(value)}}
                                    />
                                </div>
                                <div>
                                    <div style={{fontSize:17,color:'grey'}}>
                                        实习经历（选填）
                                    </div>
                                    <TextArea
                                        autoSize={{ minRows: 2 }}
                                        defaultValue={internship}
                                        style={{ marginBottom:17,marginTop:3,borderRadius:5 }}
                                        onChange={value=>{setInternship(value)}}
                                    />
                                </div>
                                <div>
                                    <div style={{fontSize:17,color:'grey'}}>
                                        个人优势（选填）
                                    </div>
                                    <TextArea
                                        autoSize={{ minRows: 2 }}
                                        defaultValue={advantage}
                                        style={{marginTop:3,borderRadius:5 }}
                                        onChange={value=>{setAdvantage(value)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{display:'flex',margin:15,float:'right'}}>
                            <Button onClick={()=>{navigate('/main/student_information',{state:user})}} style={{border:'1px solid lightgrey',color:'rgba(60,192,201,100%)',backgroundColor:'white',width:85,height:35,fontSize:16,borderRadius:3,display:"flex",justifyContent:'center',alignItems:'center'}}>返 回</Button>
                            <Button
                                onClick={()=>{
                                    if(name.trim()!==''&&sex.trim()!==''&&lowestSalary!==0&&highestSalary!==0&&phone.trim()!==''&&education.trim()!==''&&intention.trim()!==''&&intentionCity.trim()!==''&&profession.trim()!==''&&educationExperience.trim()!==''){
                                        axios({
                                            method:'put',
                                            url:'http://192.210.174.146:5000/students/update-info',
                                            data:{
                                                "userId": user.user_id,
                                                "name": name,
                                                "sex": sex,
                                                "lowestSalary": lowestSalary,
                                                "highestSalary": highestSalary,
                                                "phone": phone,
                                                "education": education,
                                                "year": year,
                                                "intention": intention,
                                                "intentionCity": intentionCity,
                                                "email": email,
                                                "profession": profession,
                                                "educationExperience": educationExperience,
                                                "internship": internship,
                                                "project": project,
                                                "advantage": advantage,
                                            }
                                        }).then(
                                            res=>{
                                                if(res.status===200){
                                                    Message.info('完善信息成功！')
                                                    navigate('/main/student_information',{state:user})
                                                }
                                            },
                                            error=>{
                                                if(error.response){
                                                    if(error.response.status===404){
                                                        Message.error('请求的资源错误！')
                                                    }
                                                    if (error.response.status===500){
                                                        Message.error('服务器内部错误！')
                                                    }
                                                } else {
                                                    Message.error('Network Error!')
                                                }
                                            }
                                        )
                                    } else {
                                        Message.error('仍有未填写项！')
                                    }
                                }}
                                style={{color:'white',backgroundColor:'rgba(60,192,201,100%)',marginLeft:30,width:85,height:35,fontSize:16,borderRadius:3,display:"flex",justifyContent:'center',alignItems:'center'}}>完 成</Button>
                        </div>
                    </>
            }
        </div>
    </div>
    )
}

export default EditInformation