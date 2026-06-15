import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "./auth.utils";
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_DAYS, REFRESH_TOKEN_SECRET } from "../constants/auth.constants.js";

describe("Auth Utility Functions", () => {
  const mockPayload = { userId: "12345", role: "admin" };

  // attach a spy to the real jsonwebtoken library so instead of generating a real token it will just return mocked-token
  let signSpy: jest.SpyInstance;
  beforeAll(() => {
    signSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "mocked-token" as any);
  });

  beforeEach(() => {
    // clear the spy memory before each test so counts dont overlap
    signSpy.mockClear();
  });

  afterAll(() => {
    // clean up the spy when fully done
    signSpy.mockRestore();
  });

  describe("generateAccessToken()", () => {
    it("should call jwt.sign with the correct payload, secret, and expiration", () => {
      const result = generateAccessToken(mockPayload);

      // assert our function returns whatever jwt.sign returned
      expect(result).toBe("mocked-token");
      // assert that our wrapper passed the exact right arguments to the library
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith(
        mockPayload,
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );
    });
  });

  describe("generateRefreshToken()", () => {
    it("should call jwt.sign with the correct refresh payload, secret, and expiration", () => {
      const result = generateRefreshToken(mockPayload);
      expect(result).toBe("mocked-token");
      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith(
        mockPayload,
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_DAYS }
      );
    });
  });
});