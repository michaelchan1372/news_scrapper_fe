import Body from "@/app/(components)/body"
import Header from "@/app/(components)/header"

export default async function BlogLayout({
  children, params
}: {
  children: React.ReactNode,
  params: Promise<{ published_date: string , region:string }>
}) {
  const { published_date } = await params
  return <div className="flex flex-col">
    <Header title={published_date}></Header>
    <Body>{children}</Body>
  </div>
}