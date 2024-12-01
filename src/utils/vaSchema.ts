import { z } from "zod";

// Schema 
export const schema = z.object({
  title: z.string({ required_error: "Title Is Required." }).min(1, { message: "Title Is Required." }),
  price: z.number({ required_error: "Price Is Required." }).min(1, { message: "Price Is Required." }),
  taxes: z.number({ required_error: "Taxes Is Required." }).min(0, { message: "Taxes Is Required." }),
  ads: z.number({ required_error: "Ads Is Required." }).min(0, { message: "Ads Is Required." }),
  discount: z.number({ required_error: "Discount Is Required." }).min(0, { message: "Discount Is Required." }),
  subTotal: z.number({ required_error: "SubTotal Is Required." }).min(1, { message: "SubTotal Is Required." }),
  count: z.number({ required_error: "Count Is Required." }).min(1, { message: "Count Is Required." }),
  category: z.string({ required_error: "Category Is Required." }).min(1, { message: "Category Is Required." })
});