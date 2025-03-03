import Image from "next/image";
import LandingPageNav from "@/components/LandingPageNav";
import Link from "next/link";

//this is going to be place where users can input clips and get AI analysis

export default function Home() {
  return (
    <main className = "h-100vl">
      <div className = "flex justify-center m-2 p-2">
        <LandingPageNav></LandingPageNav>
      </div>
      
      <div className = "welcome flex flex-col m-20">
        <h1 className = "font-regular text-7xl mb-6">Get ready for the new era of AI</h1>
        <p className = "font-regular text-xl welcome-desc">Unlock your potential with AI-driven resume analysis—get insights, improvements, and salary estimates in seconds. Click the "Get Started" button down low to discover your potential.</p>

        <div>
          <input type = "email" placeholder = "Enter email" className = "enter-email"></input>
          <Link href = "promptPage"><button className = "get-started-button font-regular text-xl">Get Started</button></Link>
        </div>
      </div>
    </main>
  )
}
