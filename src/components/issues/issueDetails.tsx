import React, { useEffect, useState } from 'react'
import { Card, Avatar } from 'antd'
import { assignIssue, ReporterIssue } from '@/actions/issues'
import { IssueProps } from '@/app/(protected)/projects/[projectId]/issues/IssueList';
import { useCurrentUser } from '@/hooks/use-current-user';
import CustomSelect from '@/components/common/CustomSelect'
import toast from 'react-hot-toast';
import Image from 'next/image'

const IssueDetails = ({ issue, projectId, fetchIssues, setEditIssues }: { issue: IssueProps, projectId: number, fetchIssues: any, setEditIssues: any }) => {

  const [assigneeSearch, setAssigneeSearch] = useState<string>();
  const [reporterSearch, setReporterSearch] = useState<string>();
  const [assignee, setAssignee] = useState<any>({});
  const [reporter, setReporter] = useState<any>({});
  const [searchedEmail, setSearchedEmail] = useState<string>();
  const [toggleAssignee, setToggleAssignee] = useState<boolean>(false);
  const [toggleReporter, setToggleReporter] = useState<boolean>(false);

  const user = useCurrentUser()

  useEffect(() => {
    setReporter({})
    setAssignee({})
    if (issue.reporter) {
      setReporter({ value: issue.reporter.email, label: issue.reporter.name, image: issue.reporter.image })
    }
    else {
      setToggleReporter(false)
    }
    if (issue.assignee) {
      setAssignee({ value: issue.assignee.email, label: issue.assignee.name, image: issue.assignee.image })
    }
    else {
      setToggleAssignee(false)
    }
  }, [issue, fetchIssues])


  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const handleAsigneeSearch = (newValue: string) => {
    setAssignee({})
    setSearchedEmail('')
    setAssigneeSearch(newValue)
    if (validateEmail(newValue)) {
      setSearchedEmail(newValue)
    }
  };

  const handleAssigneeChange = (newValue: string) => {
    if (validateEmail(newValue)) {
      assignIssue(newValue, issue.id, projectId)
        .then((data: any) => {
          toast.success(data.success)
          fetchIssues()
        }).catch(error => {
          toast.success(error.message)
        })
    }
  };

  const handleReporterSearch = (newValue: string) => {
    setReporter({})
    setSearchedEmail('')
    if (validateEmail(newValue)) {
      setSearchedEmail(newValue)
    }
    setReporterSearch(newValue)
  };

  const handleReporterChange = (newValue: string) => {
    if (validateEmail(newValue)) {
      ReporterIssue(newValue, issue.id, projectId)
        .then((data: any) => {
          toast.success(data.success)
          fetchIssues()
        }).catch(error => {
          toast.success(error.message)
        })
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const assigneeElem = document.getElementById('assignee');
      if (assigneeElem && !assigneeElem.contains(event.target)) {
        setToggleAssignee(false)
      }
      const reporterElem = document.getElementById('reporter');
      if (reporterElem && !reporterElem.contains(event.target)) {
        setToggleReporter(false)
      }
    };

    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Card title="Details">
      <div className='flex my-4'>
        <label className='flex-none w-32'>Assignee</label>
        {
          Object.keys(assignee).length !== 0 && !toggleAssignee && <div className='flex items-center w-full' onClick={() => setToggleAssignee(true)}>
            {assignee?.image ? <Avatar src={assignee?.image} /> : <Avatar style={{ backgroundColor: '#f56a00' }}>{assignee.label.charAt(0)}</Avatar>}

            <span className='text-md font-semibold text-gray-600 ml-2'>{assignee.label}</span>
          </div>
        }
        {Object.keys(assignee).length === 0 && !toggleAssignee && <span className='font-semibold text-gray-600' onClick={() => setToggleAssignee(true)}>Unassigned</span>}
        <div id="assignee" style={{ width: '100%' }}>
          {toggleAssignee && <>
            <CustomSelect
              value={assignee}
              search={assigneeSearch}
              onSearch={handleAsigneeSearch}
              onChange={handleAssigneeChange}
              placeholder='search Assignee'
              notFoundContent={<p>{searchedEmail ? <span className='text-gray-600 cursor-pointer'>Invite {searchedEmail}</span> : 'Not Found'}</p>}
            />
            <div className='mt-2 text-blue-500 cursor-pointer'>Assign to me</div>
          </>

          }
        </div>

      </div>
      <div className='flex my-4'>
        <label className='flex-none w-32'>Reporter</label>
        {
          issue.reporter && !toggleReporter && <div className='flex items-center w-full' onClick={() => setToggleReporter(true)}>
            {issue.reporter?.image ? <Avatar src={issue.reporter?.image} /> : <Avatar style={{ backgroundColor: '#f56a00' }}>{issue.reporter.name.charAt(0)}</Avatar>}
            <span className='text-md font-semibold text-gray-600 ml-2'>{issue.reporter.name}</span>
          </div>
        }
        <div id="reporter" style={{ width: '100%' }}>
          {toggleReporter &&
            <CustomSelect
              value={reporter}
              search={reporterSearch}
              onSearch={handleReporterSearch}
              onChange={handleReporterChange}
              placeholder='search Reporter'
              notFoundContent={<p>not found</p>}
            />
          }
        </div>
      </div>
    </Card>
  )
}

export default IssueDetails
