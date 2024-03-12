'use client'
import React from 'react';
import { useState, useTransition } from "react";
import { Button, Checkbox, Form, type FormProps, Input, Layout, Card, Row, Col } from 'antd';
const { Content } = Layout
import { register } from "@/actions/signup";
import CarHeader from '../_components/carHeader'
import CardFooter from '../_components/cardFooter'
import CardMessage from '../_components/message'

type FieldType = {
  name?: string;
  password?: string;
  email?: string;
};


const Signup: React.FC = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm();

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
            form.resetFields();
            setError(data.error);
          }

          if (data?.success) {
            form.resetFields();
            setSuccess(data.success);
          }
        });
    });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row justify={'center'} className='w-full'>
      <Col span={6} >
        <Card title={<CarHeader title="Register" />} bordered={true} className='w-full shadow-xl'>
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item<FieldType>
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
              labelCol={{ span: 24 }}
              style={{ marginBottom: 0 }}
              className='font-semibold'
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              labelCol={{ span: 24 }}
              style={{ marginBottom: 0 }}
              className='font-semibold'
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              labelCol={{ span: 24 }}
              style={{ marginBottom: 10 }}
              className='font-semibold'
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className='w-full my-4'>
                Register
              </Button>
            </Form.Item>
          </Form>
          {(success || error) && <CardMessage message={success ? success : error} type={success ? 'success' : 'error'} />}
          <CardFooter link="/login" />
        </Card>
      </Col>
    </Row >
  )
}

export default Signup;