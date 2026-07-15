import { IsEmail, IsString, MaxLength } from "class-validator";

export class LoginUserDto {
  @IsEmail({}, { message: "El correo electrónico no es válido." })
  @MaxLength(150)
  email!: string;

  @IsString({ message: "La contraseña es requerida." })
  password!: string;
}
