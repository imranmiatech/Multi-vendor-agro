import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter;

    constructor(private config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.config.get('EMAIL_HOST'),
            port: this.config.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.config.get('EMAIL_USER'),
                pass: this.config.get('EMAIL_PASS'),
            },
        });
    }

    async sendOtp(email: string, otp: string) {
        await this.transporter.sendMail({
            from: this.config.get('EMAIL_FROM'),
            to: email,
            subject: 'Your OTP Code',
            html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This will expire in 10 minutes</p>
      `,
        });
    }
}