import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { User, UserSchema } from 'src/mongo-schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UserController],
    providers: [JwtService, UserService],
    exports: [UserService],
})
export class UserModule {}
