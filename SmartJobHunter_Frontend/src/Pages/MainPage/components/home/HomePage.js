import {Button, Input} from "@arco-design/web-react";
import {Link, useLocation} from "react-router-dom";

const HomePage=()=>{
    const user=useLocation().state
    return <>
        <div style={{display:'flex',marginTop:30,justifyContent:'center'}}>
            <Input  placeholder='搜索职位、公司'
                    style={{ backgroundColor:'white',width: 650,height:45, border:'solid 1px rgba(60,192,201,100%)',borderRadius:'5px 0px 0px 5px'}}/>
            <Button style={{color:'white',backgroundColor:'rgba(60,192,201,100%)',width:100,height:45,fontSize:17,borderRadius:'0px 5px 5px 0px'}}>搜 索</Button>
        </div>
        <div  style={{textAlign:"center",marginTop:100}}>
            <Link to={'/guide/identity'} state={user}>新手指导</Link>
            <br/><br/>
            <Link to={'/signIn'}>登录界面</Link>
            <br/><br/>
            <Link to={'/main/firm_information'} state={user}>企业信息界面</Link>
        </div>
    </>
}

export default HomePage