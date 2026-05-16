import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { UploadedImageFile } from './cloudinary.types';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
        });
    }

    private createReadStream(buffer: Buffer) {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }

    private validateFiles(files: UploadedImageFile[]) {
        if (files.length === 0) {
            throw new BadRequestException('At least one image is required');
        }

        for (const file of files) {
            if (!file.mimetype.startsWith('image/')) {
                throw new BadRequestException('Only image files are allowed');
            }
        }
    }

    private async uploadSingleImage(
        file: UploadedImageFile,
        folder: string,
    ): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error || !result) {
                        reject(new BadRequestException('Failed to upload image to Cloudinary'));
                        return;
                    }

                    resolve(result);
                },
            );

            this.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async uploadProductImages(files: UploadedImageFile[]) {
        this.validateFiles(files);
        const uploads = await Promise.all(
            files.map((file) => this.uploadSingleImage(file, 'agro/products')),
        );

        return uploads.map((upload) => upload.secure_url);
    }
}
