'use client'

import { useState } from 'react'
import axios from 'axios';
import type { UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, Form, Card } from 'antd';
import { MdAttachFile } from "react-icons/md";
import toast from 'react-hot-toast';
import { createAttachment } from '@/actions/upload'
import { BeatLoader } from "react-spinners";

export default function FileUpload({ setimageUrls, setFiles, uploading }: { setimageUrls: any, setFiles: any, uploading: boolean }) {
  const [form] = Form.useForm();

  // const handleSubmit = async (info: any) => {

  //   if (!info.file) {
  //     alert('Please select a file to upload.')
  //     return
  //   }
  //   setUploading(true)
  //   const toastId = toast.loading('Uploading...');

  //   await axios.post('/api/upload', { filename: info.file.name, contentType: info.file.type })
  //     .then((res) => {
  //       if (res) {
  //         console.log(res, "resresresresresresresresres")
  //       }
  //     }).catch((e) => {
  //       toast.error('')
  //     })

  //   const response = await fetch(
  //     process.env.NEXT_PUBLIC_BASE_URL + '/api/upload',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ filename: info.file.name, contentType: info.file.type }),
  //     }
  //   )

  //   if (response.ok) {
  //     const { url, fields } = await response.json()
  //     const formData = new FormData();
  //     Object.entries(fields).forEach(([key, value]) => {
  //       formData.append(key, value as string)
  //     })
  //     formData.append('file', info.file);

  //     try {
  //       const uploadResponse = await fetch(url, {
  //         method: 'POST',
  //         body: formData,
  //       })
  //       if (uploadResponse.ok) {
  //         toast.dismiss(toastId);
  //         createAttachment(info.file.name, `${uploadResponse.url}${fields.key}`, info.file.type)
  //           .then((res: any) => {
  //             toast.success(res.success)
  //             setimageUrls((prevImageUrls: string[]) => [...prevImageUrls, res.data.url])
  //             setUploading(false)
  //           }).catch(error => {
  //             toast.success(error.message)
  //             setUploading(false)
  //           })
  //       } else {
  //         toast.dismiss(toastId);
  //         console.error('S3 Upload Error:', uploadResponse)
  //         toast.success('Upload failed.')
  //         setUploading(false)
  //       }
  //     } catch (error) {
  //       console.log("error", error)
  //       setUploading(false)
  //     }
  //   } else {
  //     alert('Failed to get pre-signed URL.')
  //     setUploading(false)
  //   }
  // }

  const handleChange = (info: any) => {
    if (info.file) {
      setimageUrls((prevImageUrls: string[]) => [...prevImageUrls, URL.createObjectURL(info.file)])
      setFiles((prev: any) => [...prev, info.file])
    }
  }

  return (
    <main className='my-5 pl-10'>
      <div className='flex items-center justify-between'>
        <Upload
          name="file"
          onChange={handleChange}
          showUploadList={false}
          maxCount={1}
          beforeUpload={() => false}
        >
          <MdAttachFile className='text-2xl cursor-pointer' />
        </Upload>
      </div>
      {uploading && <div className='flex items-center justify-center'>
        <BeatLoader className='my-4' />
      </div>}
    </main>
  )
}