import Body from "@/app/(components)/body"
import Header from "@/app/(components)/header"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col min-h-screen">
    <Header title="Dashboard"></Header>
    <Body>{children}</Body>
  </div>
}