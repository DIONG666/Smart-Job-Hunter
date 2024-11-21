// 登录界面

import './style/SignInPage.css';
import { Select, Divider, Tabs, Typography } from '@arco-design/web-react';
import AccountSignIn from './component/AccountSignIn';
import VerificationCodeSignIn from './component/VerificationCodeSignIn';
import {Link} from "react-router-dom";

const { TabPane } = Tabs;

const { Option } = Select;
const options = ['简体中文', 'English'];
const SignInPage = () => {
  return (
    <div className={'background'}>
      <Select
        placeholder="选择语言"
        defaultValue="简体中文"
        className={'language'}
      >
        {options.map(option => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
      <div className={'signInCard'}>
        <div className={'signInCardImage'}>
        </div>
        <div
          style={{
            position: 'absolute',
            left: '73%',
            top: '8%',
            right: '3%',
            bottom: '5%',
            textAlign: 'center',
          }}
        >
          <Tabs defaultActiveTab="accountSignIn" size={'large'} type={'text'} style={{height:'90%',width:'100%'}}>
            <TabPane key="accountSignIn" title="账号登录">
              <Typography.Paragraph
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                }}
              />
              <Divider />
              <AccountSignIn />
            </TabPane>

            <TabPane key="verificationCodeSignIn" title="验证码登录">
              <Typography.Paragraph
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                }}
              />
              <Divider />
              <VerificationCodeSignIn />
            </TabPane>
          </Tabs>
            <div className="accountWrapper">
                <div className="box">
                    <a href="about:blank" style={{ textDecoration: 'none' }}>
                        <div className="item1">忘记密码</div>
                    </a>
                </div>
                <div className="box">
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <div className="item2">注册账号</div>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
