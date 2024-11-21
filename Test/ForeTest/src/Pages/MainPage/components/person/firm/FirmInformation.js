import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Button, Card, Message} from "@arco-design/web-react";
import {useEffect, useState} from "react";
import axios from "axios";

const FirmInformation = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate=useNavigate()
    const user=useLocation().state

    const [data,setData]=useState([])
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        axios({
            method:'get',
            url:'http://127.0.0.1:5000/companies/get-all-info/'+user.user_id,
        }).then(
            res=>{
                setData(res.data)
                setLoading(false)
            },
            error=>{
                if(error.response){
                    Message.error('数据请求失败！')
                } else {
                    Message.error('Network Error!')
                }
                setLoading(false)
            }
        )
    },[])

    function ButtonGroup(){
        return (<div style={{display:'flex',alignItems:'center'}}>
                <Button type={"primary"} onClick={()=>{navigate('/main/firm_information/edit',{state:user})}}>编辑</Button>
                <Button status={"danger"} type={"primary"} style={{marginLeft:10}}>删除</Button>
            </div>
        )}

    function CardList(){
        if(data.length===0) return null
        return data.map((value, index)=>{
            return (
                <Card
                    style={{width:'47%',marginRight:'1%',marginLeft:'1%',marginTop:20,fontSize:15}}
                    title={value.job}
                    hoverable
                    extra={<ButtonGroup />}
                >
                    <div>学历要求：{value.education}</div>
                    <div>薪资：{value.salary}</div>
                    <div>招聘经理：{value.manager}</div>
                </Card>
            )
        })
    }

    return (
        <>
            <Outlet/>
            <div style={{position:'absolute',zIndex:1,top:0,bottom:0,left:'15%',right:'15%',backgroundColor:'white',padding:'30px 0px 30px 0px'}}>
                {
                    loading?
                        <Card style={{width:'100%',height:'100%'}} bordered={false} loading={loading}/>
                        :
                        <>
                            <div style={{fontSize:25,fontWeight:'bold',textAlign:'center'}}>
                                招聘信息
                            </div>
                            <Button onClick={()=>{navigate('/main/firm_information/edit',{state:user})}} style={{marginLeft:150,marginTop:10,color:'white',backgroundColor:'rgba(60,192,201,100%)',width:125,height:35,fontSize:16,borderRadius:3,display:"flex",justifyContent:'center',alignItems:'center'}}>新增招聘信息</Button>
                            <div style={{overflow:'auto',maxHeight:'80%',position:'relative',left:'1%',marginLeft:150,marginTop:5,marginRight:150,display:'flex',flexWrap:'wrap',justifyContent:'flex-start'}}>
                                <CardList/>
                            </div>
                        </>
                }
            </div>
        </>
    )
}

export default FirmInformation