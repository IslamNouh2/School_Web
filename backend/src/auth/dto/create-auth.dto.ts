import { IsEmail, IsNotEmpty, IsString, Length, IsEnum } from "class-validator";
import {  RoleType } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20, { message: 'Password must be between 3 to 20 characters' })
    password: string;

    @Transform(({ value }) => value.toUpperCase()) // convert to uppercase before validation
    @IsEnum(RoleType, { message: 'Role must be one of ADMIN, TEACHER, STUDENT, USER' })
    role: RoleType;
}