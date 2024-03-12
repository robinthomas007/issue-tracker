import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button, Checkbox, Form, type FormProps, Input, Layout, Card, Row, Col } from 'antd';
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import Link from 'next/link'

export default function CardFooter({ link }: { link: String }) {

  const onSocialMediaClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  }

  return (
    <div>

      <div className="flex items-center w-full gap-x-2">
        <Button
          size="large"
          className="w-full"
          onClick={() => onSocialMediaClick('google')}
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <FcGoogle className="h-5 w-5" />
        </Button>
        <Button
          size="large"
          className="w-full"
          onClick={() => onSocialMediaClick('github')}
          style={{ justifyContent: 'center', display: 'flex' }}
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>
      <div className='text-center py-5 '>
        <Link href={`${link}`} className='text-blue-900' >{link === '/signup' ? "Don't have an account?" : 'Already have an account?'}</Link>
      </div>
    </div>

  )
}
