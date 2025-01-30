import React from 'react'
import Link from 'next/link'

const LandingPageNav = () => {
  return (
    <nav className = "flex w-4/5 items-center justify-between">
        <div>
            <img className = "w-40" src = "logo.png"></img>
        </div>

        <div className = "flex">
            <Link href = "/feature" className = "font-clash p-2">Feature</Link>
            <Link href = '/about' className = "font-clash p-2">About</Link>
            <Link href = '/blog' className = "font-clash p-2">Blog</Link>
        </div>
        
        <div>
            <Link href = "/signup">Sign Up</Link>
            <Link href = '/login'>Log In</Link>
        </div>
    </nav>
  )
}

export default LandingPageNav