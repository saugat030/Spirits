import nodemailer from "nodemailer";
import { sendOtpEmail } from "./email.utils";

// mock nodemailer
// build the fake transporter entirely inside the block to avoid hoisting errors
jest.mock("nodemailer", () => {
  const mockTransporter = {
    sendMail: jest.fn().mockResolvedValue(true),
  };
  return {
    createTransport: jest.fn().mockReturnValue(mockTransporter),
  };
});

describe("Email Utilities", () => {
  let mockSendMail: jest.Mock;

  beforeAll(() => {
    process.env.EMAIL_USER = "test@spirits.com"; //fake env
    // createTransport always returns that fake mockTransporter we can grab a direct reference to the sendMail spy herre
    mockSendMail = nodemailer.createTransport().sendMail as jest.Mock;
  });

  beforeEach(() => {
    // clear the spy memory before each test
    jest.clearAllMocks();
  });

  describe("sendOtpEmail()", () => {
    
    it("should format the email correctly for the 'verify' purpose", async () => {
      // act
      await sendOtpEmail("newuser@example.com", "123456", "verify");
      // assert verify it tried to send exactly 1 email
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      // assert inspect the exact email configuration
      const emailConfig = mockSendMail.mock.calls[0][0];

      expect(emailConfig.to).toBe("newuser@example.com");
      expect(emailConfig.from).toBe('"Spirits" <test@spirits.com>');
      expect(emailConfig.subject).toBe("Verify your Spirits account");
      expect(emailConfig.html).toContain("verify your email address");
      expect(emailConfig.html).toContain("123456");
    });

    it("should format the email correctly for the 'reset' purpose", async () => {
      // act
      await sendOtpEmail("lostuser@example.com", "987654", "reset");
      // assert
      expect(mockSendMail).toHaveBeenCalledTimes(1);
      const emailConfig = mockSendMail.mock.calls[0][0];
      expect(emailConfig.to).toBe("lostuser@example.com");
      expect(emailConfig.subject).toBe("Reset your Spirits password");
      expect(emailConfig.html).toContain("reset your password");
      expect(emailConfig.html).toContain("987654");
    });

  });
});