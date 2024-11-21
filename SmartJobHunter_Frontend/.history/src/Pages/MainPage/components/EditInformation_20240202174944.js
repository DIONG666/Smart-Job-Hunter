import {
    Form,
    Input,
    Select,
    Button,
    Radio,
    InputNumber,
    Upload,
    DatePicker,
    Progress,
    Message
} from '@arco-design/web-react';
import { IconPlus, IconEdit } from '@arco-design/web-react/icon';
import {useRef, useEffect, useState} from 'react';
import { useNavigate} from "react-router-dom";

const Option = Select.Option;
const options1 = ['求职者','企业'];
const options2 = ['专科','本科','研究生','博士'];
const options3 = [2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030];
const FormItem = Form.Item;

const EditInformation =()=>{
    const [file, setFile] = useState();
    const cs = `arco-upload-list-item${file && file.status === 'error' ? ' is-error' : ''}`;

    const formRef = useRef();
    // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // @ts-expect-error
    formRef.current.setFieldsValue({
      rate: 5,
    });
  }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate=useNavigate()
    
    const [identity,setIdentity]=useState(false)

    function MyIdentity(){
        if(identity) {
            return (
                <div>
                    <FormItem label='企业名称' rules={[{ required: true }]}>
                        <Input style={{width:'75%'}}/>
                    </FormItem>
                    <FormItem label='企业地址' rules={[{ required: true }]}>
                        <Input style={{width:'75%'}}/>
                    </FormItem>
                    <FormItem label='招聘链接' rules={[{ required: true }]}>
                        <Input style={{width:'75%'}}/>
                    </FormItem>
            </div>
            )
        }
        else {
            return (
                <div style={{ height:246, overflow: 'auto' }}>
                    <FormItem label='学校名称' rules={[{ required: true }]}>
                        <Input style={{width:'79%'}}/>
                    </FormItem>
                    <FormItem label='学历' rules={[{ required: true }]}>
                        <Select style={{ width: '79%' }}>
                            {options2.map((option, index) => (
                                <Option key={option} value={option}>{option}</Option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem label='专业' rules={[{ required: true }]}>
                        <Input style={{width:'79%'}}/>
                    </FormItem>
                    <FormItem label='毕业年份' rules={[{ required: true }]}>
                        <Select style={{ width: '79%' }}>
                            {options3.map((option, index) => (
                                <Option key={option} value={option}>{option}</Option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem label='期望职位' rules={[{ required: true }]}>
                        <Input style={{width:'79%'}}/>
                    </FormItem>
                </div>
            )
        }
    }

    return (
    <div style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:'10',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{backgroundColor:'white',width:1000,height:450,padding:"30px 50px 50px 50px",borderRadius:5}}>
            <div style={{fontSize:23,width:'100%'}}>
                编辑个人信息
            </div>
            <Form ref={formRef} layout="vertical" style={{width:'100%',height:'85%',marginTop:15,position:'relative'}}>
                <div style={{width:'30%',position:'absolute',left:0,bottom:0}}>
                    <Form.Item
                        label='上传头像'
                        field='头像'
                    >
                            <Upload
                                style={{width:80,height:80}}
                                action='/'
                                fileList={file ? [file] : []}
                                showUploadList={false}
                                onChange={(_, currentFile) => {
                                    setFile({
                                        ...currentFile,
                                        url: URL.createObjectURL(currentFile.originFile),
                                    });
                                }}
                                onProgress={(currentFile) => {
                                    setFile(currentFile);
                                }}
                            >
                                <div className={cs} style={{width:80,height:80,position:'relative',bottom:12}}>
                                    {file && file.url ? (
                                        <div className='arco-upload-list-item-picture custom-upload-avatar'>
                                            <img src={file.url} />
                                            <div className='arco-upload-list-item-picture-mask'>
                                                <IconEdit />
                                            </div>
                                            {file.status === 'uploading' && file.percent < 100 && (
                                                <Progress
                                                    percent={file.percent}
                                                    type='circle'
                                                    size='mini'
                                                    style={{
                                                        position: 'absolute',
                                                        left: '50%',
                                                        top: '50%',
                                                        transform: 'translateX(-50%) translateY(-50%)',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className='arco-upload-trigger-picture'>
                                            <div className='arco-upload-trigger-picture-text'>
                                                <IconPlus />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Upload>
                        </Form.Item>
                        <FormItem label='姓名' rules={[{ required: true }]}>
                            <Input style={{width:'75%'}}/>
                        </FormItem>
                        <FormItem label='性别' rules={[{ required: true }]}>
                            <Radio.Group defaultValue={'男'} name='button-radio-group'>
                                {['男', '女',].map((item) => {
                                    return (
                                        <Radio key={item} value={item}>
                                            {({ checked }) => {
                                                return (
                                                    <Button tabIndex={-1} key={item} style={checked?{width:80,background:'rgba(60,192,201,100%)',color:'white'}:{width:80,background:'white',border:'solid 1px grey'}}>
                                                        {item}
                                                    </Button>
                                                );
                                            }}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </FormItem>
                        <FormItem label='出生日期' rules={[{ required: true }]}>
                            <DatePicker style={{ width: '75%' }}/>
                        </FormItem>
                    </div>
                    <div style={{width:'30%',position:'absolute',left:'35%',bottom:0}}>
                        <FormItem label='年龄' rules={[{ required: true }]}>
                            <InputNumber min={1} style={{ width: '75%' }}/>
                        </FormItem>
                        <FormItem label='电话' rules={[{ required: true }]}>
                            <Input style={{ width: '75%' }}/>
                        </FormItem>
                        <FormItem label='邮箱'>
                            <Input style={{ width: '75%' }}/>
                        </FormItem>
                        <FormItem label='微信号'>
                            <Input style={{ width: '75%' }}/>
                        </FormItem>
                    </div>
                    <div style={{width:'30%',position:'absolute',left:'70%',bottom:0}}>
                        <FormItem label='我的身份' rules={[{ required: true }]}>
                            <Select 
                                style={{ width: '75%' }}
                                defaultValue={'求职者'}
                                onChange={(value) =>{
                                    if(value==='求职者'){
                                        setIdentity(false)
                                    }
                                    else if(value==='企业'){
                                        setIdentity(true)
                                    }
                                }}
                            >
                                {options1.map((option, index) => (
                                    <Option key={option} value={option}>{option}</Option>
                                ))}
                            </Select>
                        </FormItem>
                        <MyIdentity />
                    </div>
                    <FormItem style={{position:'absolute',bottom:'-18%',textAlign:'right'}}>
                        <Button style={{width:80}} onClick={()=>{navigate('/main/personal')}}>取 消</Button>
                        <Button 
                            onClick={async () => {
                                console.log('0');
                                console.log(formRef.current);
                                if (formRef.current) {
                                    try {
                                        await formRef.current.validate();
                                        Message.info('校验通过，提交成功！');
                                        console.log('1');
                                    } catch (_) {
                                        Message.error('校验失败，请检查字段！');
                                        console.log('2');
                                    }
                                }
                            }}
                            style={{width:80,color:'white',marginLeft:30,marginRight:50,background:'rgba(60,192,201,100%)'}}
                        >
                            完 成
                        </Button>
                    </FormItem>
                </Form>
        </div>
    </div>
    )
}

export default EditInformation