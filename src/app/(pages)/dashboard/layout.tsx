import Body from "@/app/(components)/body"
import Header from "@/app/(components)/header"
import LogoutButton from "@/app/(components)/logout"
import NavBar from "@/app/(components)/navBar"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col min-h-screen">
    <Header title="Dashboard" buttons={[<LogoutButton></LogoutButton>]}></Header>
    <Body>{children}</Body>
  </div>
}