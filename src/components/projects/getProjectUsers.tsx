import React from 'react'
import Image from 'next/image'
import { Button, Dropdown, Tooltip, Avatar } from 'antd';
import { ProjectProps } from '@/app/(protected)/projects/page'

const GetProjectUsers = ({ project }: { project: ProjectProps }) => {
  const len = project?.users.length

  return <Avatar.Group maxCount={4}>
    {
      project?.users.map((user: any, i: number) => <div key={user.id} className='w-20' style={{ width: 40 }}>
        <Tooltip title={user.name} color={'#5f5f5f'} key={i}>
          {user.image ? <Avatar src={user.image} /> : <Avatar style={{ backgroundColor: '#f56a00' }}>{user.name.charAt(0)}</Avatar>}
        </Tooltip>
      </div>)
    }
  </Avatar.Group>
}

export default GetProjectUsers
