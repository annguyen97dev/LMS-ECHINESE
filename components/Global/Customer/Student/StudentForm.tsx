import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Select,
  Input,
  Divider,
  Button,
  Upload,
  Spin,
  message,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import {
  studentApi,
  areaApi,
  districtApi,
  wardApi,
  jobApi,
  puroseApi,
  branchApi,
  sourceInfomationApi,
  parentsApi,
  staffApi,
} from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { data } from "~/lib/option/dataOption2";

let returnSchema = {};
let schema = null;

interface listData {
  Area: Array<Object>;
  DistrictID: Array<Object>;
  WardID: Array<Object>;
  Job: Array<Object>;
  Branch: Array<Object>;
  Purposes: Array<Object>;
  SourceInformation: Array<Object>;
  Parent: Array<Object>;
  Counselors: Array<Object>;
}

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
    api: parentsApi,
    text: "Phụ huynh",
    name: "Parent",
  },
  {
    api: sourceInfomationApi,
    text: "Nguồn khách hàng",
    name: "SourceInformation",
  },
  {
    api: staffApi,
    text: "Nguồn khách hàng",
    name: "Counselors",
  },
];

const StudentForm = (props) => {
  const { dataRow, listDataForm } = props;
  console.log("Data Row: ", dataRow);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [imageUrl, setImageUrl] = useState();
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState({
    status: false,
    name: "",
  });
  const [listData, setListData] = useState<listData>(listDataForm);

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
      case "DistrictID":
        newData = data.map((item) => ({
          title: item.DistrictName,
          value: item.ID,
        }));
        break;
      case "WardID":
        newData = data.map((item) => ({
          title: item.WardName,
          value: item.ID,
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
      case "Parent":
        newData = data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        break;
      case "SourceInformation":
        newData = data.map((item) => ({
          title: item.SourceInformationName,
          value: item.SourceInformationID,
        }));
        break;
      case "Counselors":
        newData = data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
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
  // const getDataSource = (arrApi) => {
  //   arrApi.forEach((item, index) => {
  //     (async () => {
  //       let res = null;
  //       try {
  //         if (item.name == "Counselors") {
  //           res = await item.api.getAll({
  //             pageIndex: 1,
  //             pageSize: 99999,
  //             RoleID: 6,
  //           });
  //         } else {
  //           res = await item.api.getAll({ pageIndex: 1, pageSize: 99999 });
  //         }

  //         res.status == 200 && getDataTolist(res.data.data, item.name);

  //         res.status == 204 &&
  //           showNoti("danger", item.text + " Không có dữ liệu");
  //       } catch (error) {
  //         showNoti("danger", error.message);
  //       } finally {
  //       }
  //     })();
  //   });
  // };

  //  ----- GET DATA DISTRICT -------
  const getDataWithID = async (ID, name) => {
    let res = null;
    setLoadingSelect({
      status: true,
      name: name,
    });
    try {
      switch (name) {
        case "DistrictID":
          res = await districtApi.getAll({
            AreaID: ID,
          });
          break;
        case "WardID":
          res = await wardApi.getAll({
            DistrictID: ID,
          });
          break;
        default:
          break;
      }

      res.status == 200 && getDataTolist(res.data.data, name);

      res.status == 204 && showNoti("danger", name + " không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingSelect({
        status: false,
        name: name,
      });
    }
  };

  // ----- HANDLE CHANGE - AREA ----------
  const handleChange_select = (value, name) => {
    console.log("Value is: ", value);

    form.setValue(name, undefined);
    getDataWithID(value, name);
  };

  // -----  DEFAULT VALUE INIT -------------
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
  const onSubmit = async (data: any) => {
    if (data.Branch !== null) {
      data.Branch = data.Branch.toString();
    }
    console.log("DATA SUBMIT: ", data);
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });
    let res = null;
    try {
      if (data.UserInformationID) {
        res = await studentApi.update(data);
      } else {
        res = await studentApi.add(data);
      }

      res?.status == 200 &&
        (showNoti(
          "success",
          data.UserInformationID
            ? "Cập nhật học viên thành công"
            : "Tạo học viên thành công"
        ),
        form.reset(defaultValuesInit),
        setImageUrl(null));
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "ADD_DATA",
        status: false,
      });
    }
  };

  // ------------ AVATAR --------------
  const UploadButton = (props) => {
    const { imageUrl } = props;
    return (
      <>
        <div
          className={`bg-upload ${imageUrl && "have-img"} ${
            loadingImage && "loading"
          }`}
        >
          {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
      </>
    );
  };

  const handleChange_img = async (info: any) => {
    console.log("Info file: ", info.file.originFileObj);
    if (info.file.status === "uploading") {
      setLoadingImage(true);
      return;
    }

    try {
      let res = await studentApi.uploadImage(info.file.originFileObj);
      res?.status == 200 &&
        (showNoti("success", "Upload ảnh thành công"),
        setImageUrl(res.data.data),
        form.setValue("Avatar", res.data.data));
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    // getDataSource(listApi);

    if (dataRow) {
      let arrBranch = [];
      dataRow.Branch.forEach((item, index) => {
        arrBranch.push(item.ID);
      });
      dataRow.Branch = arrBranch;
      form.reset(dataRow);
      getDataWithID(dataRow.AreaID, "DistrictID");
      getDataWithID(dataRow.DistrictID, "WardID");
      setImageUrl(dataRow.Avatar);
    } else {
      form.setValue("Branch", undefined);
    }
  }, []);

  return (
    <div>
      <div className="col-12 d-flex justify-content-center">
        <Card title="Phiếu thông tin cá nhân" className="w-70 w-100-mobile">
          <div className="wrap-form">
            <Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
              {/*  */}

              {/** ==== Thông tin cơ bản  ====*/}
              <div className="row">
                <div className="col-12">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    // beforeUpload={beforeUpload}
                    onChange={handleChange_img}
                  >
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: imageUrl ? "block" : "none",
                      }}
                    />

                    <UploadButton imageUrl={imageUrl} />
                  </Upload>
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
                  <InputTextField form={form} name="CMND" label="Số CMND" />
                </div>
                <div className="col-md-4 col-12">
                  <InputTextField
                    form={form}
                    name="CMNDRegister"
                    label="Nơi cấp CMND"
                  />
                </div>
                <div className="col-md-4 col-12">
                  <DateField form={form} name="CMNDDate" label="Ngày cấp" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="Gender"
                    label="Giới tính"
                    optionList={optionGender}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="JobID"
                    label="Công việc"
                    optionList={listData.Job}
                  />
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
                    onChangeSelect={
                      (value) => handleChange_select(value, "DistrictID") // Select Area to load District
                    }
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    isLoading={
                      loadingSelect.name == "DistrictID" && loadingSelect.status
                    }
                    form={form}
                    name="DistrictID"
                    label="Quận/Huyện"
                    optionList={listData.DistrictID}
                    onChangeSelect={
                      (value) => handleChange_select(value, "WardID") // Select District to load Ward
                    }
                  />
                </div>
              </div>
              {/*  */}
              {/*  */}
              {/*  */}

              <div className="row">
                <div className="col-md-6 col-12">
                  <SelectField
                    isLoading={
                      loadingSelect.name == "WardID" && loadingSelect.status
                    }
                    form={form}
                    name="WardID"
                    label="Phường/Xã"
                    optionList={listData.WardID}
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
                    mode="multiple"
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
                  <SelectField
                    form={form}
                    name="ParentsOf"
                    label="Phụ huynh"
                    optionList={listData.Parent}
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
                <div className="col-md-6 col-12">
                  <TextAreaField
                    name="Extension"
                    label="Giới thiệu thêm"
                    form={form}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    form={form}
                    name="CounselorsID"
                    label="Tư vấn viên"
                    optionList={listData.Counselors}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 d-flex justify-content-end">
                  <div style={{ paddingRight: 5 }}>
                    <button type="submit" className="btn btn-primary w-100">
                      Lưu
                      {isLoading.type == "ADD_DATA" && isLoading.status && (
                        <Spin className="loading-base" />
                      )}
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
StudentForm.layout = LayoutBase;
export default StudentForm;
