import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigKey } from 'src/common/config';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateUserBody } from 'src/modules/user/user.dto';
import { ILoginBody } from '../auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    async register(createUserDto: CreateUserBody) {
        const existedUser = await this.userService.findByUsername(
            createUserDto.username,
        );

        if (existedUser) {
            throw new BadRequestException(
                'This username has already been taken!',
            );
        }
        const hashedPassword = await this.hashData(createUserDto.password);
        const newUser = await this.userService.create({
            ...createUserDto,
            password: hashedPassword,
        });
        const tokens = await this.createTokens(newUser._id, newUser.username);
        return {
            ...tokens,
            user: newUser,
        };
    }

    async login(loginBody: ILoginBody) {
        try {
            const existedUser = await this.userService.findByUsername(
                loginBody.username,
            );

            if (!existedUser) {
                throw new NotFoundException();
            }

            const passwordMatch = await argon2.verify(
                existedUser.password,
                loginBody.password,
            );

            if (!passwordMatch) {
                throw new BadRequestException();
            }

            const tokens = await this.createTokens(
                existedUser._id,
                existedUser.username,
            );

            return {
                ...tokens,
                user: existedUser,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid username or password!');
        }
    }

    async hashTokens(tokens: { accessToken: string; refreshToken: string }) {
        return {
            accessToken: await this.hashData(tokens.accessToken),
            refreshToken: await this.hashData(tokens.refreshToken),
        };
    }

    async hashData(data: string) {
        return await argon2.hash(data);
    }

    async createTokens(userId: string, username: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>(
                        ConfigKey.JWT_ACCESS_TOKEN_SECRET,
                    ),
                    expiresIn: this.configService.get<string>(
                        ConfigKey.JWT_ACCESS_TOKEN_EXPIRES_TIME,
                    ),
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>(
                        ConfigKey.JWT_REFRESH_TOKEN_SECRET,
                    ),
                    expiresIn: this.configService.get<string>(
                        ConfigKey.JWT_REFRESH_TOKEN_EXPIRES_TIME,
                    ),
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
