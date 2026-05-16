import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.access_token,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: process.env.JWT_SECRET || 'supersecret',
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.id,
            email: payload.email,
            role: payload.role as Role | undefined,
        };
    }
}
