export const successResponse = (message: string, data?: any) => {
  return {
    error: false,
    status: "success",
    data,
    message: message ?? "Success",
  };
};
