import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import {
  Form,
  Card,
  Divider,
  Input,
  Select,
  DatePicker,
  Button,
  Avatar,
  Upload,
  Spin,
  Checkbox,
} from "antd";
import ImgCrop from "antd-img-crop";
import {
  UserOutlined,
  DeploymentUnitOutlined,
  WhatsAppOutlined,
  MailOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import { useWrap } from "~/context/wrap";
import AvatarBase from "~/components/Elements/AvatarBase";
import { userApi, userInformationApi } from "~/apiBase";
import TitlePage from "~/components/Elements/TitlePage";
import InputPassField from "~/components/FormControl/InputPassField";

let returnSchema = {};
let schema = null;
const optionGender = [
  {
    value: 0,
    title: "Nữ",
  },
  {
    value: 1,
    title: "Nam",
  },
  {
    value: 0,
    title: "Khác",
  },
];

const ChangePassword = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm();
  const { showNoti, getDataUser, userInformation } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const { dataUser } = props;
  const [dataForm, setDataForm] = useState<IUser>(null);
  console.log("dataUSer: ", dataUser);

  const defaultValuesInit = {
    KeyForgotPassword: "",
    Password: "",
    RePassword: "",
  };

  (function returnSchemaFunc() {
    returnSchema = { ...defaultValuesInit };
    Object.keys(returnSchema).forEach(function (key) {
      switch (key) {
        case "KeyForgotPassword":
          returnSchema[key] = yup.string().required("Bạn không được bỏ trống");
          break;
        case "Password":
          returnSchema[key] = yup.string().required("Bạn không được bỏ trống");
          break;
        case "RePassword":
          returnSchema[key] = yup
            .string()
            .oneOf(
              [yup.ref("Password"), null],
              "Password mới xác nhận lại chưa đúng"
            )
            .required("Bạn không được bỏ trống");
          break;
        default:
          // returnSchema[key] = yup.mixed().required("Bạn không được để trống");
          break;
      }
    });

    schema = yup.object().shape(returnSchema);
  })();

  const form = useForm({
    defaultValues: defaultValuesInit,
    resolver: yupResolver(schema),
  });

  // ----------- SUBMI FORM ------------
  const onSubmit = async (data: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });
    let res = null;
    try {
      res = await userApi.changePassword(data);
      res?.status == 200 &&
        (showNoti("success", "Đổi mật khẩu thành công"),
        form.reset(defaultValuesInit));
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "ADD_DATA",
        status: false,
      });
    }
  };

  useEffect(() => {
    if (dataUser) {
      dataUser.Gender = parseInt(dataUser.Gender);

      if (userInformation === null) {
        setDataForm(dataUser);
        setImageUrl(dataUser.Avatar);
      } else {
        setDataForm(userInformation);
        setImageUrl(userInformation.Avatar);
      }
      // dataForm == null && setDataForm(dataUser);
    }
  }, [userInformation]);

  return (
    <>
      <TitlePage title="Đổi mật khẩu" />
      <div className="row">
        <div className="col-md-3 col-12">
          <Card className="info-profile-left">
            <div className="row mb-3">
              <div className="col-12 d-flex align-items-center justify-content-center flex-wrap">
                <Avatar
                  size={64}
                  src={
                    <img
                      src={
                        dataForm?.Avatar ? dataForm.Avatar : "/images/user.png"
                      }
                    />
                    // <img src={"/images/user.png"} />
                  }
                />
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-2">
                <UserOutlined />
              </div>
              <div className="col-10  d-flex ">{dataForm?.FullNameUnicode}</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <DeploymentUnitOutlined />
              </div>
              <div className="col-10  d-flex ">{dataForm?.RoleName}</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <WhatsAppOutlined />
              </div>
              <div className="col-10  d-flex ">{dataForm?.Mobile}</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <MailOutlined />
              </div>
              <div className="col-10  d-flex ">{dataForm?.Email}</div>
            </div>
            <div className="row pt-4">
              <div className="col-2">
                <AimOutlined />
              </div>
              <div className="col-10  d-flex ">{dataForm?.Address}</div>
            </div>
          </Card>
        </div>
        <div className="col-md-8 col-12">
          <Card className="space-top-card">
            <Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
              <div className="row d-flex justify-content-center align-items-center">
                <h5>Form thay đổi mật khẩu</h5>

                <Divider></Divider>
              </div>

              <div className="row">
                <div className="col-md-5 col-12">
                  <InputPassField
                    form={form}
                    name="KeyForgotPassword"
                    label="Mật khẩu cũ"
                  />
                  <InputPassField
                    form={form}
                    name="Password"
                    label="Mật khẩu mới"
                  />
                  <InputPassField
                    form={form}
                    name="RePassword"
                    label="Xác nhận mật khẩu mới"
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Lưu
                    {isLoading.type == "ADD_DATA" && isLoading.status && (
                      <Spin className="loading-base" />
                    )}
                  </button>
                </div>
              </div>
            </Form>
          </Card>
        </div>
      </div>

      <div></div>
    </>
  );
};

export default ChangePassword;
