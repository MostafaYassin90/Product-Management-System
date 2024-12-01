import { redirect } from "next/navigation";

export default function Home() {

  redirect("/register")

  return (
    <div className="home">
      <div className="container">
      </div>
    </div>
  );
}
