"use client";
import Link from "next/link";
import { TbLock } from "react-icons/tb";
import { TbLockOpen } from "react-icons/tb";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { TUserRegister } from "@/utils/clientTypes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import LoadingPage from "../LoadingPage/LoadingPage";
import "./Register.css";


function Register() {
  let [turnPassword, setTurnPassword] = useState<string>("password");
  const [submitError, setSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Router
  const router = useRouter();

  // Schema
  const schema = z.object({
    firstName: z.string({ required_error: "First Name Is Required." }).min(1, { message: "First Name Is Required" }),
    lastName: z.string({ required_error: "Last Name Is Required." }).min(1, { message: "Last Name Is Required" }),
    email: z.string({ required_error: "Email Is Required." }).min(1, { message: "Email Is Required." }).email({ message: "InValid Email." }),
    password: z.string({ required_error: "Password Is Required." }).min(6, { message: "Password Must Be At Least 6 Characters." }),
    confirmPassword: z.string({ required_error: "Confirm Password Is Required." }).min(6, { message: "Confirm Password Must Be At Least 6 Characters." }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password Doesn't Match",
    path: ["confirmPassword"]
  })

  // Register
  const { register, handleSubmit, formState: { errors } } = useForm<TUserRegister>({
    mode: "onSubmit",
    resolver: zodResolver(schema)
  })

  // onSubmitHandler
  const onSubmitHandler: SubmitHandler<TUserRegister> = async (data: TUserRegister) => {
    setLoading(true);
    const user = {
      username: data.firstName + " " + data.lastName,
      email: data.email,
      password: data.password
    };
    try {
      const response = await axios.post("http://localhost:3000/api/users/register", user);
      const data: User = await response.data;
      const userDetails = {
        id: data.id,
        username: data.username,
        email: data.email,
        isAdmin: data.isAdmin
      };
      window.localStorage.setItem("UserDetails", JSON.stringify(userDetails));
      setLoading(false);
      router.push("/productManagement");
    } catch (error) {
      if (isAxiosError(error)) {
        setSubmitError(error.response?.data.message || error.message)
      }
      setLoading(false);
    }
  }



  // Show Password Handelr
  function showPasswordHandler() {
    if (turnPassword === "password") {
      setTurnPassword("text")
    } else {
      setTurnPassword("password")
    }
  }

  return (
    <>
      {
        loading
          ?
          <LoadingPage />
          :
          <div className="register">
            <div className="holder-form">
              <h2 className="register-title">Register</h2>
              <div className="goToLogin"><p>You Have An Account? <Link href={"/login"}>Log in</Link></p></div>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                {/* FirstName */}
                <div className="holder-field">
                  <label htmlFor="firstname">FirstName</label>
                  <input type="text" placeholder="FirstName" id="firstName"
                    {...register("firstName")}
                  />
                  {errors.firstName && <p className="field-error">{errors.firstName.message}</p>}
                </div>
                {/* LastName */}
                <div className="holder-field">
                  <label htmlFor="lastname">LastName</label>
                  <input type="text" placeholder="LastName" id="lastName"
                    {...register("lastName")}
                  />
                  {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
                </div>
                {/* email */}
                <div className="holder-field">
                  <label htmlFor="email">Email</label>
                  <input type="email" placeholder="Email" id="email"
                    {...register("email")}
                  />
                  {errors.email && <p className="field-error">{errors.email.message}</p>}
                </div>
                {/* Password */}
                <div className="holder-field">
                  <label htmlFor="password">Password</label>
                  <div className="holder-input">
                    <input type={turnPassword} placeholder="Password" id="password"
                      {...register("password")}
                    />
                    {
                      turnPassword === "password"
                        ?
                        <TbLock onClick={showPasswordHandler} />
                        :
                        <TbLockOpen onClick={showPasswordHandler} />
                    }
                  </div>
                  {errors.password && <p className="field-error">{errors.password.message}</p>}
                </div>
                {/* confirmPassword */}
                <div className="holder-field">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" placeholder="Confirm Password" id="confirmPassword"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
                </div>
                <button className="register-btn">Register</button>
              </form>
              {/* Submit Error */}
              {submitError && <p className="submit-error">{submitError}</p>}
              {/* Form */}
            </div>
          </div>
      }
    </>
  )
}
export default Register;