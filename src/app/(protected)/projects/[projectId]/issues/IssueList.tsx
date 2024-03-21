'use client'
import React, { useEffect, useState } from 'react'
import { Card, Typography } from 'antd';
import { Row, Layout, Col, Button, Tag } from 'antd';
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
import { FcHighPriority } from "react-icons/fc";
import { FcLowPriority } from "react-icons/fc";
import { FcMediumPriority } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import { deleteIssueApi } from '@/actions/issues'

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
  type: any;
  priority: any;
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

const DraggableListItem = ({ item, type, editIssue, handleIssueView, project, deleteIssue }: any) => {

  const [, drag] = useDrag({
    type: '*',
    item: item,
  });

  const prefix = project.name.substring(0, 3).toUpperCase();
  const typeColor: any = { BUG: '#cd201f', TASK: "#87d068", ENHANCEMENT: '#108ee9' }
  const cardHeader = <div className='flex text-slate-600 justify-between align-middle items-center group'>
    <span className=''>{item.priority === 'LOW' ? <FcLowPriority className='text-lg' /> : item.priority === 'MEDIUM' ? <FcMediumPriority className='text-lg' /> : <FcHighPriority className='text-lg' />}</span>
    <span className='mx-2'>{prefix}-{item.id}</span>
    <span className='mr-auto  opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
      <MdOutlineEdit className='text-lg' onClick={() => editIssue(item)} />
    </span>
    <span className='flex justify-start align-middle opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
      <MdDeleteForever className='text-lg ml-1' onClick={() => deleteIssue(item)} />
    </span>
  </div>

  return (
    <Card size="small" ref={drag} key={item.id} title={cardHeader} onClick={() => handleIssueView(item)} bordered={false} className='min-h-40 my-2 max-h-40 bg-cyan-100' style={{ marginTop: 5, padding: 0 }}>
      <p className='overflow-auto max-h-28 cursor-pointer'>
        {item.title}
      </p>
      {item.assignee && <div className='flex items-center justify-between mt-3rounded absolute bottom-2 left-2 w-full'>
        <span>
          <img width={30} height={10} className='rounded-full hover:border border-green-400' src={item.assignee.image} alt='user' />
        </span>
        <span className='ml-auto mr-2'>
          <Tag color={typeColor[item.type]}>
            {item.type}
          </Tag>
        </span>
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
        setEditIssues(response.data.issues[0])
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
    setEditIssues(issue)
  }

  const deleteIssue = async (issue: IssueProps) => {
    const confrimDelete = confirm('Are you sure you want to delete?')
    if (confrimDelete) {
      const res = await deleteIssueApi(issue.id)
      if (res.data) {
        toast.success(res.success)
        setEditIssues(null)
        fetchIssues()
      }
    }
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
        project={project}
        deleteIssue={deleteIssue}
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

  const filterIssues = (e: any) => {
    const search = e.target.value
    const searchedIssues = project?.issues.filter((is: any) => is.title?.includes(search) || is.description?.includes(search))
    setIssues(searchedIssues)
    if (search.length === 0) {
      console.log(project, ":project")
      if (project?.issues)
        setIssues(project?.issues!)
    }
  }

  const updatingIssue = issues.find((issue) => issue.id === editIssues?.id)

  return (
    <>
      {isModalOpen && <CreateIssueModal issue={editIssues} isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />}
      {isViewModalOpen && <ViewIssueModal issue={editIssues} isModalOpen={isViewModalOpen} handleCancel={handleCancelView} />}
      <Row justify="space-between" className="pb-4">
        <Col>
          <Title level={2}>{project?.name}</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => { setEditIssues(null); setIsModalOpen(true) }}>Create Issue</Button>
        </Col>
      </Row>

      <Row justify="start" className="pb-2 items-center">
        <Col xs={24} sm={16}>
          <div className="flex justify-start">
            <Input className="max-w-80" placeholder="Search" onChange={(e) => filterIssues(e)} />
            <div className="flex items-center ml-6">
              <GetProjectUsers project={project!} />
            </div>
            <div className="ml-auto mr-4">
              <AddUsersToProjectPopover project={project!} afterSaveFn={fetchIssues} />
            </div>
          </div>
        </Col>
        <Col xs={0} sm={8}></Col> {/* Placeholder for responsiveness */}
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={16}>
          <Stats issues={issues} />
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mr-4">
            {statuses.map((s, i) => (
              <div key={s.status} ref={s.refElm} style={{ minHeight: '600px' }} className="w-full max-w bg-gray-100 border border-gray-200 rounded-lg shadow p-2">
                <p className="text-gray-600 font-semibold px-1 py-1 uppercase">{s.label}</p>
                {renderIssueCard(s.status)}
              </div>
            ))}
          </div>
        </Col>
        {editIssues && (
          <Col xs={24} sm={8}>
            <div className="grid grid-cols-1 gap-2 mb-6">
              <div className="border-l-2 px-4">
                <Card title={editIssues?.title}>
                  <p>{editIssues?.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {updatingIssue?.Attachment.map((attachment: any) => (
                      <div key={attachment.id} className="my-5">
                        <img style={{ border: 1 }} className="" alt="user" src={attachment.url} width={400} height={200} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div className="border-l-2 px-4">
                <IssueDetails issue={updatingIssue!} projectId={project?.id!} setEditIssues={setEditIssues} fetchIssues={fetchIssues} />
              </div>
            </div>
            <div className="border-l-2 p-4">
              <IssueActionForm editIssues={editIssues} users={project?.users} />
            </div>
          </Col>
        )}
      </Row>
    </>
  )
}

export default IssueList