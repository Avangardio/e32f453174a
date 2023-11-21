import { IsString } from "class-validator";
import Output from "@/DTO/auth/auth";
import { User } from "@/Modules/postgres/Entities/user.entity";

export class RegistrationBodyDto {
  @IsString()
  password: string;
  @IsString()
  email: string;
}

export class RegistrationOutputDto extends Output {
  payload: Partial<User>;
}
