export const successResponse = (data: any) => {
  return {
    error: false,
    status: "success",
    data,
  };
};
