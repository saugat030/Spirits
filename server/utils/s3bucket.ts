import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const formatEndpoint = (endpoint: string) => {
    if (!endpoint) return "";
    return endpoint.startsWith("http") ? endpoint : `https://${endpoint}`;
};

const b2Client = new S3Client({
    endpoint: formatEndpoint(process.env.B2_ENDPOINT!),
    region: process.env.B2_REGION!,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID!,
        secretAccessKey: process.env.B2_APP_KEY!,
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."));
    }
};

const commonMulterOptions = {
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter,
};

export const uploadToB2 = async (file: Express.Multer.File, folder: "gallery" | "variants" = "gallery"): Promise<string> => {
    const extension = file.mimetype.split("/")[1] || "jpeg";
    const fileKey = `products/${folder}/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await b2Client.send(command);
    return fileKey;
};

export const deleteFromB2 = async (key: string): Promise<void> => {
    if (!key) return;
    const command = new DeleteObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
    });
    await b2Client.send(command);
};

export const getPresignedImageUrl = async (key: string): Promise<string> => {
    if (!key) return "";

    const command = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME!,
        Key: key,
    });
    return await getSignedUrl(b2Client, command, { expiresIn: 3600 });
};

export const uploadProductFields = multer({
    ...commonMulterOptions,
}).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 6 },
]);

export const uploadVariantFields = multer({
    ...commonMulterOptions,
}).fields([
    { name: "variantImage", maxCount: 1 },
]);
