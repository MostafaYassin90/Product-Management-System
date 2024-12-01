"use client";
import Lottie from "lottie-react";
import Auth_Animation from "@/lib/loader.json";
import "./LoadingPage.css";

function LoadingPage() {
  return (
    <div className="loading">
      <Lottie animationData={Auth_Animation} />
    </div>
  )
}
export default LoadingPage;