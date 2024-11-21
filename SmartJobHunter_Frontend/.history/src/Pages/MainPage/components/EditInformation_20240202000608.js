import { Form } from "react-router-dom"

const EditInformation =()=>{
    return (
    <div style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:'10',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{backgroundColor:'white',width:1000,height:500,padding:"20px 40px 20px 40px"}}>
            <div style={{fontSize:23}}>
                编辑个人信息
            </div>
            <div>
                <Form layout="vertical">

                </Form>
            </div>
        </div>
    </div>
    )
}

export default EditInformation