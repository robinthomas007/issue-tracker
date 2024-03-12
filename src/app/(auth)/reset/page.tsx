'use client'
import { useEffect, useState, useTransition } from "react";
import React from 'react';
import { Button, Checkbox, Form, type FormProps, Input, Layout, Card, Row, Col } from 'antd';
import { reset } from "@/actions/reset";
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import CarHeader from '../_components/carHeader'
import CardFooter from '../_components/cardFooter'
import CardMessage from '../_components/message'
import { useSearchParams } from "next/navigation";
import Link from 'next/link'

type FieldType = {
  email?: string;
};

const Reset: React.FC<FieldType> = () => {

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();

  const onFinish: FormProps<any>["onFinish"] = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values)
        .then((data) => {
          if (data?.error) {
            form.resetFields();
            setError(data.error);
          }

          if (data?.success) {
            form.resetFields();
            setSuccess(data.success);
          }
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
        <Card title={<CarHeader title="Reset Password" />} bordered={true} className='w-full shadow-xl'>
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

            <Form.Item >
              <Button disabled={isPending} type="primary" htmlType="submit" className='w-full mt-4'>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
          {(success || error) && <CardMessage message={success ? success : error} type={success ? 'success' : 'error'} />}
          <div className="text-center">
            <Link href='/login' className='text-blue-500 hover:text-blue-900'>Back to login</Link>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default Reset;