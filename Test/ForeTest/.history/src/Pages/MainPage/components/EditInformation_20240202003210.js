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
            <Form layout="vertical" style={{width:'100%',height:'85%',marginTop:15,position:'relative'}}>
                <div style={{width:'30%',height:'100%',position:'absolute',left:0,top:0}}>
                    <Form.Item
                        label='上传头像'
                        field='头像'
                    >
                        <Upload
                            style={{borderRadius:20}}
                            listType='picture-card'
                            name='avatar'
                            action='/'
                            onPreview={(file) => {
                                Modal.info({
                                    title: 'Preview',
                                    content: (
                                        <img src={file.url || URL.createObjectURL(file.originFile)} style={{maxWidth: '100%',}}></img>
                                    ),
                                });
                            }}
                        />
        </Form.Item>
                    </div>
                    <div style={{width:'30%',height:'100%',position:'absolute',left:'35%',top:0}}>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                    </div>
                    <div style={{width:'30%',height:'100%',position:'absolute',left:'70%',top:0}}>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                    </div>
                </Form>
        </div>
    </div>
    )
}

export default EditInformation