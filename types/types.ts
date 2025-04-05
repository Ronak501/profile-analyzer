// Define Profile Form Data Type
export interface ProfileFormData {
  github: string;
  leetcode?: string; // Optional field
}

// Define API Response Type
export interface APIResponse {
  message: string;
  data: ProfileFormData;
}
