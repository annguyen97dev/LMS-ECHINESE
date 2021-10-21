import { instance } from "~/apiBase/instance";

const url = "/api/ResetPassword/SendMail";
export const resetPasswordApi = {
  // Gửi email
  sendEmail(data) {
    return instance.post(url, data);
  },

  // Xác nhận
  confirm(data) {
    return instance.put("/api/ResetPassword/UpdatePass", "", {
      params: data,
    });
  },
};
