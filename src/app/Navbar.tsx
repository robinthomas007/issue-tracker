'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { AiFillBug } from "react-icons/ai";
import classNames from 'classnames';

function Navbar() {
  const currentPath = usePathname()
  const links = [
    { label: 'Dashboard', href: "/" },
    { label: 'Issues', href: "/issues" },
  ]
  return (
    <nav className='flex space-x-6 border-b px-5 h-14 items-center'>
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
    </nav>
  )
}

export default Navbar