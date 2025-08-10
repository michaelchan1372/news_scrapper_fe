import Body from "@/app/(components)/body"
import Header from "@/app/(components)/header"
import LogoutButton from "@/app/(components)/logout"

export default async function BlogLayout({
  children, params
}: {
  children: React.ReactNode,
  params: Promise<{ published_date: string , region:string }>
}) {
  const { published_date } = await params
  return <div className="flex flex-col min-h-screen">
    <Header title={published_date} buttons={[<LogoutButton></LogoutButton>]}></Header>
    <Body>{children}</Body>
  </div>
}