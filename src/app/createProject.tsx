import React, { useState, useEffect } from 'react';
import { Space, Modal, Typography, Button, Form } from 'antd';
import { Input } from 'antd';
import axios from 'axios';
import { ProjectProps } from './page'
const { TextArea } = Input;
const { Text } = Typography;

interface ProjectModalProps {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  project: ProjectProps | null
}

const CreateIssueModal: React.FC<ProjectModalProps> = ({ isModalOpen, handleOk, handleCancel, project }) => {

  const [form] = Form.useForm()

  useEffect(() => {
    if (project && Object.keys(project).length !== 0) {
      form.setFieldsValue({ id: project.id, name: project.name, description: project.description })
    }
  }, [project]);

  const onFinish = async (values: any) => {
    if (project?.id) {
      try {
        await axios.patch(`/api/projects/${project.id}`, values)
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        await axios.post('/api/projects', values)
      } catch (e) {
        console.log(e)
      }
    }
    handleOk()
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal title="Create Project"
      open={isModalOpen}
      onCancel={handleCancel}
      className='text-center'
      footer={[
        <Button form="createProjectForm" key="submit" htmlType="submit" type="primary">
          Save
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        name="createProjectForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        preserve={false}
        labelCol={{ span: 5 }}
        form={form}
      >
        <div className="flex flex-col space-y-4"></div>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your Project name!' }]}
          className="flex flex-col space-y-4 mb-0"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input your Issue description!' }]}
        >
          <TextArea rows={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateIssueModal;