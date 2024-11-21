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
    Progress
} from '@arco-design/web-react';
import { IconPlus, IconEdit } from '@arco-design/web-react/icon';
import { useState } from 'react';

const FormItem = Form.Item;

const EditInformation =()=>{
    const [file, setFile] = useState();
    const cs = `arco-upload-list-item${file && file.status === 'error' ? ' is-error' : ''}`;

    return (
    <div style={{position:'absolute',top:0,bottom:0,left:0,right:0,backgroundColor:'rgba(0,0,0,0.3)',zIndex:'10',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{backgroundColor:'white',width:1000,height:450,padding:"30px 50px 30px 50px",borderRadius:5}}>
            <div style={{fontSize:23,width:'100%'}}>
                编辑个人信息
            </div>
            <Form layout="vertical" style={{width:'100%',height:'85%',marginTop:15,position:'relative'}}>
                <div style={{width:'30%',position:'absolute',left:0,bottom:0}}>
                    <Form.Item
                        label='上传头像'
                        field='头像'
                    >
                            <Upload
                                style={{border:'red 1px solid',height:80}}
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
                                <div className={cs} style={{width:80,height:80}}>
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
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                    </div>
                    <div style={{width:'30%',position:'absolute',left:'35%',bottom:0}}>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                    </div>
                    <div style={{width:'30%',position:'absolute',left:'70%',bottom:0}}>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
                        <FormItem label='Username'>
                            <Input placeholder='please enter your username...' />
                        </FormItem>
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