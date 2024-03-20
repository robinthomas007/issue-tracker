'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react';
import { verification } from '@/actions/varification'
import { Button, Checkbox, Form, type FormProps, Input, Layout, Card, Row, Col } from 'antd';
import CarHeader from '../_components/carHeader'
import Link from 'next/link'
import CardMessage from '../_components/message'
import { BeatLoader } from "react-spinners";

export default function Page() {

  const searchParams = useSearchParams();
  const token = searchParams.get('token')
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token!");
      return;
    }
    verification(token as string)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <Row justify={'center'} className='w-full'>
      <Col span={6} >
        <Card title={<CarHeader title="Confirmation" />} bordered={true} className='w-full shadow-xl'>
          <div className='text-center py-5 '>
            <div className="flex items-center w-full justify-center">
              {!success && !error && (
                <BeatLoader className='my-4' />
              )}
            </div>

            {(success || error) && <CardMessage message={success ? success : error} type={success ? 'success' : 'error'} />}

            <Link href="/login" className='text-blue-900' >Back to login</Link>
          </div>
        </Card>
      </Col>
    </Row>

  )
}
