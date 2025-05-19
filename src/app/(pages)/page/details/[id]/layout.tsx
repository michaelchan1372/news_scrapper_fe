import Body from "@/app/(components)/body"
import Header from "@/app/(components)/header"

export default async function BlogLayout({
  children, params
}: {
  children: React.ReactNode,
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div className="flex flex-col">
    <Header title={id}></Header>
    <Body>{children}</Body>
  </div>
}