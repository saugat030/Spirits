import { generateOtp, otpExpiresAt } from "./otp.utils";

describe("OTP Utility Functions", () => {
  // tests for generateOtp
  describe("generateOtp()", () => {
    it("should return a string of exactly 6 characters", () => {
      const otp = generateOtp();
      expect(typeof otp).toBe("string");
      expect(otp.length).toBe(6);
    });

    it("should strictly contain only numeric digits", () => {
      const otp = generateOtp();
      expect(otp).toMatch(/^[0-9]{6}$/);
    });
  });

  // tests for otpExpiresAt
  describe("otpExpiresAt()", () => {
    // freezing time before these tests run
    beforeAll(() => {
      // Date.now() is exactly 1,000,000,000,000 milliseconds
      jest.spyOn(Date, "now").mockReturnValue(1000000000000);
    });
    // cleaning up
    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should add exactly 10 minutes by default", () => {
      const result = otpExpiresAt();
      // Math breakdown:
      // base time: 1,000,000,000,000 / 1000 = 1,000,000,000 seconds
      // 10 minutes * 60 seconds = 600 seconds
      // Expected result: 1,000,000,600
      expect(result).toBe(1000000600);
    });

    it("should add a custom amount of minutes if provided", () => {
      const result = otpExpiresAt(5);
      // Base time: 1,000,000,000 seconds
      // 5 minutes * 60 seconds = 300 seconds
      // Expected result: 1,000,000,300
      expect(result).toBe(1000000300);
    });
  });
});
