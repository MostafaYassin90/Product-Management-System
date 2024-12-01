import { NextRequest, NextResponse } from "next/server";
import prisma from '@/utils/prismaClient';
import { z } from "zod";
import { TLoginUser } from "@/utils/serverTypes";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from "cookie";

/* 
** @Method Post
** @Route http://localhost:3000/api/users/login
** @Desc Login [Authentication]
** @Access Public
*/

export async function POST(request: NextRequest) {

  try {
    const body: TLoginUser = await request.json();

    const schema = z.object({
      email: z.string({ required_error: "Email Is Required." }).email({ message: "Invalid Email." }),
      password: z.string({ required_error: "Password Is Required." }).min(6, { message: "Password Must Be At Least 2 Characters." })
    });

    const validation = schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0] }, { status: 400 })
    };

    //  Check Email in DataBase
    const findEmail = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!findEmail) {
      return NextResponse.json({ message: "Email Or Password Is Wrong." }, { status: 400 })
    };

    // Check Password
    const comparePassword = await bcrypt.compare(body.password, findEmail.password);

    if (!comparePassword) {
      return NextResponse.json({ message: "Email Or Password Is Wrong." }, { status: 400 })
    };

    // const userLogin
    const userLogin = {
      id: findEmail.id,
      username: findEmail.username,
      email: findEmail.email,
      isAdmin: findEmail.isAdmin,
      createdAt: findEmail.createdAt,
      updatedAt: findEmail.updatedAt
    }

    // Generate JwtPayload 
    const jwtPayload = {
      id: userLogin.id,
      username: userLogin.username,
      email: userLogin.email,
      isAdmin: userLogin.isAdmin
    };

    const token = jwt.sign(jwtPayload, process.env.SECRET_KEY as string, {
      expiresIn: "30d"
    });

    // Store Token In Cookie
    const tokenInCookie = serialize("Bearer", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return NextResponse.json(userLogin, {
      status: 200,
      headers: { "Set-Cookie": tokenInCookie }
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 })
  }




}