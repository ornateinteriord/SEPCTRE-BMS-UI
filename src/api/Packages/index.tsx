import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put } from "../Api"; // Assuming standard Axios wrappers
import { toast } from "react-toastify";
import axios from "axios";

// Fetch all Add On requests (Admin)
export const useGetAddOnRequests = () => {
  return useQuery({
    queryKey: ["addon-requests"],
    queryFn: async () => {
      const response = await get("/api/packages/addon/requests");
      if (!response.success) throw new Error(response.message);
      return response.requests;
    },
  });
};

// Fetch approved Add On packages for a specific member (User Dashboard)
export const useGetMemberAddOns = (member_id: string | undefined) => {
  return useQuery({
    queryKey: ["member-addons", member_id],
    queryFn: async () => {
      const response = await get(`/api/packages/addon/member/${member_id}`);
      return response.addons || [];
    },
    enabled: !!member_id,
  });
};

// Create an Add On Request (User)
export const useRequestAddOnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { member_id: string; requested_amount: number; tx_no?: string; screenshot_url?: string; payment_method?: string }) => {
      return await post("/api/packages/addon/request", data);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["addon-requests"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error submitting request");
    },
  });
};

// Directly Buy an Add On Package using Top Up Balance (User)
export const useBuyPackageDirectlyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { member_id: string; requested_amount: number }) => {
      return await post("/api/packages/addon/buy-direct", data);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Package purchased successfully!");
        queryClient.invalidateQueries({ queryKey: ["member-addons"] });
        queryClient.invalidateQueries({ queryKey: ["wallet-overview"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error purchasing package");
    },
  });
};

// Fetch Load Fund configuration
export const useGetLoadFundConfig = () => {
  return useQuery({
    queryKey: ["load-fund-config"],
    queryFn: async () => {
      const response = await get("/api/packages/addon/config");
      if (!response.success) throw new Error(response.message);
      return response.config;
    },
  });
};

// Update Load Fund configuration (Admin)
export const useUpdateLoadFundConfigMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { qr_code_url?: string; wallet_address: string; network_text?: string }) => {
      return await post("/api/packages/addon/config", data);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Load Fund configuration updated successfully");
        queryClient.invalidateQueries({ queryKey: ["load-fund-config"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error updating configuration");
    },
  });
};

// Evaluate the Request (Admin)
export const useEvaluateAddOnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { request_id: string; status: "APPROVED" | "REJECTED"; admin_id?: string }) => {
      return await put(`/api/packages/addon/requests/${data.request_id}/evaluate`, {
        status: data.status,
        admin_id: data.admin_id
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["addon-requests"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error evaluating request");
    },
  });
};

// Fetch predefined Add-On Packages
export const useGetPackages = () => {
  return useQuery({
    queryKey: ["addon-packages"],
    queryFn: async () => {
      const response = await get("/api/packages/addon/list");
      return response.packages || [];
    },
  });
};

// Create a new predefined Add-On Package
export const useCreatePackageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; cost: number; days_count: number; daily_percent: number }) => {
      return await post("/api/packages/addon/create", data);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Package created");
        queryClient.invalidateQueries({ queryKey: ["addon-packages"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error creating package");
    },
  });
};

// Assign a package directly to a member
export const useAssignPackageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { member_id: string; package_id: string; amount_paid: number }) => {
      return await post("/api/packages/addon/assign", data);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Package assigned");
        queryClient.invalidateQueries({ queryKey: ["addon-packages"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error assigning package");
    },
  });
};

// Hook for uploading Payment Screenshots to ImageKit
export const useUploadPaymentScreenshot = (memberId: string) => {
  return useMutation<{ url: string }, Error, File>({
    mutationFn: async (file: File) => {
      const authRes = await get("/image-kit-auth");
      const { signature, expire, token } = authRes;

      const data = new FormData();
      data.append("file", file);
      data.append("fileName", `${memberId}_payment_${Date.now()}`);
      data.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      data.append("signature", signature);
      data.append("expire", expire);
      data.append("token", token);
      data.append("folder", "/payment-screenshots");

      const uploadRes = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        data
      );

      return uploadRes.data;
    },
    onError: (error: any) => {
      toast.error("Failed to upload screenshot. Please try again.");
      console.error("Error uploading screenshot:", error);
    },
  });
};

// Fetch requests (pending, approved, rejected) for a specific member
export const useGetMemberRequests = (member_id: string | undefined) => {
  return useQuery({
    queryKey: ["member-addon-requests", member_id],
    queryFn: async () => {
      const response = await get(`/api/packages/addon/requests/member/${member_id}`);
      if (!response.success) throw new Error(response.message);
      return response.requests || [];
    },
    enabled: !!member_id,
  });
};

// Hook for uploading Admin QR code to ImageKit
export const useUploadAdminQR = () => {
  return useMutation<{ url: string }, Error, File>({
    mutationFn: async (file: File) => {
      const authRes = await get("/image-kit-auth");
      const { signature, expire, token } = authRes;

      const data = new FormData();
      data.append("file", file);
      data.append("fileName", `admin_qr_${Date.now()}`);
      data.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      data.append("signature", signature);
      data.append("expire", expire);
      data.append("token", token);
      data.append("folder", "/payment-config");

      const uploadRes = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        data
      );

      return uploadRes.data;
    },
    onError: (error: any) => {
      toast.error("Failed to upload QR code. Please try again.");
      console.error("Error uploading QR code:", error);
    },
  });
};
