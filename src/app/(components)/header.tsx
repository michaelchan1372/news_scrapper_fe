"use client"

import Title from "./title"

export default function Header({ title } : { title: string}) {
  return <div className="py-8 px-36">
        <Title title={title}></Title>
    </div>
  
}