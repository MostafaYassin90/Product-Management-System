
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { TCreateUser } from "@/utils/serverTypes";
import prisma from "@/utils/prismaClient";
/* 
** @Method Post
** @Route http://localhost:3000/api/user/register
** @Desc Create A New User
** @Access Public
*/
export async function POST(request: NextRequest) {

  try {
    const body: TCreateUser = await request.json();

    const schema = z.object({
      username: z.string({ required_error: "Username Is Required." }).min(2, { message: "Username Must Be At Least 2 Characters." }).max(100),
      email: z.string({ required_error: "Email Is Required." }).email({ message: "Invalid Email." }),
      password: z.string({ required_error: "Password Is Required." }).min(6, { message: "Password Must Be At Least 6 Characters." })
    });
    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 })
    };

    // Check Email Is Already Been Token Or Not
    const checkEmail = await prisma.user.findUnique({ where: { email: body.email } });
    if (checkEmail) {
      return NextResponse.json({ message: "Email Has Already Been Taken." }, { status: 400 })
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(body.password, salt);

    // Create User Into DB
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashPassword
      },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Generate Token
    const jwtPayload = {
      id: newUser.id,
      username: newUser.username,
      isAdmin: newUser.isAdmin
    }

    const token = jwt.sign(jwtPayload, process.env.SECRET_KEY as string, {
      expiresIn: "30d"
    });

    // Store TokenIn Cookie
    const tokenInCookie = serialize("Bearer", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    })

    return NextResponse.json(newUser, {
      status: 200,
      headers: { "Set-Cookie": tokenInCookie }
    })

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 })
  }


}

// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import bcrypt from "bcryptjs";
// import { TCreateUser } from "@/utils/serverTypes";
// import jwt from 'jsonwebtoken';
// import { serialize } from "cookie";
// import { PrismaClient } from "@prisma/client";


// const prisma = new PrismaClient();


// /*
// ** @Method Get
// ** @Route http://localhost:3000/api/users/register
// ** @Desc Create A New User
// ** @Access Private
// */
// export async function POST(request: NextRequest) {

//   try {
//     const body: TCreateUser = await request.json();

//     const schema = z.object({
//       username: z.string({ required_error: "Username Is Required." }).min(2, { message: "Username Must Be At Least 2 Characters." }),
//       email: z.string({ required_error: "Email Is Required." }).email({ message: "Invalid Email." }),
//       password: z.string({ required_error: "Password Is Required" }).min(6, { message: "Password Must Be At Least 2 Characters." })
//     });

//     const validation = schema.safeParse(body);

//     if (!validation.success) {
//       return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 })
//     };

//     // Check If The New Email Has Been Already Taken
//     const findEmail = await prisma.user.findUnique({ where: { email: body.email } });
//     if (findEmail) {
//       return NextResponse.json({ message: "Email Has Already Been Taken" }, { status: 400 });
//     }

//     // // Hash Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);

//     // Create New User Into DB
//     const newUser = await prisma.user.create({
//       data: {
//         username: body.username,
//         email: body.email,
//         password: hashedPassword
//       }
//     });

//     //  Generate JWTPayload
//     const jwtPayload = {
//       id: newUser.id,
//       username: newUser.username,
//       isAdmin: newUser.isAdmin,
//     };
//     // Token

//     const token = jwt.sign(jwtPayload, process.env.SECRET_KEY as string, {
//       expiresIn: "30d"
//     });

//     // Store Token TO Cookie In Client And Server
//     const tokenInCookie = serialize("Bearer", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 42 * 30
//     });

//     return NextResponse.json(newUser, {
//       status: 200,
//       headers: { "Set-Cookie": tokenInCookie }
//     })

//   } catch (error) {
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
//   }

// }