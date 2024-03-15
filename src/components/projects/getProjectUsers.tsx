import React from 'react'
import Image from 'next/image'
import { Button, Dropdown, Tooltip } from 'antd';
import { ProjectProps } from '@/app/(protected)/projects/page'

const GetProjectUsers = ({ project }: { project: ProjectProps }) => {
  const len = project?.users.length
  const imgCount = 1

  const items = project?.users.slice(imgCount).map((user: any) => ({
    'key': user.id,
    'label': <div className='flex items-center'>
      <span><Image loader={() => user.image} width={40} height={10} className='rounded-full hover:border border-green-400' src={user.image} alt='user' /></span>
      <span className='ml-2'>{user.name}</span>
    </div>
  }))

  return project?.users.map((user: any, i: number) => <div key={user.id} className='w-20' style={{ width: 40 }}>
    {i + 1 <= imgCount && <Tooltip title={user.name} color={'#5f5f5f'} key={i}>
      <Image loader={() => user.image} width={100} height={10} className='rounded-full hover:border border-green-400' src={user.image} alt='user' />
    </Tooltip>}
    {i + 1 > imgCount && <div className=''>
      <Dropdown menu={{ items }} placement="bottomLeft" arrow>
        <Button type='link'>+ {len - 1} more</Button>
      </Dropdown>
    </div>}
  </div>)
}

export default GetProjectUsers
