'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react';
import { verification } from '@/actions/varification'
const VarificationPage = () => {

  const searchParams = useSearchParams();
  const token = searchParams.get('token')

  const onSubmit = useCallback(() => {
    verification(token as string)
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <div>
      VarificationPage
    </div>
  )
}

export default VarificationPage
