import { IsString } from "class-validator";
import Output from "@/DTO/auth/auth";

export class LoginBodyDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class LoginOutputDto extends Output {
  payload: {
    email: string;
    userId: number | string;
  };
}
