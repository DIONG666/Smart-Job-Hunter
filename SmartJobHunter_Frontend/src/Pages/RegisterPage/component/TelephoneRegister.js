// 注册界面：通过手机号与短信验证码注册

import { Button, Checkbox, Form, Input, Message } from '@arco-design/web-react';
import {
  IconEmail,
  IconMessage,
  IconPhone,
  IconSafe,
  IconUser,
} from '@arco-design/web-react/icon';
import { useEffect, useRef, useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const FormItem = Form.Item;

const TelephoneRegister = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate=useNavigate()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formRef = useRef();

  useEffect(() => {
    // @ts-expect-error
    formRef.current.setFieldsValue({
      rate: 5,
    });
  }, []);

  const [verificationMessage, setVerificationMessage] = useState('获取验证码');

  // @ts-expect-error
  function getMessageVerificationCode(e) {
    if(!/^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/.test(phone)){
      Message.info('手机号格式错误！')
    } else {
      e.stopPropagation();
      const verification = document.getElementById('verification');
      if (verificationMessage === '获取验证码') {
        // @ts-expect-error
        verification.style.color = 'grey';
        let i = 60;

        const countDown = function () {
          setVerificationMessage(`${i}秒后重新获取`);
        };
        countDown();

        const timer = setInterval(() => {
          i--;
          setVerificationMessage(`${i}秒后重新获取`);
          if (i === 0) {
            clearInterval(timer);
            setVerificationMessage(`获取验证码`);
            // @ts-expect-error
            verification.style.color = '#0083ff';
          }
        }, 1000);

        axios({
          method: 'post',
          url: 'http://192.210.174.146:5000/sms/send',
          data: {
            "phone": phone,
          }
        }).then(
            res => {
              if (res.response.status === 200) {
                Message.info('验证码发送成功！')
              }
            },
            error => {
              Message.error('验证码发送失败，请稍后重试。');
            }
        )
      }
    }
  }

  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
  const [code,setCode]=useState('')

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
              onChange={value=>{setEmail(value)}}
              placeholder="请输入邮箱"
              prefix={<IconEmail />}
              style={{
                height: '50px',
                width: '125%',
              }}
          />
        </FormItem>

        <FormItem field="手机号" rules={[{ required: true }]}>
          <Input
              onChange={value=>{setPhone(value)}}
            placeholder="请输入手机号"
            prefix={<IconPhone />}
            style={{
              height: '50px',
              width: '125%',
            }}
          />
        </FormItem>

        <FormItem field="短信验证码" rules={[{ required: true }]}>
          <Input
              onChange={value=>{setCode(value)}}
            placeholder="请输入短信验证码"
            prefix={<IconMessage />}
            style={{
              height: '50px',
              width: '125%',
            }}
            suffix={
              <div
                id={'verification'}
                style={{
                  color: '#0083ff',
                  fontSize: '16px',
                }}
                onClick={getMessageVerificationCode}
              >
                {verificationMessage}
              </div>
            }
            id={'messageVerificationCode'}
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
                  await formRef.current.validate();
                  if(!/^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])d{8}$/.test(phone)){
                    Message.info('您输入的电话有误！')
                  } else {
                    axios({
                      method:'post',
                      url:'http://192.210.174.146:5000/users/register-with-sms',
                      data:{
                        "username": name,
                        "email": email,
                        "phone": phone,
                        "verificationCode": code
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
                            if(error.response.status===400){
                              Message.error('验证码错误！');
                            }
                            else if(error.response.status===409){
                              Message.error('该手机号/邮箱已注册！');
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
                  }
                } catch (_) {
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

export default TelephoneRegister;
