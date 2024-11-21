// 注册界面：通过账号密码注册

import { Button, Checkbox, Form, Input, Message } from '@arco-design/web-react';
import {IconEmail, IconUnlock, IconUser} from '@arco-design/web-react/icon';
import {useEffect, useRef, useState} from 'react';
import '../style/RegisterPage.css';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const FormItem = Form.Item;

const AccountRegister = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate=useNavigate()
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const formRef = useRef();

    const [name,setName]=useState('')
    const [password,setPassword]=useState('')
    const [again,setAgain]=useState('')
    const [email,setEmail]=useState('')

  useEffect(() => {
    // @ts-expect-error
    formRef.current.setFieldsValue({
      rate: 5,
    });
  }, []);

  return (
    <div
      style={{
        marginTop: '20px',
      }}
    >
      <Form autoComplete="off" ref={formRef}>
        <FormItem field="用户名" rules={[{ required: true }]}>
          <Input
              onChange={value=>{setName(value)}}
            placeholder="请输入用户名"
            prefix={<IconUser />}
            style={{
              height: '50px',
              width: '125%',
            }}
          />
        </FormItem>

          <FormItem field="邮箱" rules={[{ required: true }]}>
              <Input
                  onChange={value => {setEmail(value)}}
                  placeholder="请输入邮箱"
                  prefix={<IconEmail />}
                  style={{
                      height: '50px',
                      width: '125%',
                  }}
              />
          </FormItem>

        <FormItem field="密码" rules={[{ required: true }]}>
          <Input
              onChange={value => {setPassword(value)}}
            placeholder="请输入密码（由6-20个字符组成）"
            prefix={<IconUnlock />}
            style={{
              height: '50px',
              width: '125%',
            }}
          />
        </FormItem>

        <FormItem field="确认密码" rules={[{ required: true }]}>
          <Input
              onChange={value => {setAgain(value)}}
            placeholder="请再次输入密码"
            prefix={<IconUnlock />}
            style={{
              height: '50px',
              width: '125%',
            }}
          />
        </FormItem>

        <FormItem
          style={{ textAlign: 'left',position:'relative',bottom:10 }}
          field="readme"
          triggerPropName="checked"
          rules={[{ type: 'boolean', true: true }]}
        >
          <Checkbox>我已阅读并同意相关协议</Checkbox>
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            style={{
              fontSize: '20px',
              height: '45px',
              width: '125%',
              borderRadius: '5px',
              position: 'relative',
              bottom: '15px',
            }}
            onClick={async () => {
              if (formRef.current) {
                try {
                    if(again===password){
                        await formRef.current.validate();
                        axios({
                            method:'post',
                            url:'http://192.210.174.146:5000/users/register-with-account',
                            data:{
                                "username": name,
                                "email": email,
                                "password": password,
                            }
                        }).then(
                            res=>{
                                if(res.status===201){
                                    Message.info('注册成功！');
                                    navigate('/signIn');
                                }
                            },
                            error=>{
                                if(error.response){
                                    if(error.response.status===409){
                                        Message.error('该账号已注册！');
                                    }
                                    else {
                                        Message.error('Network Error!');
                                    }
                                }
                                else {
                                    Message.error('Network Error!');
                                }
                            }
                        )
                    } else {
                        Message.error('两次输入的密码不同！')
                    }
                } catch (_) {
                    console.log(formRef.current.getFieldsError());
                    Message.error('仍有未填写字段！');
                }
              }
            }}
          >
            注 册
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default AccountRegister;
