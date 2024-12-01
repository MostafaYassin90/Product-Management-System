export type TUserRegister = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string
};
export type TUserLogin = {
  email: string;
  password: string
};