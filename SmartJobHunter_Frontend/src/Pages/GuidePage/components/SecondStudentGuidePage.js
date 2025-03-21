import leftWord from '../images/firstLeftWord.png'
import leftIcon from '../images/firstLeftIcon.png'
import rightWord from '../images/firstRightWord.png'
import rightIcon from '../images/firstRightIcon.png'
import {useEffect, useState} from "react";
import '../style/guide.css'
import {IconCheck, IconMinus} from "@arco-design/web-react/icon";
import {Notification, Button, Input, Radio, Steps, Select, Message, Card} from "@arco-design/web-react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import RequestURL from "../../../requestURL";

const TextArea=Input.TextArea
const Step = Steps.Step;
const Option = Select.Option;
const options=['男','女']
const educationSelection=['大专','本科','硕士','博士']
const citySelection=['北京','上海' , '广州' , '深圳' , '武汉' , '南京', '成都','重庆','杭州', '天津','苏州','长沙' ,'青岛' , '西安' ,'郑州' , '宁波' , '无锡', '大连','东莞','昆明','合肥']
const selectedStyle={width:50,height:31,display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'rgba(60,192,201,100%)',color:'white'}
const notSelectedStyle={width:50,height:31,display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'whitesmoke',color:'#4E5969'}

const SecondStudentGuidePage=()=>{
    const user=useLocation().state
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate=useNavigate()
    const [animationStyle,setAnimationStyle]=useState('fadeInAnimation')
    setTimeout(()=>{setAnimationStyle('')},1500)

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
            url:RequestURL+'/students/get-info/'+user.user_id,
        }).then(
            res=>{
                setName(res.data.name)
                setSex(res.data.sex)
                setLowestSalary(parseInt(res.data.lowestSalary)/1000)
                setHighestSalary(parseInt(res.data.highestSalary)/1000)
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
        <>
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
                padding: '30px 100px 70px 100px'
            }}>
                {
                    loading?
                        <Card style={{width:'100%',height:'100%'}} bordered={false} loading={loading}/>
                        :
                        <>
                            <Steps current={2} style={{width: 600, margin: '0 auto'}}>
                                <Step title='身份' description='请选择您的身份'
                                      icon={<IconCheck style={{marginTop: 4, marginLeft: 1}}/>}/>
                                <Step title='信息' description='请完善您的信息'/>
                            </Steps>
                            <div style={{fontSize: 25, fontWeight: 'bold', marginTop: 10}}>
                                请完善您的信息
                            </div>
                            <div style={{color: 'orangered', marginTop: 2, marginBottom: 5, fontSize: 13}}>
                                *简历中缺少或未能成功提取部分关键信息，信息不完整可能会影响推荐效果
                            </div>
                            <div style={{overflow: "auto", height: '80%', paddingLeft: 5, paddingRight: 5}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div style={{width: '45%'}}>
                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>姓名
                                            </div>
                                            <Input defaultValue={name}
                                                   style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                                   onChange={value => {
                                                       setName(value)
                                                   }}/>
                                        </div>

                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>性别
                                            </div>
                                            <Radio.Group defaultValue={sex} onChange={value => {
                                                setSex(value)
                                            }} name='button-radio-group'
                                                         style={{marginBottom: 15, marginTop: 5, display: 'flex'}}>
                                                {options.map((item) => {
                                                    return (
                                                        <Radio key={item} value={item}>
                                                            {({checked}) => {
                                                                return (
                                                                    <Button tabIndex={-1} key={item}
                                                                            style={checked ? selectedStyle : notSelectedStyle}>
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
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>期望薪资
                                            </div>
                                            <Input.Group style={{
                                                marginBottom: 17,
                                                marginTop: 3,
                                                borderRadius: 5,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <Input
                                                    defaultValue={lowestSalary.toString()}
                                                    style={{width: '24%', marginRight: 8}}
                                                    onChange={value => {
                                                        setLowestSalary(parseInt(value))
                                                    }}
                                                />
                                                <IconMinus style={{color: 'var(--color-text-1)'}}/>
                                                <Input
                                                    defaultValue={highestSalary.toString()}
                                                    style={{width: '24%', marginLeft: 8}}
                                                    onChange={value => {
                                                        setHighestSalary(parseInt(value))
                                                    }}
                                                />
                                                &nbsp;&nbsp;<span style={{fontSize: 16}}>K</span>
                                            </Input.Group>
                                        </div>
                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>联系电话
                                            </div>
                                            <Input defaultValue={phone}
                                                   style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                                   onChange={value => {
                                                       setPhone(value)
                                                   }}/>
                                        </div>
                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>学历
                                            </div>
                                            <Select
                                                defaultValue={education}
                                                style={{marginBottom: 17, marginTop: 3, borderRadius: 5, width: 200}}
                                                onChange={value => {
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
                                    <div style={{width: '45%'}}>
                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>年龄
                                            </div>
                                            <Input
                                                defaultValue={year.toString()}
                                                style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                                onBlur={() => {
                                                    const number = /^[0-9]{1,3}$/
                                                    if (number.test(tempYear)) {
                                                        setYear(parseInt(tempYear))
                                                    } else {
                                                        Notification.error({
                                                            title: 'Error',
                                                            content: '请输入正确的年龄!',
                                                        })
                                                    }
                                                }}
                                                onChange={value => {
                                                    setTempYear(value)
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>求职意向
                                            </div>
                                            <Input defaultValue={intention}
                                                   style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                                   onChange={value => {
                                                       setIntention(value)
                                                   }}/>
                                        </div>

                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>意向城市
                                            </div>
                                            <Select
                                                showSearch
                                                allowClear
                                                defaultValue={intentionCity}
                                                style={{marginBottom: 17, marginTop: 3, borderRadius: 5, width: 200}}
                                                onChange={value => {
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
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>电子邮箱
                                            </div>
                                            <Input defaultValue={email}
                                                   style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                                   onChange={value => {
                                                       setEmail(value)
                                                   }}/>
                                        </div>

                                        <div>
                                            <div style={{fontSize: 17, color: 'grey'}}>
                                                <span style={{color: 'red'}}>* </span>专业
                                            </div>
                                            <Input defaultValue={profession}
                                                   style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                                   onChange={value => {
                                                       setProfession(value)
                                                   }}/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div style={{fontSize: 17, color: 'grey'}}>
                                            <span style={{color: 'red'}}>* </span>教育经历
                                        </div>
                                        <TextArea
                                            autoSize={{minRows: 2}}
                                            defaultValue={educationExperience}
                                            style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                            onChange={value => {
                                                setEducationExperience(value)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div style={{fontSize: 17, color: 'grey'}}>
                                            项目经历（选填）
                                        </div>
                                        <TextArea
                                            autoSize={{minRows: 2}}
                                            defaultValue={project}
                                            style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                            onChange={value => {
                                                setProject(value)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div style={{fontSize: 17, color: 'grey'}}>
                                            实习经历（选填）
                                        </div>
                                        <TextArea
                                            autoSize={{minRows: 2}}
                                            defaultValue={internship}
                                            style={{marginBottom: 17, marginTop: 3, borderRadius: 5}}
                                            onChange={value => {
                                                setInternship(value)
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div style={{fontSize: 17, color: 'grey'}}>
                                            个人优势（选填）
                                        </div>
                                        <TextArea
                                            autoSize={{minRows: 2}}
                                            defaultValue={advantage}
                                            style={{marginTop: 3, borderRadius: 5}}
                                            onChange={value => {
                                                setAdvantage(value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{display: 'flex', margin: 15, float: 'right'}}>
                                <Button onClick={() => {
                                    navigate('/guide/student_resume', {state: user})
                                }} style={{
                                    border: '1px solid lightgrey',
                                    color: 'rgba(60,192,201,100%)',
                                    backgroundColor: 'white',
                                    width: 85,
                                    height: 35,
                                    fontSize: 16,
                                    borderRadius: 3,
                                    display: "flex",
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>返 回</Button>
                                <Button
                                    onClick={() => {
                                        if (name !== ''  &&
                                            name !== null  &&
                                            name !== undefined  &&
                                            sex !== ''  &&
                                            sex !==  null &&
                                            sex !==  undefined &&
                                            !isNaN(lowestSalary)  &&
                                            lowestSalary !==  undefined &&
                                            lowestSalary !==  0  &&
                                            lowestSalary !==  null  &&
                                            !isNaN(highestSalary)  &&
                                            highestSalary !== undefined &&
                                            highestSalary !==  0  &&
                                            highestSalary !==  null &&
                                            !isNaN(year) &&
                                            year !== undefined &&
                                            year !== 0  &&
                                            year !== null  &&
                                            phone !== ''  &&
                                            phone !== undefined &&
                                            phone !== null  &&
                                            email !== null  &&
                                            email !== undefined &&
                                            email !== ''  &&
                                            education !==  null&&
                                            education !==  undefined &&
                                            education !== '' &&
                                            intention !== null  &&
                                            intention !== undefined &&
                                            intention !== ''  &&
                                            intentionCity !== '' &&
                                            intentionCity !== undefined &&
                                            intentionCity !==  null &&
                                            profession !== '' &&
                                            profession !== undefined &&
                                            profession !== null &&
                                            educationExperience !== '' &&
                                            educationExperience !==  undefined &&
                                            educationExperience !== null) {
                                            axios({
                                                method: 'put',
                                                url: RequestURL+'/students/update-info',
                                                data: {
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
                                                res => {
                                                    if (res.status === 200) {
                                                        Message.info('完善信息成功！')
                                                        navigate('/main/home', {state: {...user, identity: 'student'}})
                                                    }
                                                },
                                                error => {
                                                    if (error.response) {
                                                        if (error.response.status === 404) {
                                                            Message.error('请求的资源错误！')
                                                        }
                                                        if (error.response.status === 500) {
                                                            Message.error('服务器内部错误！')
                                                        }
                                                    } else {
                                                        Message.error('Network Error!')
                                                    }
                                                }
                                            );
                                        } else {
                                            Message.error('仍有未填写项！');
                                        }
                                    }}
                                    style={{
                                        color: 'white',
                                        backgroundColor: 'rgba(60,192,201,100%)',
                                        marginLeft: 30,
                                        width: 85,
                                        height: 35,
                                        fontSize: 16,
                                        borderRadius: 3,
                                        display: "flex",
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>完 成</Button>
                            </div>
                        </>
                }
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
    )
}

export default SecondStudentGuidePage