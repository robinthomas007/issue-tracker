import React, { useEffect, useState } from 'react'
import { Card, Select } from 'antd'
import { userListByEmail } from '@/actions/users'
import { assignIssue } from '@/actions/issues'
import type { SelectProps } from 'antd';
import { error } from 'console';
import { IssueProps } from '@/app/(protected)/projects/[projectId]/issues/IssueList';

const IssueDetails = ({ issue }: { issue: IssueProps }) => {

  const [data, setData] = useState<SelectProps['options']>([]);
  const [assignee, setAssignee] = useState<string>();
  const [reporter, setReporter] = useState<string>();
  const [searchedEmail, setSearchedEmail] = useState<string>();


  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleAsigneeSearch = (newValue: string) => {
    setAssignee('')
    setSearchedEmail('')
    if (validateEmail(newValue)) {
      setSearchedEmail(newValue)
    }
    userListByEmail(newValue)
      .then((data: any) => {
        setData(data?.data)
      }).catch(error => {
        console.log(error, "sdadad")
      })
  };

  const handleAssigneeChange = (newValue: string) => {
    setAssignee(newValue);
    if (validateEmail(newValue)) {
      assignIssue(newValue, issue.id)
        .then((data: any) => {
          console.log(data, "assssss")
          // setData(data?.data)
        }).catch(error => {
          console.log(error, "error in assignIssue")
        })
    }

  };

  const handleReporterSearch = (newValue: string) => {
    setReporter('')
    setSearchedEmail('')
    if (validateEmail(newValue)) {
      setSearchedEmail(newValue)
    }
    userListByEmail(newValue)
      .then((data: any) => {
        setData(data?.data)
      })
  };

  const handleReporterChange = (newValue: string) => {
    setReporter(newValue);
  };

  return (
    <Card title="Details">
      <div className='grid grid-cols-2 my-4'>
        <label>Assignee</label>
        <Select
          showSearch
          value={assignee}
          placeholder='search Assignee'
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          onSearch={handleAsigneeSearch}
          onChange={handleAssigneeChange}
          notFoundContent={<p>{searchedEmail ? <span className='text-gray-600 cursor-pointer'>Invite {searchedEmail}</span> : 'Not Found'}</p>}
          options={(data || []).map((d) => ({
            value: d.email,
            label: d.email,
          }))}
        />
      </div>
      <div className='grid grid-cols-2 my-4'>
        <label>Reporter</label>
        <Select
          showSearch
          value={reporter}
          placeholder='search Reporter'
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          onSearch={handleReporterSearch}
          onChange={handleReporterChange}
          notFoundContent={<p>not found</p>}
          options={(data || []).map((d) => ({
            value: d.email,
            label: d.email,
          }))}
        />
      </div>
    </Card>
  )
}

export default IssueDetails
