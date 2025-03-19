import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarImage } from '../ui/avatar'
import { ChefHat } from 'lucide-react'

function NavBar() { 
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-300 bg-emerald-500">
      <div className="px-4">
        <div className="flex items-center h-20">
          <Link href="/" className="flex items-center">
            <ChefHat className="w-12 h-12 text-white" />
            <span className="font-title text-4xl text-white tracking-tight relative translate-y-2">
              My Chef
            </span>
          </Link>
        </div>
      </div>
    </nav>
    
  )
}

export default NavBar
