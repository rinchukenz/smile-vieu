// src/apis/authApi.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // <-- import Zustand store

// Replace with your actual API base URL (use your machine IP for device/emulator)
const API_BASE_URL = "http://192.168.1.113:8080";

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

export interface FillBasicDetailsRequest {
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  gender: string;
}

export interface FillBasicDetailsResponse {
  status: "SUCCESS" | "FAILED";
  message?: string;
  userId?: string;
  updatedFields?: Record<string, any>;
}


export interface UploadDocumentResponse {
  status: "SUCCESS" | "FAILED";
  message?: string;
  documentUrl?: string;
}


export interface UpdateDoctorProfileRequest {
  qualification: string;
  speciality: string;
  description: string;
  registrationNumber: string;
}

export interface UpdateDoctorProfileResponse {
  status: "SUCCESS" | "FAILED";
  message?: string;
  updatedFields?: Record<string, any>;
}

export interface UploadProfilePictureResponse {
  status: "SUCCESS" | "FAILED";
  message?: string;
  profileImageUrl?: string; // ← add this line
}


// -------------------
// Axios helper
// -------------------

const postRequest = async <T>(url: string, data?: any, headers?: any): Promise<T> => {
  const response = await axios.post<T>(url, data, { headers });
  return response.data;
};


const putRequest = async <T>(url: string, data?: any, headers?: any): Promise<T> => {
  const response = await axios.put<T>(url, data, { headers });
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
  return postRequest<OtpRequestResponse>(`${API_BASE_URL}/api/auth/otp/request`, {
    identifier,
    channel,
    purpose,
  });
};

export const verifyOtp = async (
  requestId: string,
  otp: string
): Promise<OtpVerifyResponse> => {
  return postRequest<OtpVerifyResponse>(`${API_BASE_URL}/api/auth/otp/verify`, {
    requestId,
    code: otp,
  });
};

export const resendOtp = async (
  requestId: string
): Promise<OtpResendResponse> => {
  return postRequest<OtpResendResponse>(`${API_BASE_URL}/api/auth/otp/resend`, {
    requestId,
  });
};

// -------------------
// Fill Basic Details
// -------------------

export const fillBasicDetails = async (
  details: FillBasicDetailsRequest
): Promise<FillBasicDetailsResponse> => {
  const { userId, accessToken } = useAuthStore.getState();

  if (!accessToken || !userId) {
    throw new Error("User not authenticated. Please log in again.");
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  return putRequest<FillBasicDetailsResponse>(
    `${API_BASE_URL}/v1/users/${userId}/basic`,
    details,
    headers
  );
};



// authApi.ts
export const uploadDocument = async (
  file: any // The file (Blob or File object)
): Promise<UploadDocumentResponse> => {
  const { userId, accessToken } = useAuthStore.getState();

  if (!accessToken || !userId) {
    throw new Error("User not authenticated. Please log in again.");
  }

  const formData = new FormData();
  formData.append("file", file); // backend expects only the file

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await axios.post<UploadDocumentResponse>(
    `${API_BASE_URL}/v1/doctors/${userId}/documents/certificate`,
    formData,
    { headers }
  );

  return response.data;
};




export const updateDoctorProfile = async (
  details: UpdateDoctorProfileRequest
): Promise<UpdateDoctorProfileResponse> => {
  const { userId, accessToken } = useAuthStore.getState();

  if (!accessToken || !userId) {
    throw new Error("User not authenticated. Please log in again.");
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  return putRequest<UpdateDoctorProfileResponse>(
    `${API_BASE_URL}/v1/doctors/${userId}`,
    details,
    headers
  );
};



export const uploadProfilePicture = async (file: {
  uri: string;
  name: string;
  type: string;
}): Promise<UploadProfilePictureResponse> => {
  const { userId, accessToken } = useAuthStore.getState();

  if (!accessToken || !userId) {
    throw new Error("User not authenticated. Please log in again.");
  }

  try {
    const formData = new FormData();

    // Fix: cast the file as any to satisfy React Native FormData
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    console.log("Uploading file:", file);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    const response = await axios.post<UploadProfilePictureResponse>(
      `${API_BASE_URL}/v1/doctors/${userId}/documents/profile-picture`,
      formData,
      { headers }
    );

    console.log("Upload API response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error.response?.data || error.message);
    throw error;
  }
};
