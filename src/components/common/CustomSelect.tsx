import React, { useEffect, useState } from 'react'
import { Card, Select } from 'antd'
import Image from 'next/image'
import { userListByEmail } from '@/actions/users'
import type { SelectProps } from 'antd';

const CustomSelect = ({ value, mode, search, onSearch, onChange, placeholder, notFoundContent, handleDeselect }: { value: any, mode?: string, search: any, onSearch: any, onChange?: any, placeholder: string, notFoundContent: React.ReactElement, handleDeselect?: any }) => {

  const [data, setData] = useState<SelectProps['options']>([]);

  useEffect(() => {
    if (search && search.length > 2)
      userListByEmail(search)
        .then((data: any) => {
          setData(data?.data)
        }).catch(error => {
          console.log(error, "sdadad")
        })
  }, [search])

  const optionRender = (option: any) => {
    return (
      <div className='text-green-700 flex items-center text-left'>
        <div className='mr-4'>
          <Image style={{ border: 1, borderRadius: 100 }} className='border-r-8' alt="user" loader={() => option.data.image} src={option.data.image} width={45} height={45} />
        </div>
        <div>
          <div>{option.data.label}</div>
          <div className='text-xs'> {option.data.value}</div>
        </div>
      </div>
    )
  }

  return (
    <Select
      style={{ width: '100%' }}
      mode={mode ? 'multiple' : undefined}
      showSearch
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      optionRender={optionRender}
      onDeselect={handleDeselect}
      suffixIcon={null}
      filterOption={false}
      onSearch={onSearch}
      onChange={onChange}
      notFoundContent={notFoundContent}
      options={(data || []).map((d: any) => ({
        value: d.email,
        label: d.name,
        image: d.image
      }))}
    />
  )
}

export default CustomSelect
