import { Outlet} from "react-router-dom";
import {Layout} from "@arco-design/web-react";
import logo from './images/logo.png'
const Header = Layout.Header;
const Content = Layout.Content;

const GuidePage=()=>{
    return (<>
        <Layout style={{ position:'absolute',top:0,bottom:0,left:0,right:0 }}>
            <Header style={{width:'100%',height:'10%',backgroundColor:'rgba(56,56,56,100%)',display:'flex',alignItems:'center'}}>
                <div style={{height:'100%',width:'15%',display:'flex',justifyContent:'center',alignItems:'center',fontSize:30,color:'rgba(60,192,201,100%)'}}>
                    <img src={logo} alt={'logo'} height={'70%'}/>
                </div>
            </Header>
            <Content style={{width:'100%',position:'relative'}}>
                <Outlet />
            </Content>
        </Layout>
    </>)
}

export default GuidePage