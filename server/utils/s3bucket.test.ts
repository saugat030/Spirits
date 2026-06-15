import { uploadToB2, deleteFromB2, getPresignedImageUrl } from "./s3bucket";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 1. MOCK THE AWS S3 SDK
jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({}), // Fake a successful upload/delete
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    GetObjectCommand: jest.fn(),
  };
});

// 2. MOCK THE AWS PRESIGNER
jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("https://fake-b2-url.com/image.jpg?token=123"),
}));

// 3. MOCK CRYPTO (To freeze the random UUID)
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("fixed-uuid-1234"),
}));

describe("S3 Bucket Utilities", () => {
  // Set up fake environment variables before the tests run
  beforeAll(() => {
    process.env.B2_BUCKET_NAME = "my-test-bucket";
  });

  // Clear mock history after each test so they don't interfere with each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadToB2()", () => {
    it("should generate a proper S3 Key and upload the file", async () => {
      // Arrange: Create a fake Multer file
      const fakeFile = {
        mimetype: "image/png",
        buffer: Buffer.from("fake-image-data"),
      } as Express.Multer.File;

      // Act: Run the upload function
      const resultKey = await uploadToB2(fakeFile, "variants");

      // Assert: Because we mocked crypto, we know EXACTLY what the key should be
      expect(resultKey).toBe("products/variants/fixed-uuid-1234.png");

      // Assert: Verify AWS PutObjectCommand received the correct data
      expect(PutObjectCommand).toHaveBeenCalledWith({
        Bucket: "my-test-bucket",
        Key: resultKey,
        Body: fakeFile.buffer,
        ContentType: "image/png",
      });
    });

    it("should default to 'jpeg' if mimetype is missing or weird", async () => {
      const fakeFile = {
        mimetype: "image", // No slash
        buffer: Buffer.from("data"),
      } as Express.Multer.File;

      const resultKey = await uploadToB2(fakeFile, "gallery");
      
      expect(resultKey).toBe("products/gallery/fixed-uuid-1234.jpeg");
    });
  });

  describe("deleteFromB2()", () => {
    it("should instantly return if no key is provided", async () => {
      await deleteFromB2("");
      
      // The command should never be created if the key is empty
      expect(DeleteObjectCommand).not.toHaveBeenCalled();
    });

    it("should send a DeleteObjectCommand with the correct bucket and key", async () => {
      await deleteFromB2("products/gallery/delete-me.png");

      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: "my-test-bucket",
        Key: "products/gallery/delete-me.png",
      });
    });
  });

  describe("getPresignedImageUrl()", () => {
    it("should instantly return an empty string if no key is provided", async () => {
      const result = await getPresignedImageUrl("");
      expect(result).toBe("");
      expect(GetObjectCommand).not.toHaveBeenCalled();
    });

    it("should return a presigned URL for a valid key", async () => {
      const result = await getPresignedImageUrl("products/gallery/image.png");

      // Assert that we created the AWS command correctly
      expect(GetObjectCommand).toHaveBeenCalledWith({
        Bucket: "my-test-bucket",
        Key: "products/gallery/image.png",
      });

      // Assert that the presigner was called and returned our fake URL
      expect(getSignedUrl).toHaveBeenCalled();
      expect(result).toBe("https://fake-b2-url.com/image.jpg?token=123");
    });
  });
});