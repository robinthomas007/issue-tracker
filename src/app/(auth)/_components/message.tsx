import React from 'react'
import { CiCircleCheck } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";

function CardMessage({ message, type }: { message: string | undefined, type: string }) {
  return (
    <div className='mb-5'>
      {type === 'success' && <div className='bg-green-100 text-green-700 font-bold py-2 text-center bottom-1 rounded flex items-center justify-center'>
        <CiCircleCheck className='text-xl mr-4' />
        <p>{message}</p>
      </div>}
      {type === 'error' && <div className='bg-red-100 text-red-700 font-bold py-2 text-center bottom-1 rounded flex items-center justify-center'>
        <MdErrorOutline className='text-xl mr-4' />
        <p>{message}</p>
      </div>}
    </div>
  )
}

export default CardMessage
