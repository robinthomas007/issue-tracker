import React, { useEffect } from 'react'
import { Space, Modal, Form, Input } from 'antd';
const { TextArea } = Input;
const IssueActionForm = ({ editIssues }: { editIssues: any }) => {

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ title: editIssues?.title, description: editIssues?.description })
  }, [editIssues, form])

  return (
    <div>
      <Form
        name="createIssueForm"
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        preserve={false}
        labelCol={{ span: 5 }}
        initialValues={{
          title: editIssues?.title,
          description: editIssues?.description
        }}
        form={form}
      >
        <div className="flex flex-col space-y-4"></div>

        <Form.Item
          name="title"
          rules={[{ required: true, message: 'Please input your issue title!' }]}
          className="flex flex-col space-y-4 mb-0"
        >
          <Input placeholder='Issue Title' />
        </Form.Item>

        <Form.Item
          name="description"
          rules={[{ required: true, message: 'Please input your Issue description!' }]}
        >
          <TextArea rows={8} placeholder='Issue description' />
        </Form.Item>
      </Form>
    </div>
  )
}

export default IssueActionForm
