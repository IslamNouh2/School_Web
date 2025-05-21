import { IsEmail, IsNotEmpty, IsString, Length, IsIn } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20, { message: 'password has to be at between 3 to 20 chars' })
    password: string;
}