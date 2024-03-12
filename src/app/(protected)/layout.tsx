import Navbar from "@/app/Navbar";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-screen">
      <Navbar />
      {children}
    </div>
  );
}

export default AuthLayout;