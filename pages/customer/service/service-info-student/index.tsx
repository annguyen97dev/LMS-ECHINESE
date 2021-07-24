import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Card, Form, Select, Input, Divider, Button, Upload } from "antd";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
import ImgCrop from "antd-img-crop";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import {
  areaApi,
  districtApi,
  wardApi,
  jobApi,
  puroseApi,
  branchApi,
  sourceInfomationApi,
} from "~/apiBase";
import { useWrap } from "~/context/wrap";

let returnSchema = {};
let schema = null;

interface listData {
  Area: Array<Object>;
  District: Array<Object>;
  Ward: Array<Object>;
  Job: Array<Object>;
  Branch: Array<Object>;
  Purposes: Array<Object>;
  SourceInformation: Array<Object>;
}

const listApi = [
  {
    api: areaApi,
    text: "Tỉnh/Tp",
    name: "Area",
  },

  {
    api: jobApi,
    text: "Công việc",
    name: "Job",
  },
  {
    api: puroseApi,
    text: "Mục đích học",
    name: "Purposes",
  },
  {
    api: branchApi,
    text: "Trung tâm",
    name: "Branch",
  },
  {
    api: sourceInfomationApi,
    text: "Nguồn khách hàng",
    name: "SourceInformation",
  },

  // areaApi,
  // districtApi,
  // wardApi,
  // jobApi,
  // purposeApi,
  // branchApi,
  // sourceInfomationApi,
];

