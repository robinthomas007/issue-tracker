'use client'
import React, { useEffect, useState } from 'react'
import { Row, Layout, Col, Button, Typography, Table, Dropdown, Space } from 'antd';
import CreateProjectModal from './createProject'
import axios from 'axios';
import type { TableProps } from 'antd';
import Link from 'next/link'
import Image from 'next/image'
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { CiUser } from "react-icons/ci";

const { Title } = Typography
const { Content } = Layout

export interface ProjectProps {
  id: number,
  name: string,
  description: string,
  users: any
}


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
    render: (_, project) => {
      return <Link href={`/projects/${project.id}/issues`}>{project.name}</Link>
    }
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },

  {
    title: 'Users',
    dataIndex: 'users',
    key: 'users',
    className: "flex min-h-18",
    width: 300,
    render: (_, project) => {
      const len = project.users.length
      if (len === 0) {
        return <div className='min-h-11'>
          <Button icon={<CiUser />} > Add Users</Button>
        </div>
      }
      const imgCount = 1
      const items = project.users.slice(imgCount).map((user: any) => ({
        'key': user.id,
        'label': <div className='flex items-center'>
          <span><Image loader={() => user.image} width={40} height={10} className='rounded-full hover:border border-green-400' src={user.image} alt='user' /></span>
          <span className='ml-2'>{user.name}</span>
        </div>
      }))

      return project.users.map((user: any, i: number) => <div key={user.id} className='w-20' style={{ width: 40 }}>
        {i + 1 <= imgCount && <Image loader={() => user.image} width={100} height={10} className='rounded-full hover:border border-green-400' src={user.image} alt='user' />}
        {i + 1 > imgCount && <div className=''>
          <Dropdown menu={{ items }} placement="bottomLeft" arrow>
            <Button type='link'>+ {len - 1} more</Button>
          </Dropdown>
        </div>}
      </div>)
    }
  },
  {
    title: "Action",
    key: "action",
    render: (_: any, project) => (
      <Space size="middle">
        <MdOutlineEdit />
        <MdDeleteOutline />
      </Space>
    )
  }


];


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editProject, setEditProject] = useState<ProjectProps | null>(null)
  const [projects, setProjects] = useState<Array<ProjectProps>>([])

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
