import React, { useEffect, useState } from 'react'
import { Space, Button, Form, Input, Card } from 'antd';
import { useCurrentUser } from '@/hooks/use-current-user';
import Image from 'next/image'
import { MentionsInput, Mention } from 'react-mentions';
import FileUpload from '@/components/common/fileUpload'
import { createComment, updateComment, deleteComment } from '@/actions/comments'
import toast from 'react-hot-toast';
import axios from 'axios';
import { handleFileSubmit } from '@/components/common/handleFileupload'
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { deletAttachment } from '@/actions/upload'

const IssueActionForm = ({ editIssues, users }: { editIssues: any, users: any }) => {
  const user = useCurrentUser()
  const [value, setValue] = useState('');
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [imageUrls, setimageUrls] = useState<Array<string>>([])
  const [signedUrls, setSignedUrls] = useState<Array<any>>([])
  const [uploading, setUploading] = useState(false)
  const [editComment, setEditComment] = useState<any>(null)

  useEffect(() => {
    fetchComments(editIssues.id)
  }, [editIssues])

  const fetchComments = async (issueId: number) => {
    try {
      try {
        await axios.get(`/api/comments/${issueId}`)
          .then((res) => {
            setComments(res.data)
            setValue('')
          }).catch((err) => {
            console.log(err)
          })
      } catch (e) {
        console.log(e)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e: any) => {
    setValue(e.target.value);
  };

  const addComment = () => {
    if (editComment?.id) {
      updateComment(editComment.id, value, user?.id, editIssues.id, signedUrls)
        .then((data: any) => {
          toast.success(data.success)
          setimageUrls([])
          setSignedUrls([])
          setFiles([])
          fetchComments(editIssues.id)
        }).catch(error => {
          toast.success(error.message)
        })
    } else {
      createComment(value, user?.id, editIssues.id, signedUrls)
        .then((data: any) => {
          toast.success(data.success)
          setimageUrls([])
          setSignedUrls([])
          setFiles([])
          fetchComments(editIssues.id)
        }).catch(error => {
          toast.success(error.message)
        })
    }
  }

  const deleteImage = async (url: string) => {
    const attachment = editComment?.Attachment.find((att: any) => att.url === url)
    if (attachment) {
      const response = await deletAttachment(attachment.id, 'comment')
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
    if (editComment?.Attachment && editComment.Attachment.length > 0) {
      signedUrlsLength = signedUrlsLength - editComment.Attachment.length
    }

    if (fileLength > 0 && signedUrlsLength > 0) {
      if (fileLength === signedUrlsLength) {
        addComment()
      }
    }
  }, [signedUrls])

  const handleSubmit = async () => {
    if (files.length > 0) {
      handleFileSubmit(files, setSignedUrls, setUploading)
    } else {
      addComment();
    }
  };

  const handleEditComment = (comment: any) => {
    setEditComment(comment)
    setValue(comment.comments)
    if (comment.Attachment.length > 0) {
      const urls = comment.Attachment.map((at: any) => at.url)
      setimageUrls(urls)
      const attachments = comment.Attachment.map((attach: any) => {
        return { contentType: attach.contentType, filename: attach.filename, attachmentId: attach.id, url: attach.url }
      })
      setSignedUrls(attachments)
    }
  }

  const handleDeleteComment = (comment: any) => {
    deleteComment(comment.id)
      .then((data: any) => {
        toast.success(data.success)
        setimageUrls([])
        setSignedUrls([])
        setFiles([])
        fetchComments(editIssues.id)
      }).catch(error => {
        toast.success(error.message)
      })
  }

  const renderComment = () => {
    return comments.map((comment: any) => {
      const input = comment.comments
      const output = input.replace(/\[(.*?)\]\((.*?)\)/g, '<span class="text-blue-500">$1</span>');
      const jsx = <div dangerouslySetInnerHTML={{ __html: output }} />;

      return (
        <div key={comment.id} className='my-3'>
          <div className='flex items-start'>
            <div>
              <Image style={{ border: 1, borderRadius: 100 }} className='border-r-8 mr-2' alt="user" loader={() => comment.User.image} src={comment.User.image} width={30} height={30} />
            </div>
            <div className='font-semibold'>{comment.User.name}</div>
            <div className='ml-5 text-gray-500'>12 Hours ago</div>
            <div className='ml-2 flex text-lg'>
              <MdOutlineEdit className='text-lg mr-2' onClick={() => handleEditComment(comment)} />
              <MdDeleteForever className='text-lg' onClick={() => handleDeleteComment(comment)} />
            </div>
          </div>
          <div className='ml-10'>{jsx}</div>
          <div className='grid grid-cols-3'>
            {comment.Attachment.map((attachment: any) => {
              return (
                <div key={attachment.id} className='ml-10 my-5'>
                  <Image style={{ border: 1 }} className='mr-2' alt="user" loader={() => attachment.url} src={attachment.url} width={200} height={200} />
                </div>
              )
            })}
          </div>
        </div>
      )
    })
  }

  return (
    <div className='mb-10'>
      <div className='mt-5'>
        <label className='font-semibold'>Comments</label>
        <div>
          {renderComment()}
        </div>
        <div className='flex items-center my-2'>
          <Image style={{ border: 1, borderRadius: 100 }} className='border-r-8 mr-2' alt="user" loader={() => user?.image!} src={user?.image!} width={30} height={30} />
          <div className='border w-full p-2'>
            <MentionsInput
              value={value}
              className='comment-mention-users'
              onChange={handleInputChange}
              placeholder="Type '@' to mention..."
              style={{ width: '100%', minHeight: 60 }}
            >
              <Mention
                trigger="@"
                data={(users || []).map((d: any) => ({
                  id: d.email,
                  display: d.name,
                  image: d.image
                }))}
                style={{ backgroundColor: '#3e71bd', color: '#fff' }}
                renderSuggestion={(suggestion: any, search: any, highlightedDisplay: any) => {
                  return (
                    <div className='flex items-center m-2'>
                      <Image style={{ border: 1, borderRadius: 100 }} className='border-r-8 mr-2' alt="user" loader={() => suggestion.image} src={suggestion.image} width={30} height={30} />
                      <span className=''>{suggestion.display}</span>
                    </div>
                  )
                }}
              />
            </MentionsInput>
          </div>
        </div>
        <div>
          <FileUpload setimageUrls={setimageUrls} setFiles={setFiles} uploading={uploading} />
        </div>
        <div className='grid grid-cols-3 gap-1 ml-10'>
          {imageUrls.map((img: string, i: number) => (
            <div key={i} className='relative group'>
              <span className='absolute top-1 cursor-pointer left-44 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <IoMdCloseCircle className='text-lg' onClick={() => deleteImage(img)} />
              </span>
              <Image alt="user" loader={() => img} src={img} width={200} height={200} className='h-full' />
            </div>
          ))}
        </div>
        <div className='flex items-center justify-end'>
          <Button className='ml-2' type='primary' onClick={handleSubmit}>Comment</Button>
        </div>

      </div>
    </div>
  )
}

export default IssueActionForm
