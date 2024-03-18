import React, { useState, useEffect } from 'react';
import { Space, Modal, Typography, Button, Form } from 'antd';
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

const { TextArea } = Input;
const { Text } = Typography;

interface IssueModalProps {
  isModalOpen: boolean,
  handleOk: () => void,
  handleCancel: () => void,
  issue: IssueProps | null
}

const CreateIssueModal: React.FC<IssueModalProps> = ({ isModalOpen, handleOk, handleCancel, issue }) => {

  const [form] = Form.useForm()
  const params = useParams<{ projectId: string }>()
  const [files, setFiles] = useState([]);
  const [imageUrls, setimageUrls] = useState<Array<string>>([])
  const [signedUrls, setSignedUrls] = useState<Array<any>>([])
  const [uploading, setUploading] = useState(false)

  const user = useCurrentUser()

  useEffect(() => {
    if (issue && Object.keys(issue).length !== 0) {
      form.setFieldsValue({ id: issue.id, title: issue.title, description: issue.description })
      if (issue.Attachment.length > 0) {
        const attachments = issue.Attachment.map((attach: any) => {
          return { contentType: attach.contentType, filename: attach.filename, attachmentId: attach.id, url: attach.url }
        })
        setSignedUrls(attachments)
        setimageUrls(attachments.map((at: any) => at.url))
      }
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

  return (
    <Modal title="Create Issue"
      open={isModalOpen}
      onCancel={handleCancel}
      className='text-center'
      width={900}
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
        labelCol={{ span: 5 }}
        form={form}
      >
        <div className="flex flex-col space-y-4"></div>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input your issue title!' }]}
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
      <div className='flex items-center ml-20'>
        <label>Attachments</label>
        <div>
          <FileUpload setimageUrls={setimageUrls} setFiles={setFiles} uploading={uploading} />
        </div>
      </div>
      <div className='grid grid-cols-3 gap-1 ml-44'>
        {imageUrls.map((img: string, i: number) => (
          <div key={i} className='relative group'>
            <span className='absolute top-1 cursor-pointer left-44 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <IoMdCloseCircle className='text-lg' onClick={() => deleteImage(img)} />
            </span>
            <Image alt="user" loader={() => img} src={img} width={200} height={200} className='h-full' />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CreateIssueModal;