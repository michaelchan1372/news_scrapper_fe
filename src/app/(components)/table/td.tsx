"use client"

export default function TD({ children } : {children: React.ReactNode}) {
  return <td className="border py-2 px-2">
        {children}
    </td>
  
}