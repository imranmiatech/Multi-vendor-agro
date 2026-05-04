import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private transporter;
    constructor(config: ConfigService);
    sendOtp(email: string, otp: string): Promise<void>;
}
