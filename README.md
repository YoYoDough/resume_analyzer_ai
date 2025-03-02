This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# resume_analyzer_ai
A platform where users can send in their resume and AI will collect data from them to give feedback to the users. Platform will attach a salary based on the content of the resume and bullet point based analysis.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This is the kind of response that openAI api is supposed to give.
{
  "analysis": {
      "improvements": [
          "Elaborate on measurable outcomes or impacts from projects (e.g., user adoption rates, performance benchmarks).",
          "Highlight any certifications or formal training in key technical areas such as AI, databases, or web development.",
      ],
      "key_insights": [
          "Strong academic background with a Bachelor of Science in Computer Science.",
          "Extensive project portfolio, including a real-time messaging app, global reminder app, and e-commerce platform, demonstrating full-stack development skills in React, Next.js, and Java Spring Boot.",
          "Proficiency in database design and optimization with MySQL, and knowledge of authentication systems using NextAuth and Google OAuth."
      ],
      "salary_estimate": "80000"
  },
  "filename": "SWEResume.pdf",
  "message": "File uploaded and analyzed successfully."
}