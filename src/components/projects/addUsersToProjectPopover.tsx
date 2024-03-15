import React, { useState } from 'react'
import CustomSelect from '@/components/common/CustomSelect'
import { Button, Popover } from 'antd';
import { ProjectProps } from '@/app/(protected)/projects/page'
import { addUserToProjects } from '@/actions/projects'
import { HiUserAdd } from "react-icons/hi";

const AddUsersToProjectPopover = ({ project, afterSaveFn }: { project: ProjectProps, afterSaveFn?: any }) => {
  const [search, setSearch] = useState<string>();
  const [assignee, setAssignee] = useState<Array<string>>([]);

  const handleAsigneeSearch = (newValue: string) => {
    setSearch(newValue)
  };

  const handleAssineeChange = (newValue: Array<string>) => {
    setAssignee(newValue)
  }

  const assignUserToProjects = (project: ProjectProps) => {
    document.getElementById('app')?.click()

    if (assignee.length > 0) {
      addUserToProjects(assignee, project.id)
        .then((data: any) => {
          console.log(data, "user assigned to project")
          setAssignee([])
          afterSaveFn();
        }).catch(error => {
          console.log(error, "error in assignIssue")
        })
    }
  }

  return (
    <Popover
      content={<div className='flex flex-col items-end'>
        <CustomSelect
          value={assignee}
          search={search}
          mode='multiple'
          onSearch={handleAsigneeSearch}
          onChange={handleAssineeChange}
          placeholder='search users'
          notFoundContent={<p>Not Found</p>} />
        <Button className='mt-2' type='primary' onClick={() => assignUserToProjects(project)}>Add</Button>
      </div>
      }
      overlayStyle={{ width: '300px' }}
      title="Add User"
      trigger="click"
    >
      <Button icon={<HiUserAdd />} >+</Button>
    </Popover>
  )
}

export default AddUsersToProjectPopover
