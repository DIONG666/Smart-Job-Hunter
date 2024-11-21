// 注册界面

import './style/RegisterPage.css';
import { Select, Tabs, Typography } from '@arco-design/web-react';
import TelephoneRegister from './component/TelephoneRegister';
import AccountRegister from './component/AccountRegister';
import {Link} from "react-router-dom";

const { TabPane } = Tabs;
const { Option } = Select;
const options = ['简体中文', 'English'];
const RegisterPage = () => {
  return (
    <div className={'RegisterPage'}>
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
      <div className={'registerCard'}>
        <div className={'registerImage'}>
        </div>
        <div className={'registerInformationCard'}>
          <Tabs
            defaultActiveTab="accountRegister"
            size={'large'}
            type={'text'}
            style={{
              position: 'absolute',
              left: '10%',
              top: '8%',
              right: '10%',
              bottom: '5%',
              textAlign: 'center',
            }}
          >
            <TabPane key="accountRegister" title="账号密码注册">
              <Typography.Paragraph
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                }}
              />

              <hr />

              <AccountRegister />
            </TabPane>

            <TabPane key="telephoneRegister" title="短信验证码注册">
              <Typography.Paragraph
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                }}
              />

              <hr />

              <TelephoneRegister />
            </TabPane>
          </Tabs>
          <div
            style={{
              fontSize: '16px',
              position: 'absolute',
              bottom: '2%',
              left: '31%',
            }}
          >
            已有账号？
            <Link to={'/signIn'} style={{ textDecoration: 'none' }}>
              立即登录！
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