const StudentAppointmentCreate = () => {
  const { Option } = Select;
  const { showNoti } = useWrap();
  const [fileList, setFileList] = useState([]);
  const { TextArea } = Input;
  const [listData, setListData] = useState<listData>({
    Area: [],
    District: [],
    Ward: [],
    Job: [],
    Branch: [],
    Purposes: [],
    SourceInformation: [],
  });

  console.log("DATA list: ", listData);

  // ------------- ADD data to list --------------

  const makeNewData = (data, name) => {
    let newData = null;
    switch (name) {
      case "Area":
        newData = data.map((item) => ({
          title: item.AreaName,
          value: item.AreaID,
        }));
        break;
      case "Branch":
        newData = data.map((item) => ({
          title: item.BranchName,
          value: item.ID,
        }));
        break;
      case "Job":
        newData = data.map((item) => ({
          title: item.JobName,
          value: item.JobID,
        }));
        break;
      case "Purposes":
        newData = data.map((item) => ({
          title: item.PurposesName,
          value: item.PurposesID,
        }));
        break;
      case "SourceInformation":
        newData = data.map((item) => ({
          title: item.SourceInformationName,
          value: item.SourceInformationID,
        }));
        break;
      default:
        break;
    }

    return newData;
  };

  const getDataTolist = (data: any, name: any) => {
    let newData = makeNewData(data, name);

    Object.keys(listData).forEach(function (key) {
      if (key == name) {
        listData[key] = newData;
      }
    });
    setListData({ ...listData });
  };

  // ----------- GET DATA SOURCE ---------------
  const getDataSource = () => {
    listApi.forEach((item, index) => {
      (async () => {
        try {
          let res = await item.api.getAll({ pageIndex: 1, pageSize: 99999 });
          res.status == 200 && getDataTolist(res.data.data, item.name);

          res.status == 204 &&
            showNoti("danger", item.text + " Không có dữ liệu");
        } catch (error) {
          showNoti("danger", error.message);
        } finally {
        }
      })();
    });
  };

  // ----- HANDLE CHANGE - AREA ----------
  const handleChange_Area = (value) => {
    console.log("Value is: ", value);
  };

  const defaultValuesInit = {
    FullNameUnicode: null,
    Email: "",
    Mobile: null,
    AreaID: null, //int id Tỉnh/TP
    DistrictID: null, //int id Quận/Huyện
    WardID: null, //int id Phường/Xã
    HouseNumber: null, //Nhập số nhà tên đường
    Address: null, //bỏ trống - chỉ nhập khi khách hàng có địa chỉ không cụ thể
    Avatar: null, //Lưu link file hình
    DOB: null, //ngày sinh
    Gender: null, //int 0-Nữ 1-Nam 2-Khác
    CMND: null, //int số CMND
    CMNDDate: null, //Ngày làm
    CMNDRegister: null, //Nơi làm CMND
    Extension: null, //giới thiệu thêm
    Branch: null, //string : id của trung tâm - LƯU Ý NẾU TỪ 2 TRUNG TÂM TRỞ LÊN THÌ NHẬP(ID,ID,ID)
    AcademicPurposesID: null, // int id mục đích học
    JobID: null, //int mã công việc
    SourceInformationID: null, //int id nguồn
    ParentsOf: null, //int id phụ huynh
  };

  (function returnSchemaFunc() {
    returnSchema = { ...defaultValuesInit };
    Object.keys(returnSchema).forEach(function (key) {
      switch (key) {
        case "Email":
          returnSchema[key] = yup
            .string()
            .email("Email nhập sai cú pháp")
            .required("Bạn không được để trống");
          break;
        case "Mobile":
          returnSchema[key] = yup
            .number()
            .typeError("SDT phải là số")
            .required("Bạn không được để trống");
          break;
        case "CMND":
          returnSchema[key] = yup
            .number()
            .typeError("CMND phải là số")
            .required("Bạn không được để trống");
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
  const onSubmit = (data: any) => {
    console.log("DATA SUBMIT: ", data);
  };

  // ------------ AVATAR --------------
  const onChange_avatar = ({ fileList: newFileList }) => {
    console.log("FILe IMAGE: ", newFileList);
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  useEffect(() => {
    getDataSource();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-12 text-center">
          <TitlePage title="Lịch hẹn" />
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center">
        <Card title="Phiếu thông tin cá nhân" className="w-70 w-100-mobile">
          <div className="wrap-form">
            <Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
              {/*  */}

              {/** ==== Thông tin cơ bản  ====*/}
              <div className="row">
                <div className="col-12">
                  <ImgCrop rotate>
                    <Upload
                      // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange_avatar}
                      onPreview={onPreview}
                    >
                      {fileList.length < 1 && "+ Upload"}
                    </Upload>
                  </ImgCrop>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Divider orientation="center">Thông tin cơ bản</Divider>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <InputTextField form={form} name="Email" label="Email" />
                </div>

                <div className="col-md-6 col-12">
                  <InputTextField
                    form={form}
                    name="FullNameUnicode"
                    label="Họ và tên"
                  />
                </div>
              </div>
              {/*  */}
              {/*  */}
              <div className="row">
                <div className="col-md-6 col-12">
                  <InputTextField
                    form={form}
                    name="Mobile"
                    label="Số điện thoại"
                  />
                </div>

                <div className="col-md-6 col-12">
                  <DateField form={form} name="DOB" label="Ngày sinh" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-12">
                  <InputTextField form={form} name="CMND" label="số CMND" />
                </div>
                <div className="col-md-4 col-12">
                  <SelectField
                    form={form}
                    name="CMNDRegister"
                    label="Nơi cấp CMND"
                    optionList={listData.Area}
                  />
                </div>
                <div className="col-md-4 col-12">
                  <DateField form={form} name="CMNDDate" label="Ngày cấp" />
                </div>
              </div>
              {/*  */}
              {/*  */}
              {/** ==== Địa chỉ  ====*/}
              <div className="row">
                <div className="col-12">
                  <Divider orientation="center">Địa chỉ</Divider>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="AreaID"
                    label="Tỉnh/TP"
                    optionList={listData.Area}
                    getValue={(value) => handleChange_Area(value)}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="DistrictID"
                    label="Quận/Huyện"
                    optionList={[]}
                  />
                </div>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}

              <div className="row">
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="WardID"
                    label="Phường/Xã"
                    optionList={[]}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <InputTextField
                    form={form}
                    name="Address"
                    label="Mô tả thêm"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <InputTextField
                    form={form}
                    name="HouseNumber"
                    label="Số nhà/tên đường"
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="JobID"
                    label="công việc"
                    optionList={listData.Job}
                  />
                </div>
              </div>

              {/*  */}
              {/** ==== Khác  ====*/}
              <div className="row">
                <div className="col-12">
                  <Divider orientation="center">Khác</Divider>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="Branch"
                    label="Tên trung tâm"
                    optionList={listData.Branch}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="AcademicPurposesID"
                    label="Mục đích học"
                    optionList={listData.Purposes}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-12">
                  <InputTextField
                    form={form}
                    name="ParentsOf"
                    label="Phụ huynh"
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="SourceInformationID"
                    label="Nguồn khách"
                    optionList={listData.SourceInformation}
                  />
                </div>
              </div>

              {/*  */}
              <div className="row">
                <div className="col-12">
                  <TextAreaField
                    name="Extension"
                    label="Giới thiệu thêm"
                    form={form}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 d-flex justify-content-end">
                  <div style={{ paddingRight: 5 }}>
                    <button type="submit" className="btn btn-primary w-100">
                      Lưu
                      {/* {isLoading.type == "ADD_DATA" && isLoading.status && (
                    <Spin className="loading-base" />
                  )} */}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};
StudentAppointmentCreate.layout = LayoutBase;
export default StudentAppointmentCreate;
