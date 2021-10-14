import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Spin } from "antd";
import { resetPasswordApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { showNoti } = useWrap();
  const [isConfirmEmail, setIsConfirmEmail] = useState(true);
  const [valueEmail, setValueEmail] = useState(null);
  const [isSuccess, setIsSucess] = useState(false);
  const router = useRouter();

  const [formConfirm] = Form.useForm();
  const [formEmail] = Form.useForm();

  const resendEmail = (e) => {
    e.preventDefault();
    setIsConfirmEmail(true);
  };

  const onFinish_Email = async (email) => {
    setValueEmail(email.Email);

    setLoading(true);
    try {
      let res = await resetPasswordApi.sendEmail(email);
      if (res.status === 200) {
        showNoti("success", "Gửi Email thành công");
        setIsConfirmEmail(false);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish_Update = async (dataConfirm) => {
    dataConfirm.verificationUser = parseInt(dataConfirm.verificationUser);

    setLoading(true);
    try {
      let res = await resetPasswordApi.confirm(dataConfirm);
      if (res.status === 200) {
        showNoti("success", "Khôi phục thành công");
        setIsSucess(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConfirmEmail) {
      formConfirm.setFieldsValue({ mail: valueEmail });
    } else {
      if (valueEmail) {
        formEmail.setFieldsValue({ Email: valueEmail });
      }
    }
  }, [isConfirmEmail]);

  return (
    <div className="wrap-reset-form">
      <div className="reset-form">
        <h4 className="title text-center">Khôi phục mật khẩu</h4>
        <p className="des text-center mt-2">
          {!isSuccess
            ? isConfirmEmail
              ? "Vui lòng gửi email của bạn để lấy mã xác nhận"
              : "Kiểm tra email của bạn và lấy mã xác nhận để khôi phục mật khẩu"
            : "Mật khẩu mới đã được gửi về Email của bạn, vui lòng kiểm tra email"}
        </p>
        {isConfirmEmail ? (
          <div className="confirm-email mt-4">
            <Form
              form={formEmail}
              name="basic"
              onFinish={onFinish_Email}
              layout="vertical"
            >
              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Email chưa đúng!",
                  },
                ]}
              >
                <Input className="style-input" />
              </Form.Item>
              <Form.Item className="mb-0">
                <button type="submit" className="btn btn-primary w-100">
                  Gửi
                  {loading && <Spin className="loading-base" />}
                </button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <>
            {!isSuccess ? (
              <div className="confirm-password mt-4">
                <Form
                  form={formConfirm}
                  name="basic"
                  onFinish={onFinish_Update}
                  layout="vertical"
                >
                  <Form.Item
                    label="Email"
                    name="mail"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Email chưa đúng!",
                      },
                    ]}
                  >
                    <Input
                      className="style-input"
                      value={valueEmail}
                      disabled={true}
                    />
                  </Form.Item>
                  <Form.Item
                    className="mb-1"
                    label="Mã xác nhận"
                    name="verificationUser"
                    rules={[
                      {
                        required: true,
                        message: "Bạn chưa nhập mã xác nhận",
                      },
                    ]}
                  >
                    <Input className="style-input" type="number" />
                  </Form.Item>
                  <div className="text-right mb-4">
                    <a href="" onClick={resendEmail}>
                      Chưa nhận được mã? Gửi lại.
                    </a>
                  </div>
                  <Form.Item className="mb-0">
                    <button type="submit" className="btn btn-primary w-100">
                      Xác nhận
                      {loading && <Spin className="loading-base" />}
                    </button>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              <div className="success-reset mt-3">
                <CheckCircleOutlined />
                <p className="success-text">Khôi phục mật khẩu thành công! </p>
                <p className="move-text">
                  Chuyển đến trang đăng nhập sau 2s...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
