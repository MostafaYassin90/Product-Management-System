

export type TCreateUser = {
  username: string;
  email: string;
  password: string;
}
export type TLoginUser = {
  email: string;
  password: string;
}

export type TCreateProduct = {
  title: string;
  price: number;
  taxes: number;
  ads: number;
  discount: number;
  subTotal: number;
  count: number;
  category: string;
}