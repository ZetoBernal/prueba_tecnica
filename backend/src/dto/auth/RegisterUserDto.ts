import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "../validators/Match";

export class RegisterUserDto {
  @IsString({ message: "El nombre es requerido." })
  @MinLength(2, { message: "El nombre debe tener al menos 2 caracteres." })
  @MaxLength(150)
  name!: string;

  @IsEmail({}, { message: "El correo electrónico no es válido." })
  @MaxLength(150)
  email!: string;

  @IsString()
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres." })
  @Matches(/(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).*/, {
    message: "La contraseña debe contener al menos un número y un carácter especial.",
  })
  password!: string;

  @IsString()
  @Match("password", { message: "La confirmación de contraseña no coincide." })
  confirmPassword!: string;
}
