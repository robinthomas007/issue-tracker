import React from 'react'
import { AiFillBug } from "react-icons/ai";

export default function CarHeader({ title }: { title: String }) {
  return (
    <div className='flex flex-col items-center justify-between py-2 '>
      <AiFillBug className='text-5xl my-2 text-red-900' />
      <span className='text-blue-900'>{title}</span>
    </div>
  )
}
