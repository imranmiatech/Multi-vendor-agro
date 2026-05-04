import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from '../common/mail/mail.service';

@Module({
  imports: [
    PassportModule,

  ],
  providers: [AuthService, JwtStrategy, MailService],
  controllers: [AuthController]
})
export class AuthModule { }
