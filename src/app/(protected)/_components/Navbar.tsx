'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { AiFillBug } from "react-icons/ai";
import classNames from 'classnames';
import { useSession } from "next-auth/react"
import { logout } from '@/actions/logout'
import { Space, Modal, Typography, Button, Form } from 'antd';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Avatar, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const CustomAvatar = ({ username, avatarUrl }: { username?: string, avatarUrl?: string | null }) => {

  const items: MenuProps['items'] = [
    {
      label: username,
      key: '0',
    },
    {
      label: 'settings',
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <span onClick={() => logout()}>Logout</span>,
      key: '3',
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <div>
        <Avatar src={avatarUrl} />
      </div>
    </Dropdown>
  );
};

function Navbar() {
  const user = useCurrentUser()
  const currentPath = usePathname()
  const links = [
    { label: 'Projects', href: "/projects" },
    // { label: 'Settings', href: "/settings" },
  ]

  // console.log(user, "session")
  return (
    <nav className='flex justify-between border-b px-5 h-14 items-center'>
      <div className='flex items-center space-x-6'>
        <Link href="/"><AiFillBug /></Link>
        <ul className='flex space-x-6'>
          {links.map(link => <Link
            className={classNames({
              'text-zinc-900': link.href === currentPath,
              'text-zinc-500': link.href !== currentPath,
              'hover:text-zinc-800 transition-colors': true
            })}
            key={link.href}
            href={link.href}>
            {link.label}
          </Link>)}
        </ul>
      </div>
      <div>
        {user?.name && <CustomAvatar username={user?.name} avatarUrl={user?.image} />}
      </div>
    </nav>
  )
}

export default Navbar