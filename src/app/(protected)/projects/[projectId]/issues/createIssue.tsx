import React, { useState, useEffect } from 'react';
import { Space, Modal, Typography, Button, Form, Select } from 'antd';
import { Input } from 'antd';
import axios from 'axios';
import { IssueProps } from './IssueList'
import { useParams } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user';
import toast from 'react-hot-toast';
import FileUpload from '@/components/common/fileUpload'
import Image from 'next/image'
import { handleFileSubmit } from '@/components/common/handleFileupload'
import { IoMdCloseCircle } from "react-icons/io";
import { deletAttachment } from '@/actions/upload'
import CustomSelect from '@/components/common/CustomSelect'

const { TextArea } = Input;
const { Text } = Typography;

interface IssueModalProps {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  issue: IssueProps | null,
}

const CreateIssueModal: React.FC<IssueModalProps> = ({ isModalOpen, handleOk, handleCancel, issue }) => {

  const [form] = Form.useForm()
  const params = useParams<{ projectId: string }>()
  const [files, setFiles] = useState([]);
  const [imageUrls, setimageUrls] = useState<Array<string>>([])
  const [signedUrls, setSignedUrls] = useState<Array<any>>([])
  const [uploading, setUploading] = useState(false)
  const [assignee, setAssignee] = useState<any>({});
  const [reporter, setReporter] = useState<any>({});
  const [searchAssignee, setSearchAssignee] = useState<string>();
  const [searchReporter, setSearchReporter] = useState<string>();

  const user = useCurrentUser()

  useEffect(() => {
    if (issue && Object.keys(issue).length !== 0) {
      setSearchReporter(issue.reporter?.email)
      setSearchAssignee(issue.assignee?.email)

      form.setFieldsValue({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        priority: issue.priority,
        reporter: issue.reporter?.email,
        assignee: issue.assignee?.email
      })
      if (issue.Attachment.length > 0) {
        const attachments = issue.Attachment.map((attach: any) => {
          return { contentType: attach.contentType, filename: attach.filename, attachmentId: attach.id, url: attach.url }
        })
        setSignedUrls(attachments)
        setimageUrls(attachments.map((at: any) => at.url))
      }
    } else {
      form.setFieldsValue({ reporter: user?.email })
      setSearchReporter(user?.email!)
    }
  }, [issue]);

  const addIssue = async (values: any) => {
    const data = { ...values, reporterId: user?.id, imageUrls: signedUrls }
    if (issue?.id) {
      try {
        await axios.patch(`/api/projects/${params.projectId}/issues/${issue.id}`, data)
          .then((res) => {
            if (res.data)
              toast.success('Issue Updated Successfully!')
          }).catch((e) => {
            toast.error('')
          })
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        await axios.post(`/api/projects/${params.projectId}/issues`, data)
          .then((res) => {
            if (res.data)
              toast.success('Issue Created Successfully!')
          }).catch((e) => {
            toast.error('')
          })
      } catch (e) {
        console.log(e)
      }
    }
    handleOk()
  }

  const deleteImage = async (url: string) => {
    const attachment = issue?.Attachment.find((att: any) => att.url === url)
    if (attachment) {
      const response = await deletAttachment(attachment.id, 'issue')
      if (response.data) {
        setimageUrls(imageUrls.filter((imageUrl) => imageUrl !== url));
        setSignedUrls(signedUrls.filter((file) => file.url !== url))
      }
    } else {
      setimageUrls(imageUrls.filter((imageUrl) => imageUrl !== url));
    }
  }

  useEffect(() => {
    const fileLength = files.length
    let signedUrlsLength = signedUrls.length

    if (issue?.Attachment && issue.Attachment.length > 0) {
      signedUrlsLength = signedUrlsLength - issue.Attachment.length
    }

    if (fileLength > 0 && signedUrlsLength > 0) {
      if (fileLength === signedUrlsLength) {
        const allValues = form.getFieldsValue();
        addIssue(allValues)
      }
    }
  }, [signedUrls])

  const onFinish = async (values: any) => {

    if (files.length > 0) {
      handleFileSubmit(files, setSignedUrls, setUploading)
    } else {
      addIssue(values);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleAsigneeSearch = (newValue: string) => {
    setSearchAssignee(newValue)
  };

  const handleRepoterSearch = (newValue: string) => {
    setSearchReporter(newValue)
  };

  return (
    <Modal title={<div className='text-center mb-5'>Create Issue</div>}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button form="createIssueForm" key="submit" htmlType="submit" type="primary">
          Save
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Form
        name="createIssueForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        preserve={false}
        labelCol={{ span: 4 }}
        form={form}
        labelAlign='left'
      >
        <div className="flex flex-col space-y-4"></div>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input your issue title!' }]}
          className="flex flex-col space-y-4 mb-0"
          wrapperCol={{ span: 12 }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select your Issue type!' }]}
          wrapperCol={{ span: 12 }}
        >
          <Select
            // style={{ width: 280 }}
            options={[
              { value: 'BUG', label: 'BUG' },
              { value: 'TASK', label: 'TASK' },
              { value: 'ENHANCEMENT', label: 'ENHANCEMENT' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: 'Please input your Issue priority!' }]}
          wrapperCol={{ span: 12 }}
        >
          <Select
            // style={{ width: 280 }}
            options={[
              { value: 'HIGH', label: 'HIGH' },
              { value: 'MEDIUM', label: 'MEDIUM' },
              { value: 'LOW', label: 'LOW' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Assignee"
          name="assignee"
          className='text-left'
          wrapperCol={{ span: 12 }}
        >
          <CustomSelect
            value={assignee}
            search={searchAssignee}
            onSearch={handleAsigneeSearch}
            placeholder='search assignee'
            notFoundContent={<p>Not Found</p>}
          />
        </Form.Item>

        <Form.Item
          label="Reporter"
          name="reporter"
          className='text-left'
          wrapperCol={{ span: 12 }}
        >
          <CustomSelect
            value={reporter}
            search={searchReporter}
            onSearch={handleRepoterSearch}
            placeholder='search reporter'
            notFoundContent={<p>Not Found</p>}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input your Issue description!' }]}
        // wrapperCol={{ span: 12 }}

        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
      <div className='flex items-center'>
        <label>Attachments</label>
        <div className='ml-2'>
          <FileUpload setimageUrls={setimageUrls} setFiles={setFiles} uploading={uploading} />
        </div>
      </div>
      <div className='grid grid-cols-3 gap-1 ml-32'>
        {imageUrls.map((img: string, i: number) => (
          <div key={i} className='relative group'>
            <span className='absolute top-1 cursor-pointer left-44 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <IoMdCloseCircle className='text-lg' onClick={() => deleteImage(img)} />
            </span>
            <img alt="user" src={img} width={200} height={200} className='h-full' />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CreateIssueModal;