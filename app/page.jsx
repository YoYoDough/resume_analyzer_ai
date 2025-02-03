import Image from "next/image";
import LandingPageNav from "@/components/LandingPageNav";

//this is going to be place where users can input clips and get AI analysis

export default function Home() {
  return (
    <main className = "h-100vl">
      <div className = "flex justify-center m-2 p-2">
        <LandingPageNav></LandingPageNav>
      </div>
      
      <div className = "welcome flex flex-col m-20">
        <h1 className = "font-regular text-7xl mb-6">Get ready for the new era of AI</h1>
        <p className = "font-regular text-xl welcome-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et vulputate tortor, in posuere nibh. Praesent sit amet metus porttitor mi consectetur pellentesque in at leo.</p>

        <div>
          <input type = "email" placeholder = "Enter email" className = "enter-email"></input>
          <button className = "get-started-button font-regular text-xl">Get Started</button>
        </div>
      </div>
    </main>
  )
}
