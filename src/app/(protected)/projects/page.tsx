'use client'
import React, { useEffect, useState } from 'react'
import { Row, Layout, Col, Button, Typography, Table, Dropdown, Space, Avatar } from 'antd';
import CreateProjectModal from './createProject'
import axios from 'axios';
import type { TableProps } from 'antd';
import Link from 'next/link'
import Image from 'next/image'
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import AddUsersToProjectPopover from '@/components/projects/addUsersToProjectPopover'
import { format } from 'date-fns';
import GetProjectUsers from '@/components/projects/getProjectUsers'
const { Title } = Typography
const { Content } = Layout

export interface ProjectProps {
  createdById: any;
  id: number,
  name: string,
  description: string,
  users: any,
  createdAt: string,
  updatedAt: string
  issues: any
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editProject, setEditProject] = useState<ProjectProps | null>(null)
  const [projects, setProjects] = useState<Array<ProjectProps>>([])

  const columns: TableProps<ProjectProps>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (_, project) => {
        return <Link href={`/projects/${project.id}/issues`}>{project.name}</Link>
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 600
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      width: 300,
      render: (_, project) => {
        const len = project.users.length
        return <div className='flex items-center w-full'>
          <GetProjectUsers project={project} />
          <div className='ml-auto'>
            <AddUsersToProjectPopover project={project} afterSaveFn={fetchProjects} />
          </div>
        </div>
      }
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (_, project) => {
        return <span>{format(project.createdAt, 'dd/MM/yyyy')}</span>
      }
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (_, project) => {
        return <span>{format(project.updatedAt, 'dd/MM/yyyy')}</span>
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, project) => (
        <Space size="middle">
          <MdOutlineEdit onClick={() => handleEdit(project)} />
          <MdDeleteOutline />
        </Space>
      )
    }
  ];

  const handleEdit = (project: ProjectProps) => {
    setEditProject(project)
    setIsModalOpen(true)
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  useEffect(() => {

  }, [])

  const fetchProjects = async () => {
    try {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data)
      } catch (e) {
        console.log(e)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOk = () => {
    fetchProjects();
    setIsModalOpen(false)
    setEditProject(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditProject(null)
  }

  return (
    <Layout>
      <Content className='bg-white' style={{
        padding: 24,
        minHeight: '100%',
      }}>
        {isModalOpen && <CreateProjectModal project={editProject} isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />}

        <Row justify={'space-between'} className='py-4'>
          <Col>
            <Title level={2}>Projects</Title>
          </Col>
          <Col>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>Create Project</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={projects || []} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
