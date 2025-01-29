import Image from "next/image";
import LandingPageNav from "@/components/LandingPageNav";

//this is going to be place where users can input clips and get AI analysis

export default function Home() {
  return (
    <div>
      <div className = "flex justify-center m-2 p-2 mt-20">
        <LandingPageNav></LandingPageNav>
      </div>
      
      <h1>Welcome To GamingClipsAI</h1>
    </div>
  )
}
