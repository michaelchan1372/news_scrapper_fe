"use client"

import { JSX } from "react"
import LogoutButton from "./logout"
import Title from "./title"

export default function Header({ title, buttons=[] } : { title: string, buttons?: JSX.Element[]}) {
  return <div className="py-8 px-2 lg:px-36 w-full flex flex-row">
      <div className="basis-7xl">
        <Title title={title}></Title>
      </div>

      <div className="flex basis-xl flex-row-reverse">
        {buttons.map((button, i) => (
          <div key={i}>{button}</div>
        )
        )}
      </div>
    </div>
  
}