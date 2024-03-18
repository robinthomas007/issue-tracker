'use client'
import React, { useEffect, useState } from 'react'
import { Card, Typography } from 'antd';
import { Row, Layout, Col, Button, Dropdown } from 'antd';
import CreateIssueModal from './createIssue'
import ViewIssueModal from './viewIssue';
import { FaEdit } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { useDrag, useDrop } from 'react-dnd';
import { Empty } from 'antd';
import axios from 'axios';
import Stats from "@/components/stats";
import { Space, Modal, Form, Input } from 'antd';
import IssueDetails from '@/components/issues/issueDetails'
import IssueActionForm from '@/components/issues/issueActionForm'
import Image from 'next/image'
import AddUsersToProjectPopover from '@/components/projects/addUsersToProjectPopover'
import { ProjectProps } from '../../page'
import GetProjectUsers from '@/components/projects/getProjectUsers'
import toast from 'react-hot-toast';

const { TextArea } = Input;
const { Text } = Typography;

const { Title } = Typography;

const { Sider } = Layout

export interface AssigneeReporterProps {
  name: string,
  email: string,
  image: string | null
}

export interface IssueProps {
  id: number,
  title: string,
  description: string,
  status: string
  reporter: AssigneeReporterProps,
  assignee: AssigneeReporterProps
  reporterId: string,
  assigneeId: string,
  Attachment: any,
}

const DraggableListItem = ({ item, type, editIssue, handleIssueView }: any) => {

  const [, drag] = useDrag({
    type: '*',
    item: item,
  });

  const cardHeader = <div className='flex text-slate-600 justify-between align-middle'>
    <span>{item.title}</span>
    <span className='flex justify-start align-middle'>
      <MdOutlineEdit onClick={() => editIssue(item)} />
    </span>
  </div>

  return (
    <Card size="small" ref={drag} key={item.id} title={cardHeader} bordered={false} className='min-h-40 my-2 max-h-40' style={{ marginTop: 5, padding: 0 }}>
      <p className='overflow-auto max-h-28 cursor-pointer' onClick={() => handleIssueView(item)}>
        {item.description}
      </p>
      {item.assignee && <div className='flex items-center mt-3rounded absolute bottom-2 w-32'>
        <span><Image loader={() => item.assignee.image} width={30} height={10} className='rounded-full hover:border border-green-400' src={item.assignee.image} alt='user' /></span>
      </div>}
    </Card>
  );
};

