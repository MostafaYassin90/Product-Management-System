import { NextRequest, NextResponse } from "next/server";
import { optional, z } from "zod";
import { TCreateProduct } from "@/utils/serverTypes";
import prisma from "@/utils/prismaClient";

/* ************************************************** */
/* 
** @Method Post
** @Router http://localhost:3000/api/products
** @Desc Create A New Product
** @Access Public
*/

export async function POST(request: NextRequest) {
  try {
    const body: TCreateProduct = await request.json();
    const schema = z.object({
      title: z.string({ required_error: "Title Is Required" }).min(1, { message: "Title Must Be At Least 1 Characters." }),
      price: z.number({ required_error: "Price Is Required" }).min(1, { message: "Price Must Be At Least 1 Number" }),
      taxes: z.number(),
      ads: z.number(),
      discount: z.number(),
      subTotal: z.number({ required_error: "SubTotal Is Required." }).min(1, { message: "SunTotal Must Be At Least 1 Number" }),
      count: z.number({ required_error: "Count Is Required." }).min(1, { message: "Count Is Required." }),
      category: z.string({ required_error: "Category Is Required." })
    })
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 })
    };
    const token = request.cookies.get("Bearer")?.value;
    if (!token) {
      return NextResponse.json({ message: "No Token Provided Access Denied, UnAutherized" }, { status: 401 })
    };
    const newProduct = await prisma.product.create({
      data: {
        title: body.title,
        price: body.price,
        taxes: body.taxes,
        ads: body.ads,
        discount: body.discount,
        subTotal: body.subTotal,
        count: body.count,
        category: body.category
      }
    })
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 })
  }
}
/* ************************************************** */
/* 
** @Method Get
** @Router http://localhost:3000/api/products
** @Desc Get All Products
** @Access Public
*/

export async function GET(request: NextRequest) {

  try {

    const token = request.cookies.get("Bearer")?.value;

    if (!token) {
      return NextResponse.json({ message: "No Token Provided Access Denied, UnAuthenticated" })
    };

    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc"
      }
    });
    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}