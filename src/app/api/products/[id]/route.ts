import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";
import { z } from "zod";
import { TCreateProduct } from "@/utils/serverTypes";



/* ************************************************ */
/* 
** @Method Get
** @Route http://localhost:3000/api/products/:id
** @Desc Get A Single Product
** @Access Public
*/
export async function GET(reuqest: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = ((await params).id);
    const findProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!findProduct) {
      return NextResponse.json({ message: "Product Not Found." }, { status: 400 })
    };
    return NextResponse.json(findProduct, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 })
  }
}
/* ************************************************ */
/* 
** @Method Put
** @Route http://localhost:3000/api/products/:id
** @Desc Update A Single Product
** @Access Public
*/

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const findProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    if (!findProduct) {
      return NextResponse.json({ message: "Product Not Found." }, { status: 400 });
    };
    const body: TCreateProduct = await request.json();
    const schema = z.object({
      title: z.string({ required_error: "Title Is Required" }).min(2, { message: "Title Must Be At Least 2 Characters." }),
      price: z.number({ required_error: "Price Is Required" }).min(2, { message: "Price Must Be At Least 1 Number" }),
      taxes: z.number().min(1, { message: "Taxes Must Be At Least 1 Number" }),
      ads: z.number().min(1, { message: "ADS Must Be At Least 1 Number" }),
      discount: z.number().min(1, { message: "Discount Must Be At Least 1 Number" }),
      subTotal: z.number({ required_error: "SubTotal Is Required." }).min(1, { message: "SunTotal Must Be At Least 1 Number" }),
      count: z.number({ required_error: "Count Is Required." }).min(1, { message: "Count Is Required." }),
      category: z.string({ required_error: "Category Is Required." })
    });
    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 })
    };
    // Updata Product By Id
    const productUpdated = await prisma.product.update({
      where: { id: +id },
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
    });
    return NextResponse.json(productUpdated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

/* ************************************************ */
/* 
** @Method Delete
** @Route http://localhost:3000/api/products/:id
** @Desc Delete A Single Product
** @Access Public
*/

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const findProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });

    if (!findProduct) {
      return NextResponse.json({ message: "Product Not Found." }, { status: 400 })
    };

    const token = request.cookies.get("Bearer")?.value;

    if (!token) {
      return NextResponse.json({ message: "No Token Provided Access Denied, UnAutherized." }, { status: 401 });
    }

    const productDeleted = await prisma.product.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ productDeleted, message: "Deleted Successfully." }, { status: 200 })


  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 })
  }
}