import React, { useState, useEffect } from 'react';
import { Space, Modal, Typography, Button, Form, Select } from 'antd';
import { Input } from 'antd';
import axios from 'axios';
import { ProjectProps } from './page'
const { TextArea } = Input;
const { Text } = Typography;
import CustomSelect from '@/components/common/CustomSelect'
import { useCurrentUser } from '@/hooks/use-current-user';
import toast from 'react-hot-toast';

interface ProjectModalProps {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  project: ProjectProps | null
}

const CreateIssueModal: React.FC<ProjectModalProps> = ({ isModalOpen, handleOk, handleCancel, project }) => {

  const [search, setSearch] = useState<string>();
  const [assignee, setAssignee] = useState<string>();
  const user = useCurrentUser()

  const [form] = Form.useForm()

  useEffect(() => {
    if (project && Object.keys(project).length !== 0) {
      form.setFieldsValue({
        id: project.id, name: project.name, description: project.description, users: (project.users || []).map((d: any) => ({
          value: d.email,
          label: d.name,
        }))
      })
    } else {
      form.setFieldsValue({ users: [{ value: user?.email, label: user?.name }] })
    }
  }, [project]);

  const onFinish = async (values: any) => {

    const userEmails = values.users.map((user: any) => user.value ? user.value : user)
    if (project?.id) {
      try {
        await axios.patch(`/api/projects/${project.id}`, { ...values, users: userEmails })
          .then((res) => {
            if (res.data)
              toast.success('Project Updated Successfully!')
          }).catch((e) => {
            toast.error('')
          })
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        await axios.post('/api/projects', { ...values, users: userEmails })
          .then((res) => {
            if (res.data)
              toast.success('Project Created Successfully!')
          }).catch((e) => {
            toast.error('')
          })
      } catch (e) {
        console.log(e)
      }
    }
    handleOk()
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleAsigneeSearch = (newValue: string) => {
    setSearch(newValue)
  };

  const handleAssigneeChange = (newValue: string) => {
    console.log(newValue)
  };

  const handleDeselect = (value: string) => {
    const allValues = form.getFieldsValue();
    if (!project) {
      if (value === user?.email) {
        toast.error("Can't Remove the user as you are creating the project! ");
        form.setFieldsValue({ ...allValues, users: [...allValues.users, value] })
      }
    } else {
      if (user?.id === project.createdById) {
        if (value === user?.email) {
          toast.error("Can't Remove the user as you are created the project!");
          form.setFieldsValue({ ...allValues, users: [...allValues.users, value] })
        }
      }
    }
  }


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

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your Project name!' }]}
        // className="flex flex-col space-y-4 mb-0"
        >
          <Input placeholder='Project Name' />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input your Issue description!' }]}
        >
          <TextArea rows={6} />
        </Form.Item>

        <Form.Item
          label="Users"
          name="users"
          className='text-left'
        >
          <CustomSelect
            value={assignee}
            search={search}
            mode='multiple'
            onSearch={handleAsigneeSearch}
            onChange={handleAssigneeChange}
            handleDeselect={handleDeselect}
            placeholder='search users'
            notFoundContent={<p>Not Found</p>}
          />

        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateIssueModal;