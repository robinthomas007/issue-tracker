'use client'
import { useEffect, useState, useTransition } from "react";
import React from 'react';
import { Button, Checkbox, Form, type FormProps, Input, Layout, Card, Row, Col } from 'antd';
import { login } from "@/actions/login";
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import CarHeader from '../_components/carHeader'
import CardFooter from '../_components/cardFooter'
import CardMessage from '../_components/message'
import { useSearchParams } from "next/navigation";
import Link from 'next/link'

type FieldType = {
  // username?: string;
  password?: string;
  email?: string;
};

export default function Page() {

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.resetFields();
            setError(data.error);
          }

          if (data?.success) {
            form.resetFields();
            setSuccess(data.success);
          }

          // if (data?.twoFactor) {
          //   setShowTwoFactor(true);
          // }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row justify={'center'} className='w-full'>
      <Col span={6}>
        <Card title={<CarHeader title="Login" />} bordered={true} className='w-full shadow-xl'>
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              labelCol={{ span: 24 }}
              style={{ marginBottom: 0 }}
              className='font-semibold'
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              labelCol={{ span: 24 }}
              style={{ marginBottom: 0 }}
              className='font-semibold'
            >
              <Input.Password />
            </Form.Item>
            <Button type="link" style={{ padding: 0 }}>
              <Link href='/reset' className='text-blue-900'>Reset password</Link>
            </Button>

            <Form.Item >
              <Button disabled={isPending} type="primary" htmlType="submit" className='w-full mt-4'>
                Login
              </Button>
            </Form.Item>
          </Form>
          {(success || error) && <CardMessage message={success ? success : error} type={success ? 'success' : 'error'} />}
          <CardFooter link="/signup" />
        </Card>
      </Col>
    </Row>
  )
}