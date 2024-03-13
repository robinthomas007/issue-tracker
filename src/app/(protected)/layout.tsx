import { auth } from "@/auth";
import Navbar from "./_components/Navbar";
import { SessionProvider } from "next-auth/react"

const AuthLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <div className="h-screen">
        <Navbar />
        {children}
      </div>
    </SessionProvider>

  );
}

export default AuthLayout;