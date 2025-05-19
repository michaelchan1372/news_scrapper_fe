"use client"

import Title from "./title"

export default function Body({ children } : {children: React.ReactNode}) {
  return <div className="px-36">
        {children}
    </div>
  
}