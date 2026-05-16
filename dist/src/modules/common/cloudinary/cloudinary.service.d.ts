import { ConfigService } from '@nestjs/config';
import { UploadedImageFile } from './cloudinary.types';
export declare class CloudinaryService {
    private readonly configService;
    constructor(configService: ConfigService);
    private createReadStream;
    private validateFiles;
    private uploadSingleImage;
    uploadProductImages(files: UploadedImageFile[]): Promise<string[]>;
}
