import { BcryptFuncError } from "@/Errors/bcryptErrors/bcryptErrors";
import * as bcrypt from "bcrypt";
import { WrongPasswordError } from "@/Errors/validationErrors/validationErrors";

export default async function validatePassword(password: string, hash: string) {
  const result = await bcrypt.compare(password, hash).catch(() => {
    throw new BcryptFuncError("BCRYPT_ERROR");
  });
  if (!result) throw new WrongPasswordError("WRONG_PASSWORD");
  return true;
}
