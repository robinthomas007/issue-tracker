import React, { useEffect, useState } from 'react'
import { Card } from 'antd'
import { assignIssue, ReporterIssue } from '@/actions/issues'
import { IssueProps } from '@/app/(protected)/projects/[projectId]/issues/IssueList';
import { useCurrentUser } from '@/hooks/use-current-user';
import CustomSelect from '@/components/common/CustomSelect'

const IssueDetails = ({ issue }: { issue: IssueProps }) => {

  const [assigneeSearch, setAssigneeSearch] = useState<string>();
  const [reporterSearch, setReporterSearch] = useState<string>();
  const [assignee, setAssignee] = useState<string>();
  const [reporter, setReporter] = useState<string>();
  const [searchedEmail, setSearchedEmail] = useState<string>();

  const user = useCurrentUser()

  useEffect(() => {
    setReporter('')
    setAssignee('')
    if (issue.reporter)
      setReporter(issue.reporter.name)
    if (issue.assignee)
      setAssignee(issue.assignee.name)
  }, [issue])


  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleAsigneeSearch = (newValue: string) => {
    setAssignee('')
    setSearchedEmail('')
    setAssigneeSearch(newValue)
    if (validateEmail(newValue)) {
      setSearchedEmail(newValue)
    }
  };

  const handleAssigneeChange = (newValue: string) => {
    setAssignee(newValue);
    if (validateEmail(newValue)) {
      assignIssue(newValue, issue.id)
        .then((data: any) => {
          console.log(data, "assssss")
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
    setReporterSearch(newValue)
  };

  const handleReporterChange = (newValue: string) => {
    setReporter(newValue);
    if (validateEmail(newValue)) {
      ReporterIssue(newValue, issue.id)
        .then((data: any) => {
          console.log(data, "report issue")
        }).catch(error => {
          console.log(error, "error in report")
        })
    }
  };

  return (
    <Card title="Details">
      <div className='flex my-4'>
        <label className='flex-none w-32'>Assignee</label>
        <CustomSelect
          value={assignee}
          search={assigneeSearch}
          onSearch={handleAsigneeSearch}
          onChange={handleAssigneeChange}
          placeholder='search Assignee'
          notFoundContent={<p>{searchedEmail ? <span className='text-gray-600 cursor-pointer'>Invite {searchedEmail}</span> : 'Not Found'}</p>}
        />

      </div>
      <div className='flex my-4'>
        <label className='flex-none w-32'>Reporter</label>
        <CustomSelect
          value={reporter}
          search={reporterSearch}
          onSearch={handleReporterSearch}
          onChange={handleReporterChange}
          placeholder='search Reporter'
          notFoundContent={<p>not found</p>}
        />
      </div>
    </Card>
  )
}

export default IssueDetails
