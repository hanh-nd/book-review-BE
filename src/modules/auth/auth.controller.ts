import {
    Body,
    Controller,
    InternalServerErrorException,
    Post,
} from '@nestjs/common';
import { SuccessResponse } from 'src/common/helper/response';
import { JoiValidationPipe, TrimBodyPipe } from 'src/common/pipes';
import { ILoginBody, IRegisterBody } from './auth.dto';
import { loginSchema, registerSchema } from './auth.validator';
import { AuthService } from './services/auth.service';

@Controller('/')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    async register(
        @Body(new TrimBodyPipe(), new JoiValidationPipe(registerSchema))
        registerBody: IRegisterBody,
    ) {
        try {
            const tokens = await this.authService.register(registerBody);
            return new SuccessResponse(tokens);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    @Post('/login')
    async login(
        @Body(new TrimBodyPipe(), new JoiValidationPipe(loginSchema))
        loginBody: ILoginBody,
    ) {
        try {
            const tokens = await this.authService.login(loginBody);
            return new SuccessResponse(tokens);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