function IssueList({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectProps | null>(null)
  const [issues, setIssues] = useState<Array<IssueProps>>([])
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editIssues, setEditIssues] = useState<IssueProps | null>(null)

  const [form] = Form.useForm()

  useEffect(() => {
    fetchIssues();
  }, [])

  const fetchIssues = async () => {
    try {
      try {
        const response = await axios.get(`/api/projects/${projectId}/issues`);
        setProject(response.data)
        setIssues(response.data.issues)
      } catch (e) {
        console.log(e)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleOk = () => {
    fetchIssues();
    setIsModalOpen(false)
    setEditIssues(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditIssues(null)
  }

  const handleCancelView = () => {
    setIsViewModalOpen(false)
    setEditIssues(null)
  }

  const editIssue = (issue: IssueProps) => {
    setEditIssues(issue)
    setIsModalOpen(true)
  }

  const handleIssueView = (issue: IssueProps) => {
    console.log("came")
    setEditIssues(issue)
  }

  const renderIssueCard = (status: string) => {
    const filteredIssue = issues.filter(issue => issue.status === status)
    if (filteredIssue.length === 0)
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
        <span>
          Drag to add issue
        </span>
      } />;
    return filteredIssue.map((issue) => {
      return <DraggableListItem
        key={issue.id}
        item={issue}
        type={status}
        editIssue={editIssue}
        handleIssueView={handleIssueView}
      />
    })
  }

  const updateStatus = async (status: string, item: IssueProps) => {
    try {
      await axios.patch(`/api/projects/${projectId}/issues/${item.id}/status`, { status: status })
        .then((res) => {
          if (res.data)
            toast.success(`Issue status changed`)
        }).catch((e) => {
          toast.error('')
        })
      fetchIssues()
    } catch (e) {
      console.log(e)
    }
  }

  const [, selected] = useDrop({
    accept: '*',
    drop: (item: IssueProps) => {
      updateStatus('SELECTED', item)
    }
  });

  const [, open] = useDrop({
    accept: '*',
    drop: (item: IssueProps) => {
      updateStatus('OPEN', item)
    }
  });

  const [, inprogress] = useDrop({
    accept: '*',
    drop: (item: IssueProps) => {
      updateStatus('IN_PROGRESS', item)
    }
  });

  const [, test] = useDrop({
    accept: '*',
    drop: (item: IssueProps) => {
      updateStatus('TESTING', item)
    }
  });

  const [, close] = useDrop({
    accept: '*',
    drop: (item: IssueProps) => {
      updateStatus('CLOSED', item)
    }
  });

  const statuses = [
    { refElm: selected, status: 'SELECTED', label: 'Analysis' },
    { refElm: open, status: 'OPEN', label: 'To Do' },
    { refElm: inprogress, status: 'IN_PROGRESS', label: 'In Progress' },
    { refElm: test, status: 'TESTING', label: 'Testing' },
    { refElm: close, status: 'CLOSED', label: 'Done' }
  ];

  const updatingIssue = issues.find((issue) => issue.id === editIssues?.id)

  return (
    <>
      {isModalOpen && <CreateIssueModal issue={editIssues} isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />}
      {isViewModalOpen && <ViewIssueModal issue={editIssues} isModalOpen={isViewModalOpen} handleCancel={handleCancelView} />}
      <Row justify={'space-between'} className='pb-4'>
        <Col>
          <Title level={2}>{project?.name}</Title>
        </Col>
        <Col>
          <Button type='primary' onClick={() => { setEditIssues(null); setIsModalOpen(true) }}>Create Issue</Button>
        </Col>
      </Row>

      <Row justify={'start'} className='pb-2 items-center'>
        <Col span={16}>
          <div className='flex justify-start'>
            <Input className='max-w-80' placeholder='Search' />
            <div className='flex items-center ml-6'>
              <GetProjectUsers project={project!} />
            </div>
            <div className='ml-auto mr-4'>
              <AddUsersToProjectPopover project={project!} afterSaveFn={fetchIssues} />
            </div>
          </div>
        </Col>
        <Col span={11}>

        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Stats issues={issues} />
          <div className="grid grid-cols-5 gap-2 mr-4">
            {statuses.map((s, i) => {
              return <div key={s.status} ref={s.refElm} style={{ minHeight: '600px' }} className="w-full max-w bg-gray-100 border border-gray-200 rounded-lg shadow sm:p-2 min-h-30 h-30">
                <p className='text-gray-600 font-semibold px-1 py-1 uppercase'>{s.label}</p>
                {renderIssueCard(s.status)}
              </div>
            })}
          </div>
        </Col>
        {editIssues && <Col span={8}>
          <div className="grid grid-cols-1 gap-2 mb-6">
            <div className='col-span-2 border-l-2 px-4'>
              <Card title={editIssues?.title}>
                <p>{editIssues?.description}</p>
                <div className='grid grid-cols-2 gap-4'>
                  {updatingIssue?.Attachment.map((attachment: any) => {
                    return (
                      <div key={attachment.id} className=' my-5'>
                        <Image style={{ border: 1 }} className='' alt="user" loader={() => attachment.url} src={attachment.url} width={400} height={200} />
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
            <div className='col-span-2 border-l-2 px-4'>
              <IssueDetails issue={updatingIssue!} projectId={project?.id!} setEditIssues={setEditIssues} fetchIssues={fetchIssues} />
            </div>
          </div>
          <div className='col-span-2 border-l-2 p-4'>
            <IssueActionForm editIssues={editIssues} users={project?.users} />
          </div>
        </Col>}
      </Row>
    </>
  )
}

export default IssueList