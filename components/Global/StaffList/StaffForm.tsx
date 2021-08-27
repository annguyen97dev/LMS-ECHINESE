import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Form, Divider, Spin, Modal, Tooltip } from "antd";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import InputTextField from "~/components/FormControl/InputTextField";
import DateField from "~/components/FormControl/DateField";
import SelectField from "~/components/FormControl/SelectField";
import TextAreaField from "~/components/FormControl/TextAreaField";
import { districtApi, wardApi, branchApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { data } from "~/lib/option/dataOption2";
import AvatarBase from "~/components/Elements/AvatarBase.tsx";
import {
  UserOutlined,
  DeploymentUnitOutlined,
  WhatsAppOutlined,
  MailOutlined,
  AimOutlined,
} from "@ant-design/icons";

import { Eye } from "react-feather";
import SalaryForm from "./SalaryForm";

type LayoutType = Parameters<typeof Form>[0]["layout"];

let returnSchema = {};
let schema = null;

interface listData {
  Area: Array<Object>;
  DistrictID: Array<Object>;
  WardID: Array<Object>;
  Role: Array<Object>;
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
    value: 2,
    title: "Khác",
  },
];

const StaffForm = (props) => {
  const {
    rowData,
    listDataForm,
    onSubmit,
    isLoading,
    rowID,
    getIndex,
    index,
    onSubmitSalary,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { showNoti } = useWrap();
  const showModal = () => {
    setIsModalVisible(true);
    rowID && getIndex(index);
  };

  const [loadingSelect, setLoadingSelect] = useState({
    status: false,
    name: "",
  });
  const [listData, setListData] = useState<listData>(listDataForm);
  const [imageUrl, setImageUrl] = useState(null);
  // const [statusAdd, setStatusAdd] = useState("add-staff");
  const [disableCenter, setDisableCenter] = useState(false);
  const [statusAdd, setStatusAdd] = useState("add-staff");
  const [dataStaff, setDataStaff] = useState(null);
  const [submitSalary, setSubmitSalary] = useState(true);

  // console.log("Row Data: ", rowData);

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

  const getDataWithID = async (ID, name) => {
    console.log("NAME is: ", name);

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
            pageIndex: 1,
            pageSize: 9999,
          });
          break;
        case "WardID":
          res = await wardApi.getAll({
            DistrictID: ID,
            pageIndex: 1,
            pageSize: 9999,
          });
          break;
        // case "Branch":
        //   res = await branchApi.getAll({
        //     DistrictID: form.getValues("DistrictID"),
        //     AreaID: form.getValues("AreaID"),
        //   });
        //   break;
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

    if (name == "DistrictID") {
      form.setValue("WardID", null);

      listData.DistrictID = [];
      listData.WardID = [];
      setListData({ ...listData });
    }
    form.setValue(name, null);
    getDataWithID(value, name);
  };

  // HANDLE CHANGE ROLE
  const handleChange_Role = (value) => {
    if (value == 1) {
      setDisableCenter(true);
    } else {
      setDisableCenter(false);
    }
    form.setValue("RoleID", value);
  };

  // -----  HANDLE ALL IN FORM -------------
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
    Jobdate: null,
    Gender: null, //int 0-Nữ 1-Nam 2-Khác
    CMND: null, //int số CMND
    CMNDDate: null, //Ngày làm
    CMNDRegister: null, //Nơi làm CMND
    Extension: null, //giới thiệu thêm
    Branch: undefined, //string : id của trung tâm - LƯU Ý NẾU TỪ 2 TRUNG TÂM TRỞ LÊN THÌ NHẬP(ID,ID,ID)
    RoleID: null, //int mã công việc
    StatusID: null,
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
        // case "Mobile":
        //   returnSchema[key] = yup
        //     .number()
        //     .typeError("SDT phải là số")
        //     .required("Bạn không được để trống");
        //   break;
        // case "CMND":
        //   returnSchema[key] = yup
        //     .number()
        //     .typeError("CMND phải là số")
        //     .required("Bạn không được để trống");
        //   break;
        case "CounselorsID":
          returnSchema[key] = yup.mixed().required("Bạn không được để trống");
          break;
        case "Branch":
          if (!disableCenter) {
            returnSchema[key] = yup.array().required("Bạn không được để trống");
          }

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
  const onSubmitForm = (data: any) => {
    console.log("DATA staff: ", data);

    let res = onSubmit(data);
    res.then(function (rs: any) {
      if (rs) {
        if (rs.status == 200) {
          if (!rowData) {
            form.reset(defaultValuesInit);
            setImageUrl("");
            setStatusAdd("add-salary");
            setDataStaff({
              UserInformationID: rs.data.data.UserInformationID,
              FullNameUnicode: data.FullNameUnicode,
            });
            // formSalary.reset({
            //   UserInformationID: data.UserInformationID,
            //   FullNameUnicode: data.FullNameUnicode,
            // });
          } else {
            setIsModalVisible(false);
          }
        }
      }
    });
  };

  const changeVisible = () => {
    if (isModalVisible) {
      setIsModalVisible(false);
      setStatusAdd("add-staff");
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      if (rowData) {
        let arrBranch = [];
        let cloneRowData = { ...rowData };
        cloneRowData.Branch.forEach((item, index) => {
          arrBranch.push(item.ID);
        });
        cloneRowData.Branch = arrBranch;
        form.reset(cloneRowData);
        cloneRowData.AreaID && getDataWithID(cloneRowData.AreaID, "DistrictID");
        cloneRowData.DistrictID &&
          getDataWithID(cloneRowData.DistrictID, "WardID");
        setImageUrl(cloneRowData.Avatar);
        // for form salary
        // formSalary.reset({
        //   UserInformationID: rowData.UserInformationID,
        //   FullNameUnicode: rowData.FullNameUnicode,
        // });
      } else {
        form.setValue("StatusID", 0);
      }
    }
  }, [isModalVisible]);

  console.log("status add: ", statusAdd);

  return (
    <>
      {rowID ? (
        <button className="btn btn-icon" onClick={showModal}>
          <Tooltip title="Chi tiết">
            <Eye />
          </Tooltip>
        </button>
      ) : (
        <button className="btn btn-warning add-new" onClick={showModal}>
          Thêm mới
        </button>
      )}

      <Modal
        style={{ top: 20 }}
        title={
          statusAdd == "add-staff"
            ? "Tạo mới nhân viên"
            : "Thêm lương cho nhân viên"
        }
        visible={isModalVisible}
        footer={
          statusAdd == "add-staff" ? (
            <div className="row">
              <div className="col-12 d-flex justify-content-center">
                <div style={{ paddingRight: 5 }}>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={form.handleSubmit(onSubmitForm)}
                  >
                    Lưu nhân viên
                    {isLoading.type == "ADD_DATA" && isLoading.status && (
                      <Spin className="loading-base" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null
        }
        onCancel={() => setIsModalVisible(false)}
        className={`${statusAdd == "add-staff" ? "modal-50 modal-scroll" : ""}`}
      >
        {statusAdd == "add-staff" ? (
          <div className="box-form form-staff">
            <Form layout="vertical" onFinish={form.handleSubmit(onSubmitForm)}>
              {/*  */}

              {/** ==== Thông tin cơ bản  ====*/}
              <div className="row">
                <div className="col-md-2 col-12">
                  <AvatarBase
                    imageUrl={imageUrl}
                    getValue={(value) => form.setValue("Avatar", value)}
                  />
                </div>
                <div className="col-md-10 col-12">
                  {rowData && (
                    <div className="box-info-modal">
                      <p className="name">{rowData?.FullNameUnicode}</p>
                      <p className="detail">
                        <span className="icon role">
                          <DeploymentUnitOutlined />
                        </span>
                        <span className="text">{rowData?.RoleName}</span>
                      </p>
                      <p className="detail">
                        <span className="icon mobile">
                          <WhatsAppOutlined />
                        </span>
                        <span className="text">{rowData?.Mobile}</span>
                      </p>
                      <p className="detail">
                        <span className="icon email">
                          <MailOutlined />
                        </span>
                        <span className="text">{rowData?.Email}</span>
                      </p>
                    </div>
                  )}
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
                <div className="col-md-6 col-12">
                  <InputTextField form={form} name="CMND" label="Số CMND" />
                </div>
                <div className="col-md-6 col-12">
                  <InputTextField
                    form={form}
                    name="CMNDRegister"
                    label="Nơi cấp CMND"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-12">
                  <DateField
                    form={form}
                    name="CMNDDate"
                    label="Ngày cấp CMND"
                  />
                </div>
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
                    name="RoleID"
                    label="Vị trí"
                    optionList={listData.Role}
                    onChangeSelect={
                      (value) => handleChange_Role(value) // Select Area to load District
                    }
                  />
                </div>
                <div className="col-md-6 col-12">
                  <SelectField
                    disabled={!rowID && true}
                    form={form}
                    name="StatusID"
                    label="Trạng thái hoạt động"
                    optionList={[
                      {
                        value: 0,
                        title: "Hoạt động",
                      },
                      {
                        value: 1,
                        title: "Khóa",
                      },
                    ]}
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
                <div className="col-md-12 col-12">
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
                    isLoading={
                      loadingSelect.name == "Branch" && loadingSelect.status
                    }
                    mode="multiple"
                    form={form}
                    name="Branch"
                    label="Tên trung tâm"
                    optionList={listData.Branch}
                    disabled={disableCenter}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <DateField form={form} name="Jobdate" label="Ngày vào làm" />
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 col-12">
                  <TextAreaField
                    name="Extension"
                    label="Giới thiệu thêm"
                    form={form}
                    rows={4}
                  />
                </div>
              </div>

              <div className="row d-none">
                <div className="col-12 d-flex justify-content-center">
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
        ) : (
          <SalaryForm
            dataStaff={dataStaff}
            // onSubmitSalary={(data: any) => {
            //   let res = onSubmitSalary(data);
            //   return res;
            // }}
            changeVisible={changeVisible}
            isLoading={isLoading}
            submitSalary={submitSalary}
          />
        )}
      </Modal>
    </>
  );
};

export default StaffForm;
