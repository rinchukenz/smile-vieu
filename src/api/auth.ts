import axios from "axios";

// Replace with your actual API base URL (use your machine IP for device/emulator)
const API_BASE_URL = "http://192.168.1.113:8080/api/auth";

// -------------------
// Response Types
// -------------------

export interface OtpRequestResponse {
  requestId: string;
  maskedIdentifier: string;
  ttlSeconds: number;
  resendCooldownSeconds: number;
  maxResends: number;
  resendCount: number;
}

export interface OtpVerifyResponse {
  status: "VERIFIED" | "FAILED";
  userId: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface OtpResendResponse {
  status: "RESENT" | "FAILED";
  resendCount: number;
  resendCooldownSeconds: number;
}

// -------------------
// Axios helper
// -------------------

const postRequest = async <T>(url: string, data?: any): Promise<T> => {
  const response = await axios.post<T>(url, data);
  return response.data;
};

// -------------------
// API Functions
// -------------------

export const requestOtp = async (
  identifier: string,
  channel: "sms" | "email",
  purpose: string = "login"
): Promise<OtpRequestResponse> => {
  return postRequest<OtpRequestResponse>(`${API_BASE_URL}/otp/request`, {
    identifier,
    channel,
    purpose,
  });
};

export const verifyOtp = async (
  requestId: string,
  otp: string
): Promise<OtpVerifyResponse> => {
  return postRequest<OtpVerifyResponse>(`${API_BASE_URL}/otp/verify`, {
    requestId,
    code: otp,
  });
};

export const resendOtp = async (
  requestId: string
): Promise<OtpResendResponse> => {
  return postRequest<OtpResendResponse>(`${API_BASE_URL}/otp/resend`, {
    requestId,
  });
};
