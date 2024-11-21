import {Link, useLocation, useNavigate} from "react-router-dom";
import {Input, Button, Steps, Select, Message} from "@arco-design/web-react";
import {useEffect, useState} from "react";
import {IconMinus} from "@arco-design/web-react/icon";
import axios from "axios";
const TextArea = Input.TextArea;
const options = ['大专','本科','硕士','博士'];
const Option=Select.Option

const EditFirmInformation=()=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate=useNavigate()
    const user=useLocation().state

    const [name,setName]=useState('')
    const [job,setJob]=useState('')
    const [description,setDescription]=useState('')
    const [education,setEducation]=useState('')
    const [manager,setManager]=useState('')
    const [lowestSalary,setLowestSalary]=useState(0)
    const [highestSalary,setHighestSalary]=useState(0)
    const [address,setAddress]=useState('')
    const [link,setLink]=useState('')

    useEffect(() => {
        axios({
            method:'get',
            url:'http://192.210.174.146:5000/companies/get-info/'+user.user_id,
        }).then(
            res=>{
                setName(res.data.name)
                setJob(res.data.job)
                setDescription(res.data.description)
                setEducation(res.data.education)
                setManager(res.data.manager)
                setLowestSalary(res.data.lowestSalary)
                setHighestSalary(res.data.highestSalary)
                setAddress(res.data.address)
                setLink(res.data.link)
            },
            error=>{
                if(error.response){
                    Message.error('数据请求失败！')
                } else {
                    Message.error('Network Error!')
                }
            }
        )
    }, []);

    return (
        <>
            <div style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:'10',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{backgroundColor:'white',width:850,height:450,padding:"30px 50px 10px 50px",borderRadius:5}}>
                    <div style={{fontSize:25,fontWeight:'bold'}}>
                        请填写公司信息和招聘要求
                    </div>
                    <div style={{marginTop:20,display:'flex',justifyContent:'space-between'}}>
                        <div style={{width:'45%'}}>
                            <div>
                                <div style={{fontSize:17,color:'grey'}}>
                                    <span style={{color:'red'}}>* </span>公司名称
                                </div>
                                <Input style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setName(value)}}/>
                            </div>

                            <div>
                                <div style={{fontSize:17,color:'grey'}}>
                                    <span style={{color:'red'}}>* </span>招聘职位
                                </div>
                                <Input style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setJob(value)}}/>
                            </div>

                            <div>
                                <div style={{fontSize:17,color:'grey'}}>
                                    <span style={{color:'red'}}>* </span>职位描述
                                </div>
                                <TextArea autoSize={{ minRows: 1, maxRows: 6 }} style={{ marginBottom:15,marginTop:5,borderRadius:5 }} onChange={value=>{setDescription(value)}}/>
                            </div>

                            <div>
                                <div style={{fontSize:17,color:'grey'}}>
                                    <span style={{color:'red'}}>* </span>最低学历要求
                                </div>
                                <Select
                                    style={{ marginBottom:17,marginTop:3,borderRadius:5,width:200}}
                                    onChange={value=>{setEducation(value)}}
                                >
                                    {options.map((option, index) => (
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
                                    <span style={{color:'red'}}>* </span>招聘经理
                                </div>
                                <Input style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setManager(value)}}/>
                            </div>

                            <div>
                                <div style={{fontSize:17,color:'grey'}}>
                                    <span style={{color:'red'}}>* </span>月薪
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
                                    <span style={{color:'red'}}>* </span>面试地址
                                </div>
                                <Input style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setAddress(value)}}/>
                            </div>

                            <div>
                                <div style={{fontSize:17,color:'grey'}}>
                                    <span style={{color:'red'}}>* </span>招聘链接
                                </div>
                                <Input style={{ marginBottom:17,marginTop:3,borderRadius:5 }} onChange={value=>{setLink(value)}}/>
                            </div>
                        </div>
                    </div>
                    <div style={{display:'flex',marginTop:30,float:'right'}}>
                        <Button onClick={()=>{navigate('/main/firm_information',{state:user})}} style={{width:85,height:35,fontSize:16,borderRadius:3}}>取 消</Button>
                        <Button
                            onClick={()=>{
                                if(name.trim()!==''&&job.trim()!==''&&description.trim()!==''&&education.trim()!==''&&manager.trim()!==''&&lowestSalary!==0&&highestSalary!==0&&address.trim()!==''&&link.trim()!==''){
                                    axios({
                                        method:'post',
                                        url:'http://192.210.174.146:5000/companies/create-info',
                                        data:{
                                            "userId": user.user_id,
                                            "name": name,
                                            "job": job,
                                            "description": description,
                                            "education": education,
                                            "manager": manager,
                                            "salary": `${lowestSalary}-${highestSalary}K`,
                                            "lowestSalary":lowestSalary,
                                            "highestSalary":highestSalary,
                                            "address": address,
                                            "link": link
                                        }
                                    }).then(
                                        res=>{
                                            if (res.status=== 200){
                                                Message.info('修改成功！')
                                                navigate('/main/firm_information',{state:user})
                                            }
                                        },
                                        error=>{
                                            if(error.response){
                                                if (error.response.status===500){
                                                    Message.error('服务器错误！')
                                                } else {
                                                    Message.error('网络错误！请稍后重试。')
                                                }
                                            } else {
                                                Message.error('Network Error！')
                                            }
                                        }
                                    )
                                } else {
                                    Message.error('仍有未填写信息！')
                                }
                            }}
                            style={{color:'white',backgroundColor:'rgba(60,192,201,100%)',marginLeft:30,width:85,height:35,fontSize:16,borderRadius:3,display:"flex",justifyContent:'center',alignItems:'center'}}
                        >
                            完 成
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditFirmInformation