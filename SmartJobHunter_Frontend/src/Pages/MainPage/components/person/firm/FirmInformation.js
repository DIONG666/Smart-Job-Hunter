import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Button, Card} from "@arco-design/web-react";
const data=[
    {
        name:'公司名称',
        job:'招聘岗位',
        description:'岗位描述',
        education:'学历要求',
        manager:'招聘经理',
        salary:'月薪',
        address:'招聘地址',
        link:'招聘链接'
    },
    {
        name:'公司名称',
        job:'招聘岗位',
        description:'岗位描述',
        education:'学历要求',
        manager:'招聘经理',
        salary:'月薪',
        address:'招聘地址',
        link:'招聘链接'
    },
    {
        name:'公司名称',
        job:'招聘岗位',
        description:'岗位描述',
        education:'学历要求',
        manager:'招聘经理',
        salary:'月薪',
        address:'招聘地址',
        link:'招聘链接'
    },
    {
        name:'公司名称',
        job:'招聘岗位',
        description:'岗位描述',
        education:'学历要求',
        manager:'招聘经理',
        salary:'月薪',
        address:'招聘地址',
        link:'招聘链接'
    },
    {
        name:'公司名称',
        job:'招聘岗位',
        description:'岗位描述',
        education:'学历要求',
        manager:'招聘经理',
        salary:'月薪',
        address:'招聘地址',
        link:'招聘链接'
    }
]

const FirmInformation = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate=useNavigate()
    const user=useLocation().state

    function ButtonGroup(){
        return (<div style={{display:'flex',alignItems:'center'}}>
                <Button type={"primary"} onClick={()=>{navigate('/main/firm_information/edit')}}>编辑</Button>
                <Button status={"danger"} type={"primary"} style={{marginLeft:10}}>删除</Button>
            </div>
        )}

    function CardList(){
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
                <div style={{fontSize:25,fontWeight:'bold',textAlign:'center'}}>
                    招聘信息
                </div>
                <Button onClick={()=>{navigate('/main/firm_information/edit',{state:user})}} style={{marginLeft:150,marginTop:10,color:'white',backgroundColor:'rgba(60,192,201,100%)',width:125,height:35,fontSize:16,borderRadius:3,display:"flex",justifyContent:'center',alignItems:'center'}}>新增招聘信息</Button>
                <div style={{overflow:'auto',maxHeight:'80%',position:'relative',left:'1%',marginLeft:150,marginTop:5,marginRight:150,display:'flex',flexWrap:'wrap',justifyContent:'flex-start'}}>
                    <CardList/>
                </div>
            </div>
        </>
    )
}

export default FirmInformation