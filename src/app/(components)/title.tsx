"use client"

export default function Title({ title } : { title: string}) {
  return <h1 className="text-xl font-bold">{title}</h1>
}