import Register from "@/components/Register/Register";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "./register.css";

async function RegisterPage() {
  const userToken = (await cookies()).get("Bearer")?.value;
  if (userToken) {
    redirect("/productManagement")
  }
  return (
    <div className="registerPage">
      <div className="container">
        <Register />
      </div>
    </div>
  )
}
export default RegisterPage;