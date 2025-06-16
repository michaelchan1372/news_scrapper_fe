"use client"

export default function Body({ children } : {children: React.ReactNode}) {
  return <div className="px-2 lg:px-36">
        {children}
    </div>
  
}