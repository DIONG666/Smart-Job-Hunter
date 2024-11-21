import {
    Form,
    AutoComplete,
    Input,
    Select,
    TreeSelect,
    Button,
    Checkbox,
    Switch,
    Radio,
    Cascader,
    Message,
    InputNumber,
    Rate,
    Slider,
    Upload,
    DatePicker,
    Modal,
} from '@arco-design/web-react';
const FormItem = Form.Item;

const EditInformation =()=>{

    return (
    <div style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:'10',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{backgroundColor:'white',width:1000,height:500,padding:"20px 40px 20px 40px"}}>
            <div style={{fontSize:23,width:'100%'}}>
                编辑个人信息
            </div>
            <Form layout="vertical" style={{display:'flex',justifyContent:'space-around',width:'100%'}}>
                    <div style={{width:'30%'}}>
                        {/* <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem> */}1
                    </div>
                    <div style={{width:'30%'}}>
                        {/* <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem> */}2
                    </div>
                    <div style={{width:'30%'}}>
                        {/* <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem> */}3
                    </div>
                </Form>
        </div>
    </div>
    )
}

export default EditInformation