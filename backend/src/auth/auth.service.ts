import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';
import { RoleType } from '@prisma/client';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) { }

  async signup(dto: CreateAuthDto) {
    const { email, password, role } = dto;

    // Check if role is valid enum value
    if (!Object.values(RoleType).includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    // Check if the user already exists
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException('This email is already in use');
    }

    // Hash the password
    const hashedPassword = await this.hashedPassword(password);

    // Create the user
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Create the role record (assuming you have a separate Role table)
    await this.prisma.role.create({
      data: {
        userId: createdUser.id,
        role, // directly use the RoleType enum value
      },
    });

    return 'User successfully created';
  }

  async login(dto: AuthDto, req: Request, res: Response) {
    const { email, password } = dto;

    // Find user by email
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (!foundUser) {
      throw new BadRequestException('Wrong credentials');
    }

    // Check password
    const isMatch = await this.comparePasswords({ password, hash: foundUser.password });
    if (!isMatch) {
      throw new BadRequestException('Wrong credentials');
    }

    // Find user role
    const userRole = await this.prisma.role.findFirst({
      where: { userId: foundUser.id },
    });

    if (!userRole) {
      throw new BadRequestException('Role not found for user');
    }

    // Generate token
    const token = await this.singToken({
      id: foundUser.id,
      email: foundUser.email,
      role: userRole.role,
    });

    if (!token) {
      throw new ForbiddenException();
    }

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Return response
    return res.send({
      access_token: token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        role: userRole.role.toLowerCase(), // convert enum to lowercase string
      },
    });
  }

  async hashedPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return bcrypt.compare(args.password, args.hash);
  }

  async singToken(args: { id: number; email: string; role: RoleType }) {
    const payload = {
      id: args.id,
      email: args.email,
      role: args.role,
    };
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
