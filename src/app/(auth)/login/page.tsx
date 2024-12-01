import Login from "@/components/Login/Login";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import "./Login.css";

async function LoginPage() {
  const userToken = (await cookies()).get("Bearer")?.value;
  if (userToken) {
    redirect("/productManagement");
  }
  return (
    <div className="loginPage">
      <div className="container">
        <Login />
      </div>
    </div>
  )
}
export default LoginPage;