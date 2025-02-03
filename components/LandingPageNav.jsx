import React from 'react'
import Link from 'next/link'

const LandingPageNav = () => {
  return (
    <nav className = "flex w-4/5 items-center justify-between mt-20">
        <div>
            <img className = "w-40" src = "logo.png"></img>
        </div>

        <div className = "flex">
            <Link href = "/feature" className = "font-regular text-3xl p-2">Feature</Link>
            <Link href = '/about' className = "font-regular text-3xl p-2">About</Link>
            <Link href = '/blog' className = "font-regular text-3xl p-2">Blog</Link>
        </div>
        
        <div>
            <Link href = "/signup"><button className = "signup-button font-regular text-xl m-4">Sign Up</button></Link>
            <Link href = '/login'><button className = "login-button font-regular text-xl m-4">Log In</button></Link>
        </div>

    </nav>
  )
}

export default LandingPageNav