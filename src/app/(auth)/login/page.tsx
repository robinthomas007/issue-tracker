'use client'
import React from 'react';
import { Button, Checkbox, Form, type FormProps, Input, Layout, Card, Row, Col } from 'antd';
import { login } from "@/actions/login";
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
const { Content } = Layout

type FieldType = {
  // username?: string;
  password?: string;
  email?: string;
};

const onFinish: FormProps<any>["onFinish"] = (values) => {
  console.log('Success:', values);
  login(values).then((data) => {

    console.log(data, "datadatadatadatadatadata")

  }).catch((e) => console.log(e, "Something went wrong"));
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const onSocialMediaClick = (provider: 'google' | 'github') => {
  signIn(provider, {
    callbackUrl: DEFAULT_LOGIN_REDIRECT
  })
}

const Login: React.FC = () => (
  <Layout>
    <Content className='bg-blue-200 min-h-full' style={{
      padding: 24,
      minHeight: '100%',
    }}>
      <Row justify={'center'} className='mt-40'>
        <Col span={7}>
          <Card title="Register" bordered={true} className='w-full shadow-xl'>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item<FieldType>
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <div>
              <Button onClick={() => onSocialMediaClick('google')}>Google</Button>
              <Button onClick={() => onSocialMediaClick('github')}>Github</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Content>
  </Layout>
);

export default Login;