'use client'

import Body from "@/app/(components)/body"
import Header from "@/app/(components)/header"
import { Provider } from "react-redux"
import { store } from "@/store/store"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Provider store={store}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header title="Login"></Header>
        <Body>{children}</Body>
      </div>
    </Provider>
}